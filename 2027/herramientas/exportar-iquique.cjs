// Solo lectura. Copias privadas y exportación de contenido ya publicado de Iquique.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
process.loadEnvFile(path.join(root, '.env'));
const { PrismaClient } = require(path.join(root, 'prisma/generated/client_v4'));
const db = new PrismaClient();
const backup = 'C:/MISS UNIVERSO/backups/iquique-20261015/base-local';
const serialize = value => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);
async function main() {
  fs.mkdirSync(backup, { recursive: true });
  const tables = await db.$queryRawUnsafe('SHOW TABLES');
  const manifest = [];
  const quote = v => {
    if (v === null) return 'NULL';
    if (v instanceof Date) return "'" + v.toISOString().slice(0,19).replace('T',' ') + "'";
    if (Buffer.isBuffer(v)) return "X'" + v.toString('hex') + "'";
    if (typeof v === 'number' || typeof v === 'bigint') return String(v);
    if (typeof v === 'boolean') return v ? '1' : '0';
    return "'" + String(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\0/g,'\\0').replace(/\r/g,'\\r').replace(/\n/g,'\\n') + "'";
  };
  const sql = fs.createWriteStream(path.join(backup, 'iquique-completa.sql'));
  sql.write('SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n');
  for (const record of tables) {
    const table = Object.values(record)[0];
    if (!/^[a-zA-Z0-9_]+$/.test(table)) throw Error('Nombre de tabla inesperado');
    const ddl = await db.$queryRawUnsafe('SHOW CREATE TABLE `' + table + '`');
    const rows = await db.$queryRawUnsafe('SELECT * FROM `' + table + '`');
    fs.writeFileSync(path.join(backup, table + '.json'), serialize(rows));
    sql.write(Object.values(ddl[0])[1] + ';\n');
    for (const row of rows) sql.write('INSERT INTO `' + table + '` (' + Object.keys(row).map(k=>'`'+k+'`').join(',') + ') VALUES (' + Object.values(row).map(quote).join(',') + ');\n');
    manifest.push({ table, rows: rows.length });
  }
  sql.end('SET FOREIGN_KEY_CHECKS=1;\n');
  await new Promise((resolve, reject) => { sql.on('finish', resolve); sql.on('error', reject); });
  fs.writeFileSync(path.join(backup, 'manifiesto.json'), serialize(manifest));
  const candidates = await db.candidate.findMany({ where:{status:'APPROVED'}, select:{ id:true,fullName:true,bio:true,occupation:true,education:true,instagram:true,tiktok:true,facebook:true,videoPitchUrl:true,photos:{select:{url:true,isMain:true,type:true}},user:{select:{slug:true}} }});
  const posts = await db.feedPost.findMany({ orderBy:{createdAt:'desc'}, select:{id:true,content:true,imageUrl:true,mediaJson:true,createdAt:true} });
  const legacy = {
    city:'Iquique',year:2026,winner:'Ayalent Álvarez',
    winnerSource:'https://radiopaulina.cl/2026/04/27/ayalent-alvarez-fue-coronada-como-miss-universo-iquique-2026/',
    candidates:candidates.map(c=>({id:c.id,name:c.fullName,bio:c.bio||'',occupation:c.occupation||'',education:c.education||'',photo:(c.photos.find(p=>p.isMain)||c.photos[0]||{}).url||'',gallery:c.photos.map(p=>p.url),video:c.videoPitchUrl||'',slug:c.user.slug||c.id,socials:[['Instagram',c.instagram],['TikTok',c.tiktok],['Facebook',c.facebook]].filter(x=>x[1]).map(([label,url])=>({label,url:url.startsWith('https://')?url:label==='Instagram'?'https://instagram.com/'+url.replace('@',''):label==='TikTok'?'https://tiktok.com/@'+url.replace('@',''):''})).filter(x=>x.url)})),
    posts:posts.map(p=>({id:p.id,title:p.content.split('\n')[0].slice(0,160),body:p.content,image:p.imageUrl||'',media:p.mediaJson?JSON.parse(p.mediaJson):[],date:p.createdAt.toISOString()}))
  };
  const target=path.join(root,'2027/produccion/iquique2027/legacy-2026.json');
  fs.writeFileSync(target, serialize(legacy));
  console.log(JSON.stringify({tables:manifest.length,rows:manifest.reduce((s,r)=>s+r.rows,0),public_candidates:legacy.candidates.length,public_posts:legacy.posts.length,backup:'OK'}));
}
main().catch(e=>{console.error(e.code||e.message);process.exitCode=1}).finally(()=>db.$disconnect());
