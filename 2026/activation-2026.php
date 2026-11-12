<?php
function mu_activation_config(): array {$p='/etc/mu-mail-activation-web/config.php';return is_file($p)?require $p:[];}
function mu_activation_session(string $city,string $candidateId=''): string {
 if(session_status()===PHP_SESSION_ACTIVE)session_write_close();
 session_name('MU_MAIL_ACT_'.strtoupper($city));ini_set('session.use_strict_mode','1');session_set_cookie_params(['lifetime'=>0,'path'=>'/2026/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);session_start();
 if($candidateId!==''&&($_SESSION['mail_candidate']??'')!==$candidateId){session_regenerate_id(true);$_SESSION=[];$_SESSION['mail_candidate']=$candidateId;}
 if(empty($_SESSION['mail_csrf']))$_SESSION['mail_csrf']=bin2hex(random_bytes(32));return $_SESSION['mail_csrf'];
}
function mu_activation_audit(PDO $db,array $c,string $event,?string $ref=null): void {$q=$db->prepare('INSERT INTO legado_2026_mail_audit(candidate_id,sede,event,request_ref) VALUES(?,?,?,?)');$q->execute([(string)$c['id'],$c['sede'],$event,$ref]);}
function mu_activation_limit(PDO $db,string $identity,int $max,int $seconds): void {
 $db->beginTransaction();try{$q=$db->prepare('INSERT IGNORE INTO legado_2026_mail_limits(identity_hash,window_start,attempts) VALUES(?,NOW(),0)');$q->execute([$identity]);$q=$db->prepare('SELECT UNIX_TIMESTAMP(window_start) AS started,attempts FROM legado_2026_mail_limits WHERE identity_hash=? FOR UPDATE');$q->execute([$identity]);$r=$q->fetch(PDO::FETCH_ASSOC);if((int)$r['started']<time()-$seconds){$q=$db->prepare('UPDATE legado_2026_mail_limits SET window_start=NOW(),attempts=1 WHERE identity_hash=?');$q->execute([$identity]);}else{if((int)$r['attempts']>=$max)throw new LogicException('Por seguridad, alcanzaste el lÃ­mite de intentos. IntÃ©ntalo mÃ¡s tarde.');$q=$db->prepare('UPDATE legado_2026_mail_limits SET attempts=attempts+1 WHERE identity_hash=?');$q->execute([$identity]);}$db->commit();}catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
}
function mu_activation_dispatch(PDO $db,string $action): void {
 $actions=['mailbox_send_code','mailbox_verify_code','activate_mailbox','mailbox_activation_status','request_mailbox'];if(!in_array($action,$actions,true))return;
 header_remove('Access-Control-Allow-Origin');header('Cache-Control: no-store, private');header('Referrer-Policy: no-referrer');
 $reply=function(array $data,int $code=200):never{http_response_code($code);header('Content-Type: application/json; charset=utf-8');if(session_status()===PHP_SESSION_ACTIVE)session_write_close();echo json_encode($data,JSON_UNESCAPED_UNICODE);exit;};
 if(($_SERVER['REQUEST_METHOD']??'')!=='POST')$reply(['status'=>'error','message'=>'MÃ©todo no permitido.'],405);
 $host=strtolower(explode(':',$_SERVER['HTTP_HOST']??'')[0]);$city=$host==='missuniversoarica.cl'?'arica':($host==='missuniversoiquique.cl'?'iquique':null);if(!$city)$reply(['status'=>'error','message'=>'Sede no vÃ¡lida.'],403);
 $origin=$_SERVER['HTTP_ORIGIN']??'';if($origin!=='https://'.$host)$reply(['status'=>'error','message'=>'Origen no permitido.'],403);
 if(($_SERVER['HTTP_SEC_FETCH_SITE']??'same-origin')!=='same-origin')$reply(['status'=>'error','message'=>'Solicitud no permitida.'],403);
 $token=$_POST['token']??'';if(!is_string($token)||strlen($token)<20||strlen($token)>200)$reply(['status'=>'error','message'=>'Acceso no vÃ¡lido.'],401);
 $q=$db->prepare('SELECT id,sede,username FROM legado_2026 WHERE magic_token=? AND sede=? LIMIT 1');$q->execute([$token,$city]);$c=$q->fetch(PDO::FETCH_ASSOC);if(!$c)$reply(['status'=>'error','message'=>'Acceso no vÃ¡lido.'],403);
 mu_activation_session($city);if(($_SESSION['mail_candidate']??'')!==(string)$c['id']||!is_string($_POST['csrf']??null)||!hash_equals($_SESSION['mail_csrf'],$_POST['csrf']))$reply(['status'=>'error','message'=>'Recarga tu panel para continuar de forma segura.'],403);
 $cfg=mu_activation_config();if(empty($cfg['enabled'])||empty($cfg['public_key'])||!extension_loaded('sodium'))$reply(['status'=>'error','message'=>'La activaciÃ³n segura no estÃ¡ disponible temporalmente.'],503);
 try{
  $state=legado_mail_status($db,(string)$c['id']);
  if($action==='mailbox_activation_status'){$reply(['status'=>'success','mailbox'=>$state,'webmail'=>'/2026/correo/']);}
  if($action==='request_mailbox')throw new LogicException('Recarga tu panel: ahora debes verificar tu correo antes de activar la casilla.');
  if($state&&$state['status']==='active')$reply(['status'=>'success','mailbox'=>$state,'webmail'=>'/2026/correo/']);
  if($state&&in_array($state['status'],['queued','processing','review'],true))throw new LogicException($state['status']==='review'?'Tu activaciÃ³n requiere revisiÃ³n para proteger la titularidad de la casilla.':'Tu casilla ya se estÃ¡ creando. Espera a que finalice la comprobaciÃ³n.');
  if($action==='mailbox_send_code'){
   $enrolled=$cfg['enrollment'][(string)$c['id']]??null;$email=$enrolled&&$enrolled['sede']===$city?$enrolled['email']:null;if(!$email||!filter_var($email,FILTER_VALIDATE_EMAIL))throw new LogicException('La organizaciÃ³n debe confirmar tu correo personal antes de continuar.');
   $q=$db->prepare('SELECT sent_epoch FROM legado_2026_mail_challenges WHERE candidate_id=?');$q->execute([(string)$c['id']]);$sent=(int)$q->fetchColumn();if($sent>time()-60)throw new LogicException('Espera un minuto antes de solicitar otro cÃ³digo.');
   $secret=$cfg['rate_key'];mu_activation_limit($db,hash_hmac('sha256','candidate:'.$c['id'],$secret),3,1800);mu_activation_limit($db,hash_hmac('sha256','ip:'.($_SERVER['REMOTE_ADDR']??''),$secret),8,1800);
   $code=(string)random_int(100000,999999);$nonce=bin2hex(random_bytes(32));$_SESSION['mail_challenge_nonce']=$nonce;unset($_SESSION['mail_verified_until']);$hash=hash_hmac('sha256',$c['id'].':'.$nonce.':'.$code,$secret);
   $q=$db->prepare('INSERT INTO legado_2026_mail_challenges(candidate_id,sede,code_hash,nonce_hash,expires_epoch,sent_epoch,attempts,consumed) VALUES(?,?,?,?,?,?,0,0) ON DUPLICATE KEY UPDATE code_hash=VALUES(code_hash),nonce_hash=VALUES(nonce_hash),expires_epoch=VALUES(expires_epoch),sent_epoch=VALUES(sent_epoch),attempts=0,consumed=0');$q->execute([(string)$c['id'],$city,$hash,hash('sha256',$nonce),time()+600,time()]);
   require_once __DIR__.'/correo/lib/Exception.php';require_once __DIR__.'/correo/lib/PHPMailer.php';require_once __DIR__.'/correo/lib/SMTP.php';$mail=new \PHPMailer\PHPMailer\PHPMailer(true);$mail->isSendmail();$mail->Sendmail='/usr/sbin/sendmail';$mail->CharSet='UTF-8';$mail->setFrom('contacto@missuniverso'.$city.'.cl','Miss Universo '.ucfirst($city));$mail->addAddress($email);$mail->Subject='CÃ³digo para activar tu correo institucional Â· Miss Universo '.ucfirst($city);$mail->Body="Tu cÃ³digo de verificaciÃ³n es: ".$code."\n\nCaduca en 10 minutos. Ãšsalo Ãºnicamente en tu panel de Miss Universo ".ucfirst($city)." 2026. No lo compartas.\n\nSi no solicitaste activar una casilla, ignora este mensaje. Tu correo no ha sido activado.";$mail->send();unset($code,$mail->Body,$hash);mu_activation_audit($db,$c,'verification_code_sent');
   [$local,$domain]=explode('@',$email,2);$masked=substr($local,0,2).'***@'.$domain;$reply(['status'=>'success','masked_email'=>$masked,'expires_in'=>600]);
  }
  if($action==='mailbox_verify_code'){
   $code=$_POST['code']??'';if(!is_string($code)||!preg_match('/^[0-9]{6}$/D',$code))throw new InvalidArgumentException('Escribe el cÃ³digo de seis dÃ­gitos.');
   $db->beginTransaction();$q=$db->prepare('SELECT * FROM legado_2026_mail_challenges WHERE candidate_id=? AND sede=? FOR UPDATE');$q->execute([(string)$c['id'],$city]);$challenge=$q->fetch(PDO::FETCH_ASSOC);$nonce=$_SESSION['mail_challenge_nonce']??'';
   if(!$challenge||$challenge['consumed']||$challenge['expires_epoch']<time()||$challenge['attempts']>=5||!hash_equals($challenge['nonce_hash'],hash('sha256',$nonce))){$db->rollBack();throw new LogicException('El cÃ³digo venciÃ³, ya fue utilizado o alcanzÃ³ el lÃ­mite de intentos. Solicita uno nuevo.');}
   $valid=hash_equals($challenge['code_hash'],hash_hmac('sha256',$c['id'].':'.$nonce.':'.$code,$cfg['rate_key']));$q=$db->prepare('UPDATE legado_2026_mail_challenges SET attempts=attempts+1,consumed=? WHERE candidate_id=?');$q->execute([$valid?1:0,(string)$c['id']]);$db->commit();
   if(!$valid){mu_activation_audit($db,$c,'verification_failed');throw new InvalidArgumentException('El cÃ³digo no coincide. Revisa el mensaje recibido.');}
   session_regenerate_id(true);$_SESSION['mail_verified_until']=time()+900;unset($_SESSION['mail_challenge_nonce']);mu_activation_audit($db,$c,'email_verified');$reply(['status'=>'success','verified'=>true]);
  }
  if($action==='activate_mailbox'){
   if(($_SESSION['mail_verified_until']??0)<time())throw new LogicException('Primero verifica tu correo personal con el cÃ³digo recibido.');
   $name=legado_mail_name((string)($_POST['mail_username']??''));if(in_array($name,['prueba','test','mail','email'],true))throw new InvalidArgumentException('Elige un nombre personal; ese usuario estÃ¡ reservado.');
   $password=$_POST['mail_password']??'';if(!is_string($password)||strlen($password)<14||strlen($password)>128||preg_match('/[\r\n\x00]/',$password)||!preg_match('/[A-Z]/',$password)||!preg_match('/[a-z]/',$password)||!preg_match('/[0-9]/',$password))throw new InvalidArgumentException('Usa entre 14 y 128 caracteres, con mayÃºsculas, minÃºsculas y nÃºmeros.');
   if(empty($_POST['mail_consent']))throw new InvalidArgumentException('Confirma que deseas crear tu casilla institucional.');
   $address=$name.'@2026.missuniverso'.$city.'.cl';if($state&&$state['address']!==$address)throw new InvalidArgumentException('Tienes otra direcciÃ³n reservada. Usa la direcciÃ³n que aparece en tu panel.');
   if($state&&$state['status']==='error')throw new LogicException('La organizaciÃ³n debe revisar el intento anterior antes de crear otra casilla.');
   $jobId=bin2hex(random_bytes(20));$issued=time();$proof=hash_hmac('sha256',$jobId.'|'.$c['id'].'|'.$city.'|'.$address.'|'.hash('sha256',$password).'|'.$issued,$cfg['job_key']);$payload=json_encode(['job_id'=>$jobId,'candidate_id'=>(string)$c['id'],'sede'=>$city,'address'=>$address,'password'=>$password,'issued'=>$issued,'proof'=>$proof],JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);$sealed=base64_encode(sodium_crypto_box_seal($payload,base64_decode($cfg['public_key'],true)));sodium_memzero($payload);sodium_memzero($password);unset($_POST['mail_password']);
   $db->beginTransaction();if($state){$q=$db->prepare("UPDATE legado_2026_mailboxes SET status='queued' WHERE candidate_id=? AND address=? AND status='requested'");$q->execute([(string)$c['id'],$address]);if($q->rowCount()!==1)throw new LogicException('La solicitud cambiÃ³. Recarga el panel antes de continuar.');}else{$q=$db->prepare("INSERT INTO legado_2026_mailboxes(candidate_id,sede,address,status) VALUES(?,?,?,'queued')");$q->execute([(string)$c['id'],$city,$address]);}
   $q=$db->prepare("INSERT INTO legado_2026_mail_jobs(job_id,candidate_id,sede,address,sealed_secret,status,expires_at) VALUES(?,?,?,?,?,'queued',DATE_ADD(NOW(),INTERVAL 10 MINUTE))");$q->execute([$jobId,(string)$c['id'],$city,$address,$sealed]);$db->commit();unset($_SESSION['mail_verified_until']);mu_activation_audit($db,$c,'activation_queued');$reply(['status'=>'success','mailbox'=>['address'=>$address,'status'=>'queued']]);
  }
 }catch(InvalidArgumentException|LogicException $e){if($db->inTransaction())$db->rollBack();$reply(['status'=>'error','message'=>$e->getMessage()],409);}catch(PDOException $e){if($db->inTransaction())$db->rollBack();$reply(['status'=>'error','message'=>$e->getCode()==='23000'?'La direcciÃ³n ya estÃ¡ reservada. Revisa tu solicitud o elige otro usuario.':'No fue posible registrar la activaciÃ³n de forma segura.'],409);}catch(Throwable $e){if($db->inTransaction())$db->rollBack();$reply(['status'=>'error','message'=>'La activaciÃ³n no pudo confirmarse. No vuelvas a crear la casilla sin revisar su estado.'],503);}
}
