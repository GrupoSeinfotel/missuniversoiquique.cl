const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'../produccion');
async function main(){
 const folder=path.join(root,'iquique2027/assets/neon');let before=0,after=0;
 for(const file of fs.readdirSync(folder).filter(x=>x.endsWith('.png'))){const input=path.join(folder,file);const output=input.replace(/\.png$/,'.webp');before+=fs.statSync(input).size;await sharp(input).resize({width:file.startsWith('icon-')?160:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:84,alphaQuality:95,effort:5}).toFile(output);after+=fs.statSync(output).size;}
 for(const name of fs.readdirSync(path.join(root,'iquique2027'))){if(!/\.(css|js)$/.test(name))continue;const file=path.join(root,'iquique2027',name);let text=fs.readFileSync(file,'utf8');text=text.replace(/(\/iquique2027\/assets\/neon\/[a-zA-Z0-9_-]+)\.png/g,'$1.webp');if(name==='experience.js')text=text.replace("n+'.png'","n+'.webp'");fs.writeFileSync(file,text);}
 const index=path.join(root,'index.html');fs.writeFileSync(index,fs.readFileSync(index,'utf8').replace(/(\/iquique2027\/assets\/neon\/[a-zA-Z0-9_-]+)\.png/g,'$1.webp'));
 console.log(JSON.stringify({assets:36,original_bytes:before,optimized_bytes:after}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
