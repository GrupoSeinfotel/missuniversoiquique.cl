<?php
// Mailbox provisioning is disabled until the private SPanel configuration is enabled.
function legado_mail_config(): array {
 $path=getenv('LEGADO_MAIL_CONFIG')?:dirname(__DIR__,2).'/missuniverso-mailboxes.php';
 if(!is_file($path))return [];$config=require $path;return is_array($config)?$config:[];
}
function legado_mail_status(PDO $db,string $id): ?array {
 try{$q=$db->prepare('SELECT address,status FROM legado_2026_mailboxes WHERE candidate_id=?');$q->execute([$id]);$row=$q->fetch(PDO::FETCH_ASSOC);return $row?:null;}catch(PDOException $e){if(in_array($e->getCode(),['42S02','42P01'],true))return null;throw $e;}
}
function legado_mail_public(PDO $db,array $candidate): array {
 $state=legado_mail_status($db,(string)$candidate['id']);$candidate['inst_email']=$state&&$state['status']==='active'?$state['address']:'';return $candidate;
}
function legado_media_public(array $candidate): array {
 $city=$candidate['sede']??'';if(!in_array($city,['arica','iquique'],true))return $candidate;
 $absolute=fn($url)=>is_string($url)&&preg_match('~^/(uploads|watermarked)/~',$url)?'https://missuniverso'.$city.'.cl'.$url:$url;
 if(isset($candidate['photo_main']))$candidate['photo_main']=$absolute($candidate['photo_main']);
 foreach(['photos_gallery','videos_gallery'] as $field){if(!empty($candidate[$field])){$items=json_decode($candidate[$field],true);if(is_array($items))$candidate[$field]=json_encode(array_map($absolute,$items),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);}}
 return $candidate;
}
function legado_mail_schema(PDO $db): void {
 $db->exec("CREATE TABLE IF NOT EXISTS legado_2026_mailboxes(candidate_id VARCHAR(40) PRIMARY KEY,sede VARCHAR(20) NOT NULL,address VARCHAR(254) NOT NULL UNIQUE,status VARCHAR(20) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}
function legado_mail_name(string $name): string {
 $name=strtolower(trim($name));
 if(!preg_match('/^[a-z0-9][a-z0-9._-]{1,30}[a-z0-9]$/D',$name)||str_contains($name,'..')||in_array($name,['admin','administrator','administrador','postmaster','abuse','security','root','support','soporte','contacto','webmaster','casting','noreply','no-reply'],true))throw new InvalidArgumentException('Elige entre 3 y 32 caracteres: letras sin tildes, números, punto, guion o guion bajo. Ese nombre no puede ser una cuenta reservada.');
 return $name;
}
final class LegadoSPanel {
 private array $config;
 public function __construct(array $config){$this->config=$config;}
 public function call(string $action,array $params=[]): array {
  if(!in_array($action,['email/listemailaccounts','email/createemailaccount'],true))throw new RuntimeException('Operación no admitida.');
  $url=$this->config['endpoint']??'';$p=parse_url($url);
  if(!$p||($p['scheme']??'')!=='https'||empty($p['host'])||isset($p['user'])||isset($p['pass'])||isset($p['query'])||empty($this->config['token'])||empty($this->config['accountuser']))throw new RuntimeException('Configuración de correo incompleta.');
  $handle=curl_init($url);curl_setopt_array($handle,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query(['token'=>$this->config['token'],'accountuser'=>$this->config['accountuser'],'action'=>$action]+$params),CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_CONNECTTIMEOUT=>10,CURLOPT_TIMEOUT=>40,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS,CURLOPT_HTTPHEADER=>['Accept: application/json']]);
  $raw=curl_exec($handle);$http=curl_getinfo($handle,CURLINFO_HTTP_CODE);curl_close($handle);
  if($raw===false||$http<200||$http>=300)throw new RuntimeException('No fue posible confirmar la respuesta del servicio de correo.');
  $result=json_decode($raw,true);if(!is_array($result)||($result['result']??'')!=='success')throw new RuntimeException('SPanel no confirmó la operación.');return $result;
 }
}
function legado_mail_activate(PDO $db,array $candidate,array $input,array $config,?object $provider=null): array {
 $city=$candidate['sede'];if(!in_array($city,['arica','iquique'],true))throw new InvalidArgumentException('Sede no válida.');
 if(empty($config['enabled'])||empty($config['domains_ready'][$city]))throw new LogicException('El servicio de correo todavía está en preparación. Tu perfil puede guardarse normalmente.');
 $name=legado_mail_name((string)($input['mail_username']??''));$password=$input['mail_password']??'';
 if(!is_string($password)||strlen($password)<12||strlen($password)>128)throw new InvalidArgumentException('Usa una contraseña propia para tu correo, de 12 a 128 caracteres.');
 if(empty($input['mail_consent']))throw new InvalidArgumentException('Confirma la activación de tu casilla institucional.');
 $domain='2026.missuniverso'.$city.'.cl';$address=$name.'@'.$domain;$quota=(int)($config['quota_mb']??500);if($quota<100||$quota>10240)throw new LogicException('La cuota de correo debe ser revisada por la organización.');
 legado_mail_schema($db);$current=legado_mail_status($db,(string)$candidate['id']);
 if($current){if($current['status']==='active')return ['address'=>$current['address'],'status'=>'active'];throw new LogicException('Tu solicitud de correo ya está registrada y requiere revisión de la organización. No vuelvas a crearla.');}
 try{$q=$db->prepare("INSERT INTO legado_2026_mailboxes(candidate_id,sede,address,status) VALUES(?,?,?,'provisioning')");$q->execute([(string)$candidate['id'],$city,$address]);}catch(PDOException $e){if($e->getCode()==='23000')throw new InvalidArgumentException('Esa dirección ya está reservada. Elige otro nombre.');throw $e;}
 $provider=$provider??new LegadoSPanel($config);$stage='listing';
 try{
  $accounts=$provider->call('email/listemailaccounts');if(!isset($accounts['data'])||!is_array($accounts['data']))throw new RuntimeException('Lista de casillas no disponible.');
  foreach($accounts['data'] as $account){if(strcasecmp(trim((string)($account['email']??'')),$address)===0){$q=$db->prepare("DELETE FROM legado_2026_mailboxes WHERE candidate_id=? AND status='provisioning'");$q->execute([(string)$candidate['id']]);throw new InvalidArgumentException('Esa dirección ya existe en el servidor. Elige otra; no podemos asignarte una casilla existente.');}}
  $stage='creating';$result=$provider->call('email/createemailaccount',['email'=>$name,'domain'=>$domain,'password'=>$password,'quota'=>$quota]);
  if(strcasecmp(trim((string)($result['data']['email']??'')),$address)!==0)throw new RuntimeException('La dirección creada no pudo confirmarse.');
  $db->beginTransaction();$q=$db->prepare("UPDATE legado_2026_mailboxes SET status='active' WHERE candidate_id=? AND address=? AND status='provisioning'");$q->execute([(string)$candidate['id'],$address]);if($q->rowCount()!==1)throw new RuntimeException('No se pudo confirmar la titularidad.');
  $q=$db->prepare('UPDATE legado_2026 SET inst_email=? WHERE id=? AND sede=?');$q->execute([$address,$candidate['id'],$city]);$db->commit();
 }catch(Throwable $e){if($db->inTransaction())$db->rollBack();if($e instanceof InvalidArgumentException)throw $e;$q=$db->prepare("UPDATE legado_2026_mailboxes SET status=? WHERE candidate_id=? AND status='provisioning'");$q->execute([$stage==='creating'?'review':'error',(string)$candidate['id']]);throw new RuntimeException($stage==='creating'?'La creación no pudo confirmarse. La organización debe revisar la solicitud antes de reintentar.':'El servicio de correo no está disponible. La organización debe revisar tu solicitud.');}
 unset($password);return ['address'=>$address,'status'=>'active'];
}
function legado_mail_request(PDO $db,array $candidate,array $input): array {
 $city=$candidate['sede'];$name=legado_mail_name((string)($input['mail_username']??''));
 if(empty($input['mail_consent']))throw new InvalidArgumentException('Confirma que deseas solicitar tu casilla institucional.');
 legado_mail_schema($db);$state=legado_mail_status($db,(string)$candidate['id']);if($state)return $state;
 $address=$name.'@2026.missuniverso'.$city.'.cl';
 try{$q=$db->prepare("INSERT INTO legado_2026_mailboxes(candidate_id,sede,address,status) VALUES(?,?,?,'requested')");$q->execute([(string)$candidate['id'],$city,$address]);}catch(PDOException $e){if($e->getCode()==='23000'){$state=legado_mail_status($db,(string)$candidate['id']);if($state)return $state;throw new InvalidArgumentException('Esa dirección ya está solicitada. Elige otro usuario.');}throw $e;}
 return ['address'=>$address,'status'=>'requested'];
}
function legado_mail_dispatch(PDO $db,string $action): void {
 if(!in_array($action,['activate_mailbox','request_mailbox'],true))return;
 header_remove('Access-Control-Allow-Origin');header('Cache-Control: no-store');
 $reply=function(array $data,int $status=200):never{http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_UNICODE);exit;};
 if($_SERVER['REQUEST_METHOD']!=='POST')$reply(['status'=>'error','message'=>'Método no permitido.'],405);
 $origin=$_SERVER['HTTP_ORIGIN']??'';if($origin&&strcasecmp((string)parse_url($origin,PHP_URL_HOST),(string)explode(':',$_SERVER['HTTP_HOST'])[0])!==0)$reply(['status'=>'error','message'=>'Origen no permitido.'],403);
 $token=$_POST['token']??'';if(!is_string($token)||strlen($token)<20||strlen($token)>200)$reply(['status'=>'error','message'=>'Acceso no válido.'],401);
 $host=strtolower(explode(':',$_SERVER['HTTP_HOST']??'')[0]);$city=$host==='missuniversoarica.cl'?'arica':($host==='missuniversoiquique.cl'?'iquique':null);if(!$city)$reply(['status'=>'error','message'=>'Sede no válida.'],403);$q=$db->prepare('SELECT id,sede,username FROM legado_2026 WHERE magic_token=? AND sede=? LIMIT 1');$q->execute([$token,$city]);$candidate=$q->fetch(PDO::FETCH_ASSOC);if(!$candidate)$reply(['status'=>'error','message'=>'Acceso no válido.'],403);
 try{$result=$action==='request_mailbox'?legado_mail_request($db,$candidate,$_POST):legado_mail_activate($db,$candidate,$_POST,legado_mail_config());$reply(['status'=>'success','mailbox'=>$result]);}catch(InvalidArgumentException $e){$reply(['status'=>'error','message'=>$e->getMessage()],400);}catch(LogicException $e){$reply(['status'=>'error','message'=>$e->getMessage()],409);}catch(Throwable $e){$reply(['status'=>'error','message'=>'No se pudo confirmar la casilla. Contacta a la organización antes de volver a intentarlo.'],503);}
}
