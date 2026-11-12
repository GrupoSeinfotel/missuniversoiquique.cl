<?php
declare(strict_types=1);
use PHPMailer\PHPMailer\PHPMailer;
ini_set('display_errors','0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
function answer(array $data,int $status=200): never {http_response_code($status);echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);exit;}
$city=require __DIR__.'/site.php';
if(!in_array($city,['arica','iquique'],true))answer(['error'=>'Sede no disponible.'],503);
if(($_SERVER['HTTPS']??'')!=='on'&&($_SERVER['HTTP_X_FORWARDED_PROTO']??'')!=='https')answer(['error'=>'Abre tu correo mediante HTTPS.'],400);
$private=getenv('MU_MAIL_PRIVATE_DIR')?:'/home/andrekis/mu-mail-private';
$cfgPath=$private.'/config-'.$city.'.json';
if(!is_file($cfgPath))answer(['error'=>'El correo está en preparación.'],503);
$cfg=json_decode(file_get_contents($cfgPath),true,512,JSON_THROW_ON_ERROR);
$key=base64_decode($cfg['key'],true);
if(!$key||strlen($key)!==32)answer(['error'=>'Servicio temporalmente no disponible.'],503);
session_name('MU_CORREO_'.strtoupper($city));
ini_set('session.use_strict_mode','1');ini_set('session.use_only_cookies','1');
session_set_cookie_params(['lifetime'=>0,'path'=>'/2026/correo/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
session_start();
if(isset($_SESSION['account'])&&(time()-($_SESSION['last']??0)>1800||time()-($_SESSION['started']??0)>28800)){$_SESSION=[];session_regenerate_id(true);}
$_SESSION['last']=time();$_SESSION['csrf']??=bin2hex(random_bytes(32));
$action=(string)($_POST['action']??$_GET['action']??'bootstrap');
if($action==='bootstrap')answer(['account'=>$_SESSION['account']??null,'csrf'=>$_SESSION['csrf'],'city'=>$city,'edition'=>2026]);
$origin=$_SERVER['HTTP_ORIGIN']??'';
if($origin&&(!in_array(parse_url($origin,PHP_URL_SCHEME),['https'],true)||strcasecmp((string)parse_url($origin,PHP_URL_HOST),explode(':',$_SERVER['HTTP_HOST']??'')[0])!==0))answer(['error'=>'Solicitud de otro origen no permitida.'],403);
if($action!=='attachment'){
 if(($_SERVER['REQUEST_METHOD']??'')!=='POST')answer(['error'=>'Método no permitido.'],405);
 if(!hash_equals($_SESSION['csrf'],(string)($_POST['csrf']??'')))answer(['error'=>'Actualiza la página para continuar.'],403);
}
function limits(string $bucket,int $max,int $seconds,bool $record=true): void {
 global $private;
 $db=new PDO('sqlite:'.$private.'/limits.sqlite',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
 $db->exec('PRAGMA busy_timeout=3000');$db->exec('CREATE TABLE IF NOT EXISTS attempts(bucket TEXT,ts INTEGER)');
 $db->exec('CREATE INDEX IF NOT EXISTS attempts_bucket ON attempts(bucket,ts)');
 $q=$db->prepare('DELETE FROM attempts WHERE ts<?');$q->execute([time()-3600]);
 $q=$db->prepare('SELECT COUNT(*) FROM attempts WHERE bucket=? AND ts>?');$q->execute([$bucket,time()-$seconds]);
 if((int)$q->fetchColumn()>=$max)answer(['error'=>'Demasiados intentos. Espera unos minutos antes de continuar.'],429);
 if($record){$q=$db->prepare('INSERT INTO attempts VALUES(?,?)');$q->execute([$bucket,time()]);}
}
function password_open(): string {
 global $key;
 $p=$_SESSION['credential']??[];
 $value=openssl_decrypt(base64_decode($p['data']??''),'aes-256-gcm',$key,OPENSSL_RAW_DATA,base64_decode($p['iv']??''),base64_decode($p['tag']??''),'mu-mail-v1');
 if($value===false)answer(['error'=>'Vuelve a iniciar sesión.'],401);return $value;
}
// Same-host IMAP only: c-client does not negotiate the mail host's SNI certificate.
// No credentials leave the VPS over this connection. Public access uses HTTPS.
function server_prefix(): string {return '{127.0.0.1:143/imap/notls/norsh}';}
function connect_mail(string $account,string $password){
 if(!function_exists('imap_open'))throw new RuntimeException('IMAP no disponible');
 imap_timeout(IMAP_OPENTIMEOUT,12);imap_timeout(IMAP_READTIMEOUT,20);imap_timeout(IMAP_WRITETIMEOUT,20);
 $m=@imap_open(server_prefix().'INBOX',$account,$password,0,1,['DISABLE_AUTHENTICATOR'=>'GSSAPI']);
 if(!$m){imap_errors();imap_alerts();throw new RuntimeException('IMAP no confirmó el acceso');}return $m;
}
if($action==='login'){
 $email=strtolower(trim((string)($_POST['email']??'')));$password=(string)($_POST['password']??'');
 $ipBucket=hash_hmac('sha256','login-ip:'.($_SERVER['REMOTE_ADDR']??''),$key);limits($ipBucket,12,900,false);
 if(!preg_match('/^[a-z0-9][a-z0-9._+-]{0,63}@2026\.missuniverso'.$city.'\.cl$/D',$email)||strlen($password)>256||$password===''){limits($ipBucket,12,900);answer(['error'=>'Usa tu correo completo de la edición 2026 y su contraseña.'],401);}
 $emailBucket=hash_hmac('sha256','login-mail:'.$email,$key);limits($emailBucket,8,900,false);
 try{$mail=connect_mail($email,$password);imap_close($mail);}catch(Throwable $e){limits($ipBucket,12,900);limits($emailBucket,8,900);answer(['error'=>'No pudimos iniciar sesión. Revisa tu correo y contraseña.'],401);}
 $db=new PDO('sqlite:'.$private.'/limits.sqlite');$db->exec('PRAGMA busy_timeout=3000');$q=$db->prepare('DELETE FROM attempts WHERE bucket=?');$q->execute([hash_hmac('sha256','login-mail:'.$email,$key)]);
 session_regenerate_id(true);$iv=random_bytes(12);$tag='';$encrypted=openssl_encrypt($password,'aes-256-gcm',$key,OPENSSL_RAW_DATA,$iv,$tag,'mu-mail-v1');
 $_SESSION=['account'=>$email,'credential'=>['iv'=>base64_encode($iv),'tag'=>base64_encode($tag),'data'=>base64_encode($encrypted)],'started'=>time(),'last'=>time(),'csrf'=>bin2hex(random_bytes(32))];unset($password);
 answer(['account'=>$email,'csrf'=>$_SESSION['csrf']]);
}
if(empty($_SESSION['account']))answer(['error'=>'Inicia sesión para abrir tu correo.'],401);
if($action==='logout'){$_SESSION=[];session_destroy();setcookie(session_name(),'', ['expires'=>time()-3600,'path'=>'/2026/correo/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);answer(['ok'=>true]);}
function decode_header(string $value): string {
 $out='';foreach(imap_mime_header_decode($value)?:[] as $p){$cs=strtoupper($p->charset);$out.=in_array($cs,['DEFAULT','UTF-8','US-ASCII'],true)?$p->text:(@iconv($cs,'UTF-8//IGNORE',$p->text)?:$p->text);}return $out;
}
function folder_rows($m): array {
 $rows=[];foreach(imap_getmailboxes($m,server_prefix(),'*')?:[] as $f){
  if($f->attributes&LATT_NOSELECT)continue;$raw=substr($f->name,strlen(server_prefix()));$decoded=mb_convert_encoding($raw,'UTF-8','UTF7-IMAP');$tail=strtolower(preg_replace('/^INBOX[.\/]/i','',$decoded));
  $purpose=match(true){$raw==='INBOX'=>'inbox',in_array($tail,['sent','sent messages','sent items','enviados'])=>'sent',in_array($tail,['drafts','borradores'])=>'drafts',in_array($tail,['trash','deleted messages','deleted items','papelera'])=>'trash',in_array($tail,['junk','spam','junk e-mail'])=>'spam',default=>'other'};
  $label=['inbox'=>'Bandeja de entrada','sent'=>'Enviados','drafts'=>'Borradores','trash'=>'Papelera','spam'=>'Correo no deseado'][$purpose]??$decoded;
  $rows[]=['id'=>base64_encode($raw),'label'=>$label,'purpose'=>$purpose,'raw'=>$raw];
 }return $rows;
}
function select_folder($m,array $rows): array {
 $id=(string)($_POST['folder']??$_GET['folder']??base64_encode('INBOX'));
 foreach($rows as $f)if(hash_equals($f['id'],$id)){if(!@imap_reopen($m,server_prefix().$f['raw']))throw new RuntimeException('No se pudo abrir la carpeta');return $f;}
 answer(['error'=>'La carpeta ya no está disponible.'],404);
}
function check_uid($m): int {
 $uid=filter_var($_POST['uid']??$_GET['uid']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
 $expected=(string)($_POST['validity']??$_GET['validity']??'');$status=imap_status($m,server_prefix().current_folder_raw(),SA_UIDVALIDITY);
 if(!$status||$expected!==(string)$status->uidvalidity)answer(['error'=>'La carpeta cambió. Actualiza la bandeja.'],409);
 if(!$uid||!imap_msgno($m,$uid))answer(['error'=>'El mensaje ya no está en esta carpeta.'],404);return $uid;
}
function current_folder_raw(): string {global $selected;return $selected['raw'];}
function mime_parts(object $node,string $number='',array &$result=[]): array {
 if(isset($node->parts)){foreach($node->parts as $i=>$part)mime_parts($part,$number===''?(string)($i+1):$number.'.'.($i+1),$result);return $result;}
 $params=[];foreach(array_merge($node->parameters??[],$node->dparameters??[]) as $p)$params[strtolower($p->attribute)]=$p->value;
 $filename=decode_header((string)($params['filename']??$params['name']??''));$type=strtolower((string)($node->subtype??''));
 $result[]=['part'=>$number?:'1','type'=>(int)($node->type??0),'subtype'=>$type,'encoding'=>(int)($node->encoding??0),'charset'=>$params['charset']??'UTF-8','filename'=>$filename,'attachment'=>$filename!==''||strtoupper($node->disposition??'')==='ATTACHMENT','bytes'=>(int)($node->bytes??0)];return $result;
}
function part_content($m,int $uid,array $part): string {
 $raw=imap_fetchbody($m,$uid,$part['part'],FT_UID|FT_PEEK);if(!is_string($raw))throw new RuntimeException('No se pudo leer el mensaje');
 return match($part['encoding']){3=>base64_decode($raw)?:'',4=>quoted_printable_decode($raw),default=>$raw};
}
function part_text($m,int $uid,array $part): string {
 $body=part_content($m,$uid,$part);$cs=$part['charset'];if(!in_array(strtoupper($cs),['UTF-8','US-ASCII'],true))$body=@iconv($cs,'UTF-8//IGNORE',$body)?:$body;
 if($part['subtype']==='html'){
  $doc=new DOMDocument();@$doc->loadHTML('<?xml encoding="utf-8" ?>'.$body,LIBXML_NONET|LIBXML_NOERROR|LIBXML_NOWARNING);
  foreach(['script','style','head','template','noscript'] as $tag){while($node=$doc->getElementsByTagName($tag)->item(0))$node->parentNode->removeChild($node);}
  foreach(['p','div','br','tr'] as $tag)foreach($doc->getElementsByTagName($tag) as $node)$node->appendChild($doc->createTextNode("\n"));
  $body=$doc->textContent;
 }return trim($body);
}
try{
 $m=connect_mail($_SESSION['account'],password_open());$folders=folder_rows($m);
 if($action==='folders'){foreach($folders as &$f)unset($f['raw']);unset($f);imap_close($m);answer(['folders'=>$folders]);}
 $selected=select_folder($m,$folders);
 $status=imap_status($m,server_prefix().$selected['raw'],SA_UIDVALIDITY|SA_UNSEEN);
 if($action==='list'){
  $search=trim((string)($_POST['search']??''));if(mb_strlen($search)>120||preg_match('/[\x00-\x1f]/',$search))answer(['error'=>'Usa una búsqueda más breve.'],400);
  $criteria='UNDELETED'.($search!==''?' TEXT "'.addcslashes($search,'\\"').'"':'');
  $uids=imap_sort($m,SORTARRIVAL,true,SE_UID,$criteria,'UTF-8')?:[];imap_errors();
  $page=max(1,(int)($_POST['page']??1));$slice=array_slice($uids,($page-1)*25,25);$messages=[];
  foreach($slice as $uid){$overview=imap_fetch_overview($m,(string)$uid,FT_UID)[0]??null;if(!$overview)continue;
   $messages[]=['uid'=>$uid,'subject'=>decode_header($overview->subject??'(Sin asunto)'),'from'=>decode_header($overview->from??''),'to'=>decode_header($overview->to??''),'date'=>$overview->date??'','timestamp'=>strtotime($overview->date??'')?:0,'seen'=>(bool)($overview->seen??false),'starred'=>(bool)($overview->flagged??false),'size'=>(int)($overview->size??0)];
  }imap_close($m);answer(['messages'=>$messages,'total'=>count($uids),'page'=>$page,'pages'=>max(1,(int)ceil(count($uids)/25)),'validity'=>(string)$status->uidvalidity,'unread'=>(int)$status->unseen]);
 }
 if(in_array($action,['message','attachment','flag','move'],true))$uid=check_uid($m);
 if($action==='message'||$action==='attachment'){
  $o=imap_fetch_overview($m,(string)$uid,FT_UID)[0]??null;if(!$o)answer(['error'=>'Mensaje no disponible.'],404);
  $structure=imap_fetchstructure($m,$uid,FT_UID);if(!$structure)throw new RuntimeException('MIME no disponible');$parts=mime_parts($structure);
  if($action==='attachment'){
   $number=(string)($_GET['part']??'');foreach($parts as $part)if($part['part']===$number&&$part['attachment']){
    if($part['bytes']>25*1024*1024)answer(['error'=>'El adjunto supera el límite de descarga de esta bandeja.'],413);
    $bytes=part_content($m,$uid,$part);imap_close($m);session_write_close();
    header('Content-Type: application/octet-stream');header('Content-Disposition: attachment; filename="adjunto"; filename*=UTF-8\'\''.rawurlencode($part['filename']?:'adjunto'));header('Content-Length: '.strlen($bytes));echo $bytes;exit;
   }answer(['error'=>'Adjunto no disponible.'],404);
  }
  if((int)$o->size>25*1024*1024)answer(['error'=>'Este mensaje es demasiado grande para abrirlo aquí.'],413);
  $plain=null;$html=null;$attachments=[];
  foreach($parts as $part){if($part['attachment'])$attachments[]=['part'=>$part['part'],'name'=>$part['filename']?:'Adjunto','size'=>$part['bytes']];elseif($part['type']===0&&$part['subtype']==='plain'&&!$plain)$plain=$part;elseif($part['type']===0&&$part['subtype']==='html'&&!$html)$html=$part;}
  $chosen=$plain??$html;$body=$chosen?part_text($m,$uid,$chosen):'Este mensaje contiene adjuntos o un formato sin texto disponible.';
  $headers=imap_headerinfo($m,imap_msgno($m,$uid));$reply=[];foreach($headers->reply_to??$headers->from??[] as $h)if(isset($h->mailbox,$h->host))$reply[]=$h->mailbox.'@'.$h->host;
  if(!imap_setflag_full($m,(string)$uid,'\\Seen',ST_UID))throw new RuntimeException('No se pudo marcar como leído');imap_close($m);
  answer(['uid'=>$uid,'subject'=>decode_header($o->subject??'(Sin asunto)'),'from'=>decode_header($o->from??''),'to'=>decode_header($o->to??''),'date'=>$o->date??'','body'=>$body,'replyTo'=>$reply,'starred'=>(bool)($o->flagged??false),'attachments'=>$attachments]);
 }
 if($action==='flag'){
  $flag=(string)($_POST['flag']??'');if(!in_array($flag,['seen','starred'],true))answer(['error'=>'Acción no disponible.'],400);
  $name=$flag==='seen'?'\\Seen':'\\Flagged';$ok=($_POST['value']??'')==='1'?imap_setflag_full($m,(string)$uid,$name,ST_UID):imap_clearflag_full($m,(string)$uid,$name,ST_UID);if(!$ok)throw new RuntimeException('No se pudo guardar la marca');imap_close($m);answer(['ok'=>true]);
 }
 if($action==='move'){
  $targetId=(string)($_POST['target']??'');$target=null;foreach($folders as $f)if($f['id']===$targetId)$target=$f;
  if(!$target&&$targetId==='trash'){
   if(!@imap_createmailbox($m,server_prefix().'Trash'))throw new RuntimeException('No se pudo preparar la papelera');
   @imap_subscribe($m,server_prefix().'Trash');$target=['id'=>base64_encode('Trash'),'raw'=>'Trash'];
  }
  if(!$target||$target['id']===$selected['id'])answer(['error'=>'Elige otra carpeta.'],400);
  if(!imap_mail_copy($m,(string)$uid,$target['raw'],CP_UID)||!imap_setflag_full($m,(string)$uid,'\\Deleted',ST_UID))throw new RuntimeException('No se pudo mover el mensaje');
  // No EXPUNGE: preserves other messages marked by concurrent clients.
  imap_close($m);answer(['ok'=>true]);
 }
 if($action==='send'){
  $id=(string)($_POST['requestId']??'');if(!preg_match('/^[a-zA-Z0-9-]{16,80}$/D',$id))answer(['error'=>'Actualiza la página antes de enviar.'],400);
  $previous=$_SESSION['deliveries'][$id]??null;if($previous==='sent')answer(['ok'=>true,'alreadySent'=>true]);if($previous)answer(['error'=>'Revisa Enviados antes de intentar enviar este mensaje otra vez.'],409);
  $subject=trim((string)($_POST['subject']??''));$body=(string)($_POST['body']??'');if(strlen($subject)>300||preg_match('/[\r\n\x00]/',$subject)||strlen($body)>1000000)answer(['error'=>'Revisa el asunto y el tamaño del mensaje.'],400);
  $recipients=[];$total=0;foreach(['to','cc','bcc'] as $field){$list=preg_split('/[,;]/',(string)($_POST[$field]??''));$recipients[$field]=[];foreach($list as $address){$address=trim($address);if($address==='')continue;if(!filter_var($address,FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n]/',$address))answer(['error'=>'Escribe las direcciones completas, separadas por coma.'],400);$recipients[$field][]=$address;$total++;}}
  if(!$recipients['to']||$total>10)answer(['error'=>'Indica al menos un destinatario y un máximo de diez direcciones.'],400);
  require_once __DIR__.'/lib/Exception.php';require_once __DIR__.'/lib/PHPMailer.php';require_once __DIR__.'/lib/SMTP.php';
  $mailer=new PHPMailer(true);$mailer->isSMTP();$mailer->Host='mail.missuniverso'.$city.'.cl';$mailer->Port=465;$mailer->SMTPSecure=PHPMailer::ENCRYPTION_SMTPS;$mailer->SMTPAuth=true;$mailer->Username=$_SESSION['account'];$mailer->Password=password_open();$mailer->Timeout=20;$mailer->CharSet='UTF-8';
  $mailer->setFrom($_SESSION['account']);foreach($recipients as $field=>$list)foreach($list as $address){$method=['to'=>'addAddress','cc'=>'addCC','bcc'=>'addBCC'][$field];$mailer->$method($address);}
  $mailer->Subject=$subject?:'(Sin asunto)';$mailer->Body=$body;$mailer->isHTML(false);
  $uploads=$_FILES['attachments']??null;$bytes=0;
  if($uploads){if(!is_array($uploads['name'])||count($uploads['name'])>5)answer(['error'=>'Adjunta hasta cinco archivos.'],400);
   foreach($uploads['name'] as $i=>$name){if($uploads['error'][$i]===UPLOAD_ERR_NO_FILE)continue;$bytes+=(int)$uploads['size'][$i];if($uploads['error'][$i]!==UPLOAD_ERR_OK||!is_uploaded_file($uploads['tmp_name'][$i])||$bytes>8*1024*1024)answer(['error'=>'Los adjuntos deben sumar menos de 8 MB.'],400);$name=preg_replace('/[\x00-\x1f\/\\\\]/','_',basename((string)$name));$mailer->addAttachment($uploads['tmp_name'][$i],mb_substr($name,0,180));}
  }
  limits(hash_hmac('sha256','send:'.$_SESSION['account'],$key),40,3600);$mailer->preSend();$_SESSION['deliveries'][$id]='sending';
  if(count($_SESSION['deliveries'])>100)$_SESSION['deliveries']=array_slice($_SESSION['deliveries'],-100,null,true);
  try{$mailer->postSend();$_SESSION['deliveries'][$id]='sent';}catch(Throwable $e){$_SESSION['deliveries'][$id]='review';throw new RuntimeException('Envío sin confirmar');}
  $sent=null;foreach($folders as $f)if($f['purpose']==='sent'){$sent=$f['raw'];break;}
  if(!$sent){$sent='Sent';if(!@imap_createmailbox($m,server_prefix().$sent))$sent=null;else @imap_subscribe($m,server_prefix().$sent);}
  $saved=$sent&&@imap_append($m,server_prefix().$sent,$mailer->getSentMIMEMessage(),'\\Seen');imap_close($m);
  answer(['ok'=>true,'sentCopySaved'=>(bool)$saved,'notice'=>$saved?'Mensaje enviado.':'El mensaje fue enviado, pero no pudimos guardar su copia en Enviados. No lo envíes otra vez.']);
 }
 imap_close($m);answer(['error'=>'Acción no disponible.'],404);
}catch(Throwable $e){file_put_contents($private.'/diagnostic-'.$city.'.log',json_encode(['action'=>$action,'type'=>get_class($e),'line'=>$e->getLine()])."\n",FILE_APPEND|LOCK_EX);error_log('MU correo: operation failed ['.preg_replace('/[^a-z_]/','',$action).']');answer(['error'=>$action==='send'?'No pudimos confirmar el envío. Revisa Enviados antes de intentar de nuevo.':'No pudimos completar la operación. Actualiza la bandeja e inténtalo de nuevo.'],503);}
