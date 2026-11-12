<?php
// Deliberately whitelist profile content: never snapshot authentication secrets.
function mu_history_snapshot(array $row): array {
 $out=[];
 foreach(['username','occupation','bio','instagram','tiktok','photo_main','inst_email','mode_editorial','mode_linktree','is_minimal_record'] as $key)$out[$key]=(string)($row[$key]??'');
 foreach(['email_personal','whatsapp'] as $key)$out[$key]=hash('sha256',(string)($row[$key]??''));
 foreach(['custom_links','photos_gallery','videos_gallery','profile_details'] as $key){$v=json_decode($row[$key]??'[]',true);$out[$key]=is_array($v)?mu_history_canonical($v):[];}
 return $out;
}
function mu_history_canonical(array $value): array {
 if(!array_is_list($value))ksort($value);
 foreach($value as &$v)if(is_array($v))$v=mu_history_canonical($v);
 return $value;
}
function mu_history_diff(array $before,array $after): array {
 $diff=[];
 foreach($before as $key=>$old){$new=$after[$key]??null;if($old===$new)continue;
  $diff[$key]=in_array($key,['email_personal','whatsapp'],true)?['before'=>'Dato privado anterior','after'=>'Dato privado actualizado']:['before'=>$old,'after'=>$new];
 }
 return $diff;
}
function mu_history_begin(PDO $db,string $city,string $action): void {
 if(!in_array($action,['save_profile','upload_photo','upload_video','delete_gallery_photo'],true))return;
 if(($_SERVER['REQUEST_METHOD']??'')!=='POST'){http_response_code(405);exit(json_encode(['status'=>'error','message'=>'Método no permitido']));}
 $origin=$_SERVER['HTTP_ORIGIN']??'';
 if(($origin!==''&&$origin!=='https://missuniverso'.$city.'.cl')||($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site'){http_response_code(403);exit(json_encode(['status'=>'error','message'=>'Origen no permitido']));}
 $token=(string)($_POST['token']??'');
 require_once __DIR__.'/admin-access.php';
 $preview=$_SESSION['legacy_preview']??[];$actor='candidate_link';$actorId=null;
 if(legacy_owner($db,$city)&&($preview['city']??'')===$city&&($preview['until']??0)>=time()&&hash_equals((string)($preview['hash']??''),hash('sha256',$token))){$actor='superadmin';$actorId=(string)$_SESSION['user']['id'];}
 session_write_close();
 $db->beginTransaction();
 $q=$db->prepare('SELECT * FROM legado_2026 WHERE magic_token=? AND sede=? LIMIT 1 FOR UPDATE');$q->execute([$token,$city]);$row=$q->fetch(PDO::FETCH_ASSOC);
 if(!$row){$db->rollBack();http_response_code(403);exit(json_encode(['status'=>'error','message'=>'Acceso denegado']));}
 if($actor==='superadmin'&&(string)($preview['id']??'')!==(string)$row['id']){$actor='candidate_link';$actorId=null;}
 $GLOBALS['mu_history_context']=['row'=>$row,'before'=>mu_history_snapshot($row),'actor'=>$actor,'actor_id'=>$actorId,'action'=>$action];
 register_shutdown_function(static function()use($db){if($db->inTransaction())$db->rollBack();});
}
function mu_history_commit(PDO $db): void {
 $ctx=$GLOBALS['mu_history_context']??null;if(!$ctx)throw new RuntimeException('Missing audit context');
 $q=$db->prepare('SELECT * FROM legado_2026 WHERE id=? AND sede=?');$q->execute([$ctx['row']['id'],$ctx['row']['sede']]);$after=$q->fetch(PDO::FETCH_ASSOC);
 $diff=mu_history_diff($ctx['before'],mu_history_snapshot($after));
 if($diff){$q=$db->prepare('INSERT INTO legado_2026_profile_changes(candidate_id,sede,operation,actor_type,actor_id,changes_json) VALUES(?,?,?,?,?,?)');$q->execute([(string)$after['id'],$after['sede'],$ctx['action'],$ctx['actor'],$ctx['actor_id'],json_encode($diff,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR)]);}
 $db->commit();
}
