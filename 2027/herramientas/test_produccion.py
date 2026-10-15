import json,unittest,urllib.request,urllib.error,http.cookiejar,uuid,base64
from pathlib import Path

BASE='http://127.0.0.1:8028/iquique2027/api.php?action='
class Client:
 def __init__(self):self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf='';self.get('me')
 def request(self,action,data=None,headers=None,raw=None):
  h={'X-CSRF-Token':self.csrf,'Content-Type':'application/json'};h.update(headers or {})
  request=urllib.request.Request(BASE+urllib.parse.quote(action,safe=''),data=raw if raw is not None else json.dumps(data).encode() if data is not None else None,headers=h)
  try:r=self.opener.open(request)
  except urllib.error.HTTPError as e:r=e
  body=r.read()
  try:out=json.loads(body)
  except:out={'raw':body.decode(errors='replace')}
  if action=='me':self.csrf=out.get('csrf','')
  return r.status,out
 def get(self,a):return self.request(a)
 def post(self,a,d,headers=None):return self.request(a,d,headers)

class ProductionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.admin=Client();a=json.loads(Path('C:/MISS UNIVERSO/backups/iquique-20261015/cuenta-prueba.json').read_text());s,d=cls.admin.post('login',a);assert s==200,(s,d);cls.admin.get('me')
  cls.user=Client();cls.email='test-'+uuid.uuid4().hex+'@iquique.invalid';s,d=cls.user.post('register',{'name':'Participante de prueba','email':cls.email,'password':uuid.uuid4().hex,'role':'admin'});assert s==200,(s,d);cls.user.get('me')
  cls.cid='test-'+uuid.uuid4().hex
 def test_01_public_closed(self):
  s,d=Client().get('public');self.assertEqual(s,200);self.assertFalse(d['settings']['free_voting']);self.assertNotIn('users',d);self.assertNotIn('leads',d)
 def test_02_anonymous_admin_denied(self):self.assertEqual(Client().get('admin')[0],401)
 def test_03_cannot_self_assign_admin(self):
  s,d=self.user.get('me');self.assertEqual(d['user']['role'],'voter');self.assertEqual(self.user.get('admin')[0],403)
 def test_04_csrf_enforced(self):self.assertEqual(Client().post('lead',{'kind':'contact'},headers={'X-CSRF-Token':'wrong'})[0],403)
 def test_05_cross_origin_denied(self):self.assertEqual(Client().post('lead',{'kind':'contact'},headers={'Origin':'https://example.invalid'})[0],403)
 def test_06_contact_is_saved(self):
  s,d=Client().post('lead',{'kind':'contact','name':'Mensaje de prueba','email':'test@iquique.invalid','message':'Prueba local de recepción','consent':True});self.assertEqual(s,200);self.assertIn('id',d)
 def test_07_consent_required(self):self.assertEqual(Client().post('lead',{'kind':'contact','name':'Prueba','email':'test@iquique.invalid','message':'Mensaje','consent':False})[0],400)
 def test_08_candidate_creation_and_editorial(self):
  d={'id':self.cid,'email':self.email,'name':'Ficha de prueba','bio':'Biografía de prueba','purpose':'Propósito','photo':'/iquique2027/assets/neon/crystal-star.png','gallery':[],'videos':[],'socials':[],'published':False}
  self.assertEqual(self.admin.post('admin/candidate',d)[0],200)
  self.assertEqual(self.user.get('candidate')[0],200)
  self.assertFalse(any(c['id']==self.cid for c in Client().get('public')[1]['candidates']))
  d['published']=True;self.assertEqual(self.admin.post('admin/candidate',d)[0],200)
  self.assertTrue(any(c['id']==self.cid for c in Client().get('public')[1]['candidates']))
 def test_09_unsafe_url_rejected(self):
  s,d=self.admin.post('admin/news',{'title':'Prueba','body':'Contenido','image':'javascript:alert(1)'});self.assertEqual(s,400)
 def test_10_news_draft_and_publish(self):
  title='Noticia '+uuid.uuid4().hex
  s,d=self.admin.post('admin/news',{'title':title,'body':'Contenido autorizado de prueba','edition':2027,'published':False});self.assertEqual(s,200)
  news=Client().get('public')[1]['news'];self.assertFalse(any(x['title']==title for x in news))
  row=next(x for x in self.admin.get('admin')[1]['news'] if x['title']==title)
  self.assertEqual(self.admin.post('admin/news',{**row,'published':True})[0],200)
  self.assertTrue(any(x['title']==title for x in Client().get('public')[1]['news']))
 def test_11_closed_vote_rejected(self):self.assertEqual(self.user.post('vote',{'candidate_id':self.cid})[0],409)
 def test_12_private_photo_denied(self):self.assertEqual(Client().get('admin/media')[0],401)
 def test_13_csv_only_admin(self):
  self.assertEqual(Client().get('admin/export')[0],401);s,d=self.admin.get('admin/export');self.assertEqual(s,200);self.assertIn('ID',d['raw'])
 def test_14_casting_real_upload(self):
  # PNG válido de una foto sintética de prueba, jamás enviado a producción.
  import struct,zlib,binascii
  def chunk(k,v):return struct.pack('!I',len(v))+k+v+struct.pack('!I',binascii.crc32(k+v)&0xffffffff)
  png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',1,1,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b'\x00\xff\x00\x00'))+chunk(b'IEND',b'')
  boundary='iquique'+uuid.uuid4().hex;pieces=[]
  for k,v in {'name':'Prueba de casting','email':'casting@iquique.invalid','phone':'+56900000000','age':'22','commune':'Iquique','message':'Propósito de prueba','consent':'true'}.items():pieces.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
  for key in ['face','body']:pieces.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"; filename="foto.png"\r\nContent-Type: image/png\r\n\r\n'.encode()+png+b'\r\n')
  pieces.append(f'--{boundary}--\r\n'.encode());client=Client();s,d=client.request('casting',headers={'Content-Type':'multipart/form-data; boundary='+boundary},raw=b''.join(pieces));self.assertEqual(s,200,d)
  lead=next(l for l in self.admin.get('admin')[1]['leads'] if str(l['id'])==str(d['id']));self.assertEqual(len(lead['metadata']['photos']),2)
  self.assertEqual(self.admin.post('admin/lead',{'id':d['id'],'status':'contactada'})[0],200)
 def test_15_mission_program_closed(self):self.assertEqual(self.user.post('submission',{'level':1,'evidence':'Texto'})[0],409)
 def test_16_unexpected_table_updates_not_supported(self):self.assertEqual(self.admin.post('admin/delete-2026',{})[0],404)
 def test_17_one_vote_per_day(self):
  self.assertEqual(self.admin.post('admin/settings',{'voting_rules_confirmed':True,'free_voting':True})[0],200)
  try:
   self.assertEqual(self.user.post('vote',{'candidate_id':self.cid})[0],200)
   self.assertEqual(self.user.post('vote',{'candidate_id':self.cid})[0],409)
  finally:self.admin.post('admin/settings',{'free_voting':False,'voting_rules_confirmed':False})

if __name__=='__main__':unittest.main(verbosity=2)
