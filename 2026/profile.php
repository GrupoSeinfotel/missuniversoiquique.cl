<?php
function legado_profile_details(array $c): array { $d=json_decode($c['profile_details']??'{}',true);return is_array($d)?$d:[]; }
function legado_public_record(array $c): array {
 if(!empty($c['is_minimal_record'])){
  foreach(['bio','occupation','instagram','tiktok','whatsapp','inst_email','profile_details'] as $k)$c[$k]='';
  foreach(['photos_gallery','videos_gallery','custom_links'] as $k)$c[$k]='[]';
  $c['mode_linktree']=0;
 }
 if(empty($c['is_minimal_record'])&&!empty($c['videos_gallery'])){$videos=json_decode($c['videos_gallery'],true);if(is_array($videos))$c['videos_gallery']=json_encode(array_map('legado_playback_url',$videos),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);}
 return $c;
}
function legado_media_url(string $url): bool {
 if(strlen($url)>2000||preg_match('/[\x00-\x1f]/',$url))return false;
 if(preg_match('~^/(uploads|watermarked)/~',$url))return !str_contains($url,'..');
 $p=parse_url($url);return is_array($p)&&($p['scheme']??'')==='https'&&!empty($p['host'])&&!isset($p['user'])&&!isset($p['pass']);
}

function legado_playback_url(string $url): string {
 $p=parse_url($url);$path=$p['path']??'';
 if(!preg_match('~^/(uploads|watermarked)/.*\.(mp4|mov|webm|m4v)$~i',$path)||str_contains($path,'..'))return $url;
 $expected='missuniverso'.(strpos(strtolower($_SERVER['HTTP_HOST']??''),'iquique')!==false?'iquique':'arica').'.cl';
 if(!empty($p['host'])&&strtolower($p['host'])!==$expected)return $url;
 $derived=preg_replace('~\.(mp4|mov|webm|m4v)$~i','.web.mp4',$path);
 $file=dirname(__DIR__).rawurldecode($derived);
 if(!is_file($file)||filesize($file)<1000)return $url;
 return !empty($p['host'])?'https://'.$p['host'].$derived:$derived;
}
