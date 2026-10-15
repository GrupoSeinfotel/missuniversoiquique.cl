"""Servidor de desarrollo/autohospedaje. Python 3.11+, sin dependencias externas."""
import argparse, base64, hashlib, hmac, json, os, re, secrets, sqlite3, time
from contextlib import contextmanager
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
DB = Path(os.environ.get('MUA_DB', ROOT / 'data' / 'iquique.sqlite3'))
DB.parent.mkdir(parents=True, exist_ok=True)
SECURE = os.environ.get('MUA_SECURE_COOKIE') == '1'

@contextmanager
def connect():
    c=sqlite3.connect(DB,timeout=15);c.row_factory=sqlite3.Row;c.execute('PRAGMA foreign_keys=ON')
    try:
        yield c
        c.commit()
    except Exception:
        c.rollback()
        raise
    finally:c.close()

def initialize():
    with connect() as c:
        c.executescript('''
        CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('voter','candidate','admin')));
        CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),csrf TEXT NOT NULL,expires INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS candidates(id TEXT PRIMARY KEY,user_id TEXT UNIQUE REFERENCES users(id),name TEXT NOT NULL,bio TEXT,purpose TEXT,photo TEXT,media TEXT NOT NULL,published INTEGER NOT NULL DEFAULT 0);
        CREATE TABLE IF NOT EXISTS votes(id INTEGER PRIMARY KEY,user_id TEXT REFERENCES users(id),candidate_id TEXT REFERENCES candidates(id),day TEXT NOT NULL,UNIQUE(user_id,day));
        CREATE TABLE IF NOT EXISTS leads(id INTEGER PRIMARY KEY,kind TEXT,name TEXT,email TEXT,phone TEXT,company TEXT,message TEXT,consent INTEGER,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS submissions(id INTEGER PRIMARY KEY,user_id TEXT REFERENCES users(id),level INTEGER CHECK(level BETWEEN 1 AND 17),evidence TEXT,status TEXT DEFAULT 'pending',UNIQUE(user_id,level));
        CREATE TABLE IF NOT EXISTS news(id INTEGER PRIMARY KEY,title TEXT,body TEXT,date TEXT DEFAULT CURRENT_DATE);
        CREATE TABLE IF NOT EXISTS sponsors(id INTEGER PRIMARY KEY,name TEXT,description TEXT);
        CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
        CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,user_id TEXT,action TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,start INTEGER,count INTEGER);
        INSERT OR IGNORE INTO settings VALUES('free_voting','false');
        ''')

def password_hash(value):
    salt=secrets.token_bytes(16);return base64.b64encode(salt+hashlib.scrypt(value.encode(),salt=salt,n=16384,r=8,p=1)).decode()

def verify(value,stored):
    raw=base64.b64decode(stored);return hmac.compare_digest(raw[16:],hashlib.scrypt(value.encode(),salt=raw[:16],n=16384,r=8,p=1))

def text(data,key,minimum=0,maximum=5000):
    s=data.get(key,'')
    if not isinstance(s,str) or not minimum<=len(s.strip())<=maximum:raise ValueError('Campo inválido: '+key)
    return s.strip()

def email(data):
    e=text(data,'email',3,254).lower()
    if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',e):raise ValueError('Email inválido')
    return e

def url(value):
    if not isinstance(value,str) or len(value)>2000:raise ValueError('URL inválida')
    if value=='':return value
    if value.startswith('/assets/') and '..' not in value and not any(c in value for c in '\\?#'):return value
    p=urlsplit(value)
    if p.scheme!='https' or not p.netloc or p.username or p.password:raise ValueError('Usa enlaces HTTPS o archivos /assets/')
    return value

