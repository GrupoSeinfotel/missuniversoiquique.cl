const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..');process.loadEnvFile(path.join(root,'.env'));
const {PrismaClient}=require(path.join(root,'prisma/generated/client_v4'));
const db=new PrismaClient();
async function main(){
 await db.$executeRawUnsafe('CREATE DATABASE IF NOT EXISTS missuniversoiquique2027_test CHARACTER SET utf8mb4');
 const url=new URL(process.env.DATABASE_URL);url.pathname='/missuniversoiquique2027_test';
 const folder='C:/MISS UNIVERSO/backups/iquique-20261015';
 const quote=s=>"'"+s.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"'";
 const code='<?php\n$pdo=new PDO('+quote('mysql:host='+url.hostname+';port='+(url.port||3306)+';dbname=missuniversoiquique2027_test;charset=utf8mb4')+','+quote(decodeURIComponent(url.username))+','+quote(decodeURIComponent(url.password))+',[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);\n';
 fs.writeFileSync(folder+'/config-prueba.php',code);
 const password=crypto.randomBytes(18).toString('base64url');
 fs.writeFileSync(folder+'/cuenta-prueba.json',JSON.stringify({email:'prueba-admin@iquique.invalid',password}));
 console.log('Base de prueba aislada y configuración local preparadas.');
}
main().catch(e=>{console.error(e.code||'error');process.exitCode=1}).finally(()=>db.$disconnect());
