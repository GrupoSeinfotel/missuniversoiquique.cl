from pathlib import Path
import ftplib,json,sys,hashlib

if sys.argv[1:]!=['--restaurar-portada']:
 raise SystemExit('No se hizo ningún cambio. Usa --restaurar-portada solo si deseas volver a la portada anterior.')
backup=Path('C:/MISS UNIVERSO/backups/iquique-20261015/servidor-original')
assert (backup/'index.html').is_file() and (backup/'.htaccess').is_file()
c=json.loads(Path('C:/Users/crist/.codex/private/missiquique-deploy.json').read_text())
f=ftplib.FTP(c['host'],timeout=60);f.login(c['username'],c['password'])
try:
 for name in ['index.html','.htaccess']:
  with (backup/name).open('rb') as source:f.storbinary('STOR /'+name,source)
finally:f.quit()
print('Portada y reglas anteriores restauradas. No se borraron datos de ninguna edición.')