def level(c,uid):
    approved={r[0] for r in c.execute("SELECT level FROM submissions WHERE user_id=? AND status='approved'",(uid,))};n=1
    while n in approved and n<17:n+=1
    return n

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kw):super().__init__(*args,directory=str(ROOT/'public'),**kw)
    def log_message(self,fmt,*args):pass # no PII en logs de acceso
    def end_headers(self):
        for k,v in {'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",'Cache-Control':'no-store'}.items():self.send_header(k,v)
        super().end_headers()
    def reply(self,status,data,cookie=None):
        b=json.dumps(data,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(b)))
        if cookie:self.send_header('Set-Cookie',cookie)
        self.end_headers();self.wfile.write(b)
    def session(self,c):
        token=''
        for part in self.headers.get('Cookie','').split(';'):
            if part.strip().startswith('mua_session='):token=part.strip().split('=',1)[1]
        self.token=hashlib.sha256(token.encode()).hexdigest()
        row=c.execute('SELECT u.*,s.csrf FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?',(self.token,time.time())).fetchone()
        return dict(row) if row else None
    def require(self,user,role=None):
        if not user:raise PermissionError('Inicia sesión para continuar')
        if role and user['role']!=role:raise PermissionError('No tienes permisos para esta operación')
    def do_GET(self):
        if not self.path.startswith('/api/'):
            if self.path.split('?',1)[0].startswith('/.'):
                self.send_error(404);return
            return super().do_GET()
        try:
            with connect() as c:
                user=self.session(c);path=urlsplit(self.path).path[5:]
                if path=='me':return self.reply(200,{'user':{k:user[k] for k in ('id','name','email','role')} if user else None,'csrf':user['csrf'] if user else None})
                if path=='public':
                    candidates=[]
                    for row in c.execute('SELECT * FROM candidates WHERE published=1 ORDER BY name'):
                        d=dict(row);d.pop('user_id');d.update(json.loads(d.pop('media')));d['level']=level(c,row['user_id']);candidates.append(d)
                    ranks=[dict(r) for r in c.execute('SELECT c.id,c.name,COUNT(v.id) votes FROM candidates c JOIN votes v ON c.id=v.candidate_id WHERE c.published=1 GROUP BY c.id ORDER BY votes DESC,c.name')]
                    for i,r in enumerate(ranks):r['position']=i+1 if i==0 or r['votes']!=ranks[i-1]['votes'] else ranks[i-1]['position']
                    return self.reply(200,{'candidates':candidates,'ranking':ranks,'news':[dict(r) for r in c.execute('SELECT * FROM news ORDER BY id DESC')],'sponsors':[dict(r) for r in c.execute('SELECT * FROM sponsors')],'settings':{'free_voting':c.execute("SELECT value FROM settings WHERE key='free_voting'").fetchone()[0]=='true'}})
                if path=='admin':
                    self.require(user,'admin');return self.reply(200,{'leads':[dict(r) for r in c.execute('SELECT * FROM leads ORDER BY id DESC')],'users':[dict(r) for r in c.execute('SELECT id,name,email,role FROM users')],'submissions':[dict(r) for r in c.execute('SELECT s.*,u.name FROM submissions s JOIN users u ON s.user_id=u.id')]})
                if path=='candidate':
                    self.require(user,'candidate');return self.reply(200,{'level':level(c,user['id']),'submissions':[dict(r) for r in c.execute('SELECT * FROM submissions WHERE user_id=?',(user['id'],))]})
                self.reply(404,{'error':'Ruta no encontrada'})
        except PermissionError as e:self.reply(403,{'error':str(e)})
        except Exception:self.reply(500,{'error':'Error interno del servidor'})
    def do_POST(self):
        try:
            origin=self.headers.get('Origin')
            if origin and origin not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):raise PermissionError('Origen no permitido')
            size=int(self.headers.get('Content-Length','0'))
            if size<2 or size>32000:raise ValueError('Solicitud demasiado grande o vacía')
            if 'application/json' not in self.headers.get('Content-Type',''):raise ValueError('Se requiere JSON')
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict):raise ValueError('JSON inválido')
            path=urlsplit(self.path).path[5:]
            with connect() as c:
                # Throttle writes persistently. Do not trust forwarded headers.
                bucket=self.client_address[0]+':'+path;now=int(time.time());row=c.execute('SELECT * FROM rate_limits WHERE key=?',(bucket,)).fetchone()
                if row and now-row['start']<900 and row['count']>=30:return self.reply(429,{'error':'Demasiados intentos. Intenta más tarde.'})
                if not row or now-row['start']>=900:c.execute('INSERT OR REPLACE INTO rate_limits VALUES(?,?,1)',(bucket,now))
                else:c.execute('UPDATE rate_limits SET count=count+1 WHERE key=?',(bucket,))
                c.commit();user=self.session(c)
                if path not in ('login','register','lead'):
                    self.require(user)
                    if not hmac.compare_digest(self.headers.get('X-CSRF-Token',''),user['csrf']):raise PermissionError('Sesión inválida. Recarga la página.')
                if path in ('register','login'):
                    e=email(data);pw=text(data,'password',12,128)
                    if path=='register':
                        uid=secrets.token_hex(16);c.execute('INSERT INTO users VALUES(?,?,?,?,?)',(uid,text(data,'name',1,120),e,password_hash(pw),'voter'))
                    row=c.execute('SELECT * FROM users WHERE email=?',(e,)).fetchone()
                    if not row or not verify(pw,row['password']):raise PermissionError('Correo o contraseña incorrectos')
                    token=secrets.token_urlsafe(32);csrf=secrets.token_urlsafe(24);c.execute('DELETE FROM sessions WHERE expires<?',(now,));c.execute('INSERT INTO sessions VALUES(?,?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),row['id'],csrf,now+28800));c.commit()
                    return self.reply(200,{'ok':True},'mua_session='+token+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800'+('; Secure' if SECURE else ''))
                if path=='logout':c.execute('DELETE FROM sessions WHERE token=?',(self.token,))
                elif path=='lead':
                    kind=text(data,'kind')
                    if kind not in ('casting','sponsor','contact') or data.get('consent') is not True:raise ValueError('Se requiere consentimiento y tipo de solicitud válido')
                    c.execute('INSERT INTO leads(kind,name,email,phone,company,message,consent) VALUES(?,?,?,?,?,?,1)',(kind,text(data,'name',1,120),email(data),text(data,'phone',0,30),text(data,'company',1 if kind=='sponsor' else 0,160),text(data,'message',1,3000)))
                elif path=='vote':
                    if c.execute("SELECT value FROM settings WHERE key='free_voting'").fetchone()[0]!='true':raise ValueError('La votación está cerrada')
                    cid=text(data,'candidate_id',1,100)
                    if not c.execute('SELECT id FROM candidates WHERE id=? AND published=1',(cid,)).fetchone():raise ValueError('Candidata no publicada')
                    day=datetime.now(ZoneInfo('America/Santiago')).date().isoformat();c.execute('INSERT INTO votes(user_id,candidate_id,day) VALUES(?,?,?)',(user['id'],cid,day))
                elif path=='submission':
                    self.require(user,'candidate');n=int(data.get('level',0))
                    if n!=level(c,user['id']):raise ValueError('Solo puedes entregar la misión de tu nivel actual')
                    c.execute("INSERT INTO submissions(user_id,level,evidence) VALUES(?,?,?) ON CONFLICT(user_id,level) DO UPDATE SET evidence=excluded.evidence,status='pending' WHERE submissions.status='rejected'",(user['id'],n,text(data,'evidence',10,5000)))
                elif path.startswith('admin/'):
                    self.require(user,'admin')
                    if path=='admin/settings':
                        if type(data.get('free_voting')) is not bool:raise ValueError('Estado inválido')
                        c.execute("UPDATE settings SET value=? WHERE key='free_voting'",(json.dumps(data['free_voting']),))
                    elif path=='admin/candidate':
                        cid=text(data,'id',1,100)
                        if not re.fullmatch('[a-z0-9-]+',cid):raise ValueError('Identificador inválido')
                        owner=c.execute('SELECT * FROM users WHERE email=?',(email(data),)).fetchone()
                        if not owner or owner['role']=='admin':raise ValueError('La cuenta de candidata debe existir y no ser administradora')
                        media={k:data.get(k,[]) for k in ('gallery','videos','socials')}
                        for k in ('gallery','videos'):
                            if not isinstance(media[k],list) or len(media[k])>30:raise ValueError('Galería inválida')
                            media[k]=[url(u) for u in media[k]]
                        if not isinstance(media['socials'],list) or len(media['socials'])>10:raise ValueError('Redes inválidas')
                        media['socials']=[{'label':text(s,'label',1,50),'url':url(text(s,'url',1,2000))} for s in media['socials']]
                        category=data.get('category','todas')
                        if category not in ('todas','talento','turismo','cultura','redes','provincia'):raise ValueError('Categoría inválida')
                        media['category']=category
                        c.execute('''INSERT INTO candidates VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET user_id=excluded.user_id,name=excluded.name,bio=excluded.bio,purpose=excluded.purpose,photo=excluded.photo,media=excluded.media,published=excluded.published''',(cid,owner['id'],text(data,'name',1,120),text(data,'bio',1,5000),text(data,'purpose'),url(text(data,'photo',0,2000)),json.dumps(media),int(data.get('published') is True)))
                        c.execute("UPDATE users SET role='candidate' WHERE id=?",(owner['id'],))
                    elif path=='admin/news':c.execute('INSERT INTO news(title,body) VALUES(?,?)',(text(data,'title',1,200),text(data,'body',1,5000)))
                    elif path=='admin/sponsor':c.execute('INSERT INTO sponsors(name,description) VALUES(?,?)',(text(data,'name',1,160),text(data,'description',1,3000)))
                    elif path=='admin/review':
                        status=text(data,'status')
                        if status not in ('approved','rejected'):raise ValueError('Estado inválido')
                        c.execute("UPDATE submissions SET status=? WHERE id=? AND status='pending'",(status,int(data['id'])))
                    else:return self.reply(404,{'error':'Ruta no encontrada'})
                    c.execute('INSERT INTO audit(user_id,action) VALUES(?,?)',(user['id'],path))
                elif path.startswith('payment'):return self.reply(503,{'error':'Pagos sin integrar. No se crea ningún cobro.'})
                else:return self.reply(404,{'error':'Ruta no encontrada'})
                c.commit();self.reply(200,{'ok':True})
        except PermissionError as e:self.reply(403,{'error':str(e)})
        except sqlite3.IntegrityError:self.reply(409,{'error':'Ya existe el registro o ya emitiste tu voto de hoy.'})
        except (ValueError,TypeError,KeyError):self.reply(400,{'error':'Datos inválidos. Revisa los campos y las reglas de la operación.'})
        except Exception:self.reply(500,{'error':'Error interno del servidor'})

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8028);parser.add_argument('--host',default='127.0.0.1');parser.add_argument('--create-admin',metavar='EMAIL');args=parser.parse_args();initialize()
    if args.create_admin:
        import getpass
        pw=getpass.getpass('Contraseña de administrador (mínimo 12 caracteres): ')
        if len(pw)<12:raise SystemExit('Contraseña demasiado corta')
        with connect() as c:c.execute('INSERT INTO users VALUES(?,?,?,?,?)',(secrets.token_hex(16),'Administración',args.create_admin.lower(),password_hash(pw),'admin'))
        print('Administrador creado.')
    else:
        print(f'Local: http://{args.host}:{args.port}',flush=True);ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()
