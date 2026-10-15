import unittest, tempfile, os, threading, json, urllib.request, urllib.error, http.cookiejar
from pathlib import Path
os.environ['MUA_DB']=str(Path(tempfile.mkdtemp())/'test.sqlite3')
import server

class API(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server.initialize();cls.http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler);cls.base='http://127.0.0.1:'+str(cls.http.server_port)
        threading.Thread(target=cls.http.serve_forever,daemon=True).start()
    @classmethod
    def tearDownClass(cls):cls.http.shutdown();cls.http.server_close()
    def setUp(self):self.client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
    def call(self,path,data=None,csrf=None,origin=None):
        headers={'Content-Type':'application/json','X-CSRF-Token':self.csrf if csrf is None else csrf}
        if origin:headers['Origin']=origin
        request=urllib.request.Request(self.base+'/api/'+path,data=json.dumps(data).encode() if data is not None else None,headers=headers)
        try:
            with self.client.open(request) as r:return r.status,json.load(r)
        except urllib.error.HTTPError as e:return e.code,json.load(e)
    def register(self,email):
        self.assertEqual(self.call('register',{'name':'Prueba privada','email':email,'password':'Una-clave-larga-2027'})[0],200)
        self.csrf=self.call('me')[1]['csrf']
    def test_01_empty_and_protected(self):
        status,data=self.call('public');self.assertEqual(status,200);self.assertEqual(data['candidates'],[]);self.assertEqual(data['ranking'],[])
        self.assertEqual(self.call('admin')[0],403)
    def test_02_auth_and_csrf(self):
        self.register('voter@example.test');self.assertEqual(self.call('admin')[0],403)
        self.assertEqual(self.call('logout',{},csrf='invalid')[0],403)
        self.assertEqual(self.call('logout',{})[0],200);self.assertIsNone(self.call('me')[1]['user'])
    def test_03_leads_consent_origin(self):
        lead={'kind':'casting','name':'Prueba','email':'lead@example.test','message':'Interés en el casting','consent':True}
        self.assertEqual(self.call('lead',lead,origin='https://malicioso.example')[0],403)
        self.assertEqual(self.call('lead',{**lead,'consent':False})[0],400)
        self.assertEqual(self.call('lead',lead)[0],200)
        self.assertEqual(self.call('lead',{**lead,'kind':'contact'})[0],200)
        self.assertEqual(self.call('lead',{**lead,'kind':'unknown'})[0],400)
    def test_04_candidate_votes_missions(self):
        self.register('admin@example.test')
        with server.connect() as c:c.execute("UPDATE users SET role='admin' WHERE email='admin@example.test'")
        admin_client,admin_csrf=self.client,self.csrf
        self.client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.register('candidate@example.test');candidate_client,candidate_csrf=self.client,self.csrf
        self.client,self.csrf=admin_client,admin_csrf
        candidate={'id':'prueba-privada','name':'Registro de prueba','email':'candidate@example.test','bio':'Datos exclusivos de test','purpose':'Test','photo':'','gallery':[],'videos':[],'socials':[],'published':True,'category':'talento'}
        self.assertEqual(self.call('admin/candidate',{**candidate,'photo':'javascript:alert(1)'})[0],400)
        self.assertEqual(self.call('admin/candidate',candidate)[0],200)
        self.assertEqual(self.call('public')[1]['candidates'][0]['category'],'talento')
        self.assertEqual(self.call('vote',{'candidate_id':'prueba-privada'})[0],400)
        self.assertEqual(self.call('admin/settings',{'free_voting':True})[0],200)
        self.assertEqual(self.call('vote',{'candidate_id':'prueba-privada'})[0],200)
        self.assertEqual(self.call('vote',{'candidate_id':'prueba-privada'})[0],409)
        self.assertEqual(self.call('public')[1]['ranking'][0]['votes'],1)
        self.client,self.csrf=candidate_client,candidate_csrf
        self.assertEqual(self.call('submission',{'level':2,'evidence':'Evidencia de prueba'})[0],400)
        self.assertEqual(self.call('submission',{'level':1,'evidence':'Evidencia de prueba'})[0],200)
        self.assertEqual(self.call('admin/news',{'title':'No permitido','body':'Prueba'})[0],403)
        self.client,self.csrf=admin_client,admin_csrf
        submission=self.call('admin')[1]['submissions'][0]
        self.assertEqual(self.call('admin/review',{'id':submission['id'],'status':'approved'})[0],200)
        self.client,self.csrf=candidate_client,candidate_csrf
        self.assertEqual(self.call('candidate')[1]['level'],2)
        self.assertEqual(self.call('payment',{})[0],503)

if __name__=='__main__':unittest.main(verbosity=2)
