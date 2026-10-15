"""Publica únicamente la versión Iquique preparada. Respaldo previo obligatorio."""
from pathlib import Path
import ftplib,json,hashlib,urllib.request,sys,re,io

SITE=Path(__file__).resolve().parents[2]
PUBLIC=SITE/'2027/produccion'
BACKUP=Path('C:/MISS UNIVERSO/backups/iquique-20261015')
config=json.loads(Path('C:/Users/crist/.codex/private/missiquique-deploy.json').read_text())
manifest=json.loads((BACKUP/'manifiesto-backup-servidor.json').read_text())
assert not manifest['failed'] and len(manifest['files'])==609,'El respaldo remoto debe estar completo.'
assert (BACKUP/'base-servidor-original.json.gz').is_file(),'Falta el respaldo de la base del alojamiento.'
assert json.loads((BACKUP/'resumen-backup-local.json').read_text())['validation']=='OK','Falta verificar la copia local.'

def connect():
 f=ftplib.FTP(config['host'],timeout=90);f.login(config['username'],config['password']);return f
def mkdirs(f,path):
 parts=Path(path).as_posix().strip('/').split('/')[:-1];base=''
 for part in parts:
  base+='/'+part
  try:f.mkd(base)
  except ftplib.error_perm as e:
   if not str(e).startswith('550'):raise
def put(f,path,remote):
 mkdirs(f,remote)
 with path.open('rb') as source:f.storbinary('STOR '+remote,source,blocksize=262144)
 if f.size(remote)!=path.stat().st_size:raise RuntimeError('Tamaño remoto no coincide: '+remote)
def fetch(url):
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'})
 with urllib.request.urlopen(req,timeout=90) as r:return r.read()

def stage():
 # Archivo histórico sin scripts de venta/voto; usa el HTML real respaldado.
 historical=(BACKUP/'servidor-original/index.html').read_text(encoding='utf-8')
 historical=re.sub(r'<script\b[^>]*>.*?</script\s*>','',historical,flags=re.S|re.I)
 historical=re.sub(r'<button\b','<button disabled data-historico="true"',historical,flags=re.I)
 banner='<aside style="position:fixed;bottom:0;left:0;right:0;z-index:2147483647;background:#08162d;color:white;padding:16px;font:14px Arial;text-align:center">Archivo 2026 · Registro histórico. Ventas y votaciones cerradas. <a style="color:#a8eaff;margin-left:20px" href="/#archivo">Ver el legado</a> · <a style="color:#a8eaff" href="/">Ir a 2027</a></aside>'
 historical=historical.replace('</body>',banner+'</body>').replace('</head>','<meta name="robots" content="noindex,follow"></head>')
 (PUBLIC/'legado/2026/index.html').write_text(historical,encoding='utf-8')
 files=[]
 for p in sorted(PUBLIC.rglob('*')):
  if not p.is_file() or p.name=='index.html' and p.parent==PUBLIC:continue
  rel=p.relative_to(PUBLIC).as_posix()
  if '/assets/neon/' in '/'+rel and p.suffix=='.png':continue # maestros preservados localmente; se sirven los WEBP optimizados.
  if p.suffix not in {'.html','.css','.js','.json','.svg','.webp','.png','.php'} and p.name!='.htaccess':raise RuntimeError('Tipo no autorizado: '+rel)
  if '..' in rel or not (rel.startswith('iquique2027/') or rel.startswith('legado/2026/')):raise RuntimeError('Destino fuera del alcance de Iquique 2027')
  files.append((p,'/'+rel))
 f=connect();uploaded=[]
 try:
  for p,remote in files:
   put(f,p,remote);uploaded.append({'path':remote,'bytes':p.stat().st_size,'sha256':hashlib.file_digest(p.open('rb'),'sha256').hexdigest()})
  put(f,PUBLIC/'index.html','/iquique-2027-revision.html')
 finally:f.quit()
 (BACKUP/'manifiesto-publicacion-2027.json').write_text(json.dumps(uploaded,indent=2),encoding='utf-8')
 data=json.loads(fetch('https://missuniversoiquique.cl/iquique2027/api.php?action=public'))
 assert data['candidates']==[] and not data['settings']['free_voting'],'No deben publicarse candidatas de prueba ni votación abierta.'
 history=json.loads(fetch('https://missuniversoiquique.cl/iquique2027/legacy-2026.json'))
 assert len(history['candidates'])==11 and history['winner']=='Ayalent Álvarez'
 print(json.dumps({'staged':len(files),'bytes':sum(x['bytes'] for x in uploaded),'api':'OK','legacy_candidates':11,'public_posts':len(history['posts']),'preview':'https://missuniversoiquique.cl/iquique-2027-revision.html'}))

def activate():
 # Solo después de revisar la versión preparada. La copia original ya fue descargada y verificada.
 expected=hashlib.file_digest((PUBLIC/'index.html').open('rb'),'sha256').hexdigest()
 check=connect();staged=io.BytesIO()
 try:check.retrbinary('RETR /iquique-2027-revision.html',staged.write)
 finally:check.quit()
 assert hashlib.sha256(staged.getvalue()).hexdigest()==expected,'El archivo de revisión no coincide con el preparado.'
 legacy=json.loads((PUBLIC/'iquique2027/legacy-2026.json').read_text(encoding='utf-8'))
 original=(BACKUP/'servidor-original/.htaccess').read_text(encoding='utf-8')
 rules=['','<IfModule mod_rewrite.c>','RewriteEngine On']
 for route,target in [('casting','casting'),('sponsors','sponsors'),('sponsor','sponsor-contacto'),('sobre-nosotros','certamen'),('descubre-iquique','iquique'),('beneficios','camino'),('datospresentacion','panel')]:
  rules.append('RewriteRule ^'+route+r'(?:/index\.(?:php|html))?/?$ /#'+target+' [R=302,L,NE]')
 for c in legacy['candidates']:
  slug=c['slug']
  if re.fullmatch('[a-zA-Z0-9_-]+',slug):rules.append('RewriteRule ^candidata/'+re.escape(slug)+r'/?$ /#legado-perfil/'+c['id']+' [R=302,L,NE]')
 rules.append('</IfModule>')
 (PUBLIC/'.htaccess').write_text(original+'\n'+'\n'.join(rules)+'\n',encoding='utf-8')
 f=connect()
 try:
  # RNTO sobre el índice existente evita una transferencia parcial de la portada.
  f.rename('/iquique-2027-revision.html','/index.html')
  put(f,PUBLIC/'.htaccess','/.htaccess')
  original=io.BytesIO();f.retrbinary('RETR /index.html',original.write)
  assert hashlib.sha256(original.getvalue()).hexdigest()==expected,'La portada publicada no coincide con la versión comprobada.'
 finally:f.quit()
 published=fetch('https://missuniversoiquique.cl/')
 # Cloudflare añade su propio beacon al HTML en tránsito; el hash íntegro se verifica por FTP arriba.
 assert b'/iquique2027/production.js' in published and b'Miss Universo Iquique' in published,'La página HTTP no sirve la nueva publicación.'
 print(json.dumps({'published':True,'url':'https://missuniversoiquique.cl/','index_sha256':expected,'historical_profile_redirects':len(legacy['candidates'])}))

if __name__=='__main__':
 if sys.argv[1:] == ['activate']:activate()
 else:stage()
