#!/usr/bin/env node
/* Генератор записей голоса для Пипки-Букв через Gemini TTS.

   На входе — настройки голоса (voice-settings.json) и словарь (words.js), на выходе —
   voice-ru.js и voice-en.js: записи в base64 внутри обычного скрипта, потому что игра
   открывается с file://, а там fetch не работает, а <script src> работает.

   Озвучивается не по записи на запрос, а пачкой: все буквы — одной длинной записью
   через <long pause>, все слова — другой, похвала — третьей. Потом запись режется
   по паузам. По одной букве на запрос стиль заметно гулял: каждая буква рождалась
   у генератора заново, и одна выходила шёпотом, другая — бодро. Внутри одной записи
   голос, темп и подача общие для всех.

   Цена — перегенерация целиком: поменял одну букву — заново идёт вся пачка букв,
   иначе новая буква опять будет из другого «дубля». Хеш у пачки — от модели, голоса,
   языка, стиля и всех текстов в ней. Сырые записи пачек лежат в .voice-cache/,
   поэтому --recut перерезает и пережимает их без API.

   Зависимостей нет: node ≥ 18 (fetch) и ffmpeg для обрезки тишины и сжатия в Opus.

     GEMINI_API_KEY=... node letters/make-voice.mjs              # оба языка
     node letters/make-voice.mjs --lang ru --only letter --force # переделать пачку букв
     node letters/make-voice.mjs --recut                         # перерезать из кеша
     node letters/make-voice.mjs --dry                           # что будет сгенерировано
     PIPKA_TTS_MOCK=1 node letters/make-voice.mjs                # без API: тоны вместо речи */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const API='https://generativelanguage.googleapis.com/v1beta/interactions';
const KINDS=['letter','word','praise'];
const SEP=' <long pause> ';
const SR=24000;

function args(){
  const a={lang:'all', config:path.join(HERE,'voice-settings.json'), dict:path.join(HERE,'words.js'),
    out:HERE, cache:path.join(HERE,'.voice-cache'), only:null, force:false, dry:false, recut:false};
  const v=process.argv.slice(2);
  for(let i=0;i<v.length;i++){
    const k=v[i], next=()=>{ if(i+1>=v.length) die('нет значения для '+k); return v[++i]; };
    if(k==='--lang') a.lang=next();
    else if(k==='--config') a.config=next();
    else if(k==='--dict') a.dict=next();
    else if(k==='--out') a.out=next();
    else if(k==='--cache') a.cache=next();
    else if(k==='--only') a.only=next().split(',').map(s=>s.trim()).filter(Boolean);
    else if(k==='--force') a.force=true;
    else if(k==='--dry') a.dry=true;
    else if(k==='--recut') a.recut=true;
    else if(k==='-h'||k==='--help'){ console.log(fs.readFileSync(fileURLToPath(import.meta.url),'utf8').split('*/')[0]); process.exit(0); }
    else die('неизвестный ключ '+k);
  }
  return a;
}
function die(m){ console.error('make-voice: '+m); process.exit(1); }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const sha=x=>crypto.createHash('sha1').update(JSON.stringify(x)).digest('hex').slice(0,16);

/* words.js и voice-*.js — браузерные скрипты, пишущие в window; читаем их в песочнице */
function loadWin(file){
  const win={};
  if(!fs.existsSync(file)) return win;
  vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:win},{filename:file});
  return win;
}

/* Что озвучивать: ключ — то, по чему игра ищет запись, text — что читает модель.
   l: буква, w: слово, p: похвала по номеру */
function items(dict){
  const out=[], seen=new Set();
  const add=(key,text,kind)=>{ if(seen.has(key)) return; seen.add(key); out.push({key,text,kind}); };
  for(const ch of dict.abc) add('l:'+ch, (dict.letters||{})[ch]||ch.toLowerCase(), 'letter');
  for(const ch of Object.keys(dict.letters||{})) add('l:'+ch, dict.letters[ch], 'letter');
  for(const pool of ['s','m','l']) for(const w of (dict.words[pool]||[]))
    add('w:'+w, (dict.say||{})[w]||w.toLowerCase(), 'word');
  (dict.praise||[]).forEach((p,i)=>add('p:'+i, p, 'praise'));
  return out;
}
/* Пачки: по виду, а длинный вид — на равные порции не больше batch. Порции режутся
   поровну, а не «40 и остаток 15»: короткий хвост звучал бы отдельным дублем */
function batches(list,max){
  const out=[];
  for(const kind of KINDS){
    const all=list.filter(it=>it.kind===kind); if(!all.length) continue;
    const parts=Math.ceil(all.length/Math.max(1,max)), size=Math.ceil(all.length/parts);
    for(let i=0;i<parts;i++) out.push({kind,part:i,parts,items:all.slice(i*size,(i+1)*size)});
  }
  return out;
}

/* Язык и произношение — в стиле каждого запроса и у каждого языка свои, из настроек:
   без них генератор тянул русские буквы в английское произношение, а английскому
   нужно своё — британское RP. Текст модель читает дословно, поэтому вся подача — здесь */
function styleFor(lc,kind){
  const L=lc.language||'';
  const lang=L?`Language: ${L}. Every item is ${L}, pronounced as a native ${L} speaker would. `:'';
  const pron=lc.pronunciation?`Pronunciation: ${lc.pronunciation}. `:'';
  return lang+pron+'This is a list of separate items divided by long pauses: say each item exactly once, in the same voice, pitch, tempo and energy for every item, and add nothing else. '+((lc.style||{})[kind]||'');
}
function batchHash(cfg,lc,b){ return sha([cfg.model,lc.voice,styleFor(lc,b.kind),b.items.map(it=>it.text),SEP]); }

/* Gemini 3.8 TTS: подача — в speech_metadata.style, текст — дословная расшифровка.
   Просим сырой PCM 24 кГц: его проще резать */
async function tts(cfg,lc,b,key){
  const text=b.items.map(it=>it.text).join(SEP);
  if(process.env.PIPKA_TTS_MOCK) return mockPcm(b.items);
  const body={model:cfg.model,
    input:[{type:'user_input',content:[{type:'text',text,
      annotations:[{type:'speech_metadata',style:styleFor(lc,b.kind)}]}]}],
    response_format:{type:'audio',mime_type:'audio/l16',sample_rate:SR},
    generation_config:{speech_config:[{voice:lc.voice}]}};
  for(let attempt=0;;attempt++){
    let res, txt;
    try{
      res=await fetch(API,{method:'POST',headers:{'x-goog-api-key':key,'Content-Type':'application/json'},body:JSON.stringify(body)});
      txt=await res.text();
    }catch(e){ if(attempt<5){ await sleep(2000*2**attempt); continue; } throw e; }
    if(res.ok){
      const j=JSON.parse(txt);
      const audio=(j.steps||[]).filter(s=>s.type==='model_output').flatMap(s=>s.content||[]).filter(c=>c.type==='audio'&&c.data);
      if(!audio.length) throw new Error('в ответе нет аудио: '+txt.slice(0,300));
      /* длинный ответ может прийти несколькими кусками — склеиваем по порядку */
      let pcm=Buffer.concat(audio.map(c=>Buffer.from(c.data,'base64')));
      if(pcm.slice(0,4).toString()==='RIFF') pcm=pcm.slice(44);
      return pcm;
    }
    if((res.status===429||res.status>=500) && attempt<6){
      const ra=parseFloat(res.headers.get('retry-after'));
      const wait=isFinite(ra)?ra*1000:Math.min(60000,3000*2**attempt);
      console.warn(`  HTTP ${res.status}, жду ${Math.round(wait/1000)} с`);
      await sleep(wait); continue;
    }
    throw new Error(`HTTP ${res.status}: ${txt.slice(0,500)}`);
  }
}

/* Тестовый режим без API: по тону на элемент через паузу 0.8 с, а у текстов из
   нескольких слов — ещё и короткая пауза внутри, как в «твёрдый знак»: нарезка не
   должна резать по ней */
function mockPcm(list){
  const parts=[], gap=n=>Buffer.alloc(Math.floor(SR*n)*2);
  parts.push(gap(0.35));
  list.forEach((it,i)=>{
    let h=0; for(const c of it.text) h=(h*31+c.codePointAt(0))>>>0;
    const f=300+h%500;
    it.text.split(' ').forEach((w,j)=>{
      if(j) parts.push(gap(0.12));
      const n=Math.floor(SR*(0.15+0.07*w.length)), b=Buffer.alloc(n*2);
      for(let k=0;k<n;k++){ const env=Math.min(1,k/300,(n-k)/300); b.writeInt16LE(Math.round(Math.sin(2*Math.PI*f*k/SR)*env*12000),k*2); }
      parts.push(b);
    });
    parts.push(gap(i<list.length-1?0.7+Math.random()*0.3:0.4));
  });
  return Buffer.concat(parts);
}

/* Нарезка. Громкость меряется окнами по 10 мс; тишина — окна тише пика на 38 дБ.
   Разрезов ровно n−1, по самым длинным паузам: короткие паузы внутри элемента
   (смычка перед «т», промежуток в «твёрдый знак») длинной паузе между элементами
   проигрывают всегда. Режем по середине паузы — остатки тишины срежет ffmpeg.
   Если n−1-я пауза почти не длиннее следующей, разрез неоднозначен: значит, модель
   какой-то элемент пропустила или склеила, и об этом надо сказать */
function split(pcm,n){
  const W=SR/100, frames=Math.floor(pcm.length/2/W), db=new Float64Array(frames);
  let peak=-120;
  for(let f=0;f<frames;f++){
    let s=0; for(let k=0;k<W;k++){ const v=pcm.readInt16LE((f*W+k)*2)/32768; s+=v*v; }
    db[f]=10*Math.log10(s/W+1e-12); if(db[f]>peak) peak=db[f];
  }
  const thr=peak-38, runs=[];
  let start=-1;
  for(let f=0;f<=frames;f++){
    const quiet=f<frames&&db[f]<thr;
    if(quiet&&start<0) start=f;
    if(!quiet&&start>=0){ if(start>0&&f<frames) runs.push({a:start,b:f,len:f-start}); start=-1; }
  }
  if(runs.length<n-1) return {err:`пауз между элементами ${runs.length}, а нужно ${n-1}: модель склеила или пропустила элементы`};
  const sorted=runs.slice().sort((x,y)=>y.len-x.len), cut=sorted.slice(0,n-1).sort((x,y)=>x.a-y.a);
  const weakest=n>1?sorted[n-2].len:0, next=sorted[n-1]?sorted[n-1].len:0;
  const med=n>1?sorted[Math.floor((n-1)/2)].len:0;
  const warn=[];
  if(n>1 && weakest<med*0.4) warn.push(`самая короткая пауза-разрез ${weakest*10} мс против обычных ${med*10} мс — похоже, модель склеила два элемента`);
  if(n>1 && next && next>weakest*0.75) warn.push(`разрез неоднозначен: пауза ${weakest*10} мс выбрана, а ${next*10} мс внутри элемента — почти такая же`);
  const segs=[]; let from=0;
  for(const r of cut){ const mid=Math.floor((r.a+r.b)/2)*W*2; segs.push(pcm.slice(from,mid)); from=mid; }
  segs.push(pcm.slice(from));
  return {segs,warn};
}

function wav(pcm){
  const h=Buffer.alloc(44);
  h.write('RIFF',0); h.writeUInt32LE(36+pcm.length,4); h.write('WAVE',8); h.write('fmt ',12);
  h.writeUInt32LE(16,16); h.writeUInt16LE(1,20); h.writeUInt16LE(1,22); h.writeUInt32LE(SR,24);
  h.writeUInt32LE(SR*2,28); h.writeUInt16LE(2,32); h.writeUInt16LE(16,34); h.write('data',36); h.writeUInt32LE(pcm.length,40);
  return Buffer.concat([h,pcm]);
}
/* Тишина по краям срезается: игра ставит буквы и слово в очередь одну за другой.
   Громкость выравнивается одним коэффициентом на всю пачку, а не на каждую запись:
   loudnorm на каждой букве отдельно снова развёл бы их — тихая «п» стала бы такой же
   громкой, как протяжное «ааа» */
let FF=null;
function hasFfmpeg(){ if(FF===null) FF=spawnSync('ffmpeg',['-version']).status===0; return FF; }
function gainFor(pcm){
  let peak=0; for(let i=0;i<pcm.length;i+=2){ const v=Math.abs(pcm.readInt16LE(i)); if(v>peak) peak=v; }
  return peak?Math.min(8,0.79*32767/peak):1;   // пик пачки на −2 дБ
}
function encode(pcm,gain,bitrate){
  if(!hasFfmpeg()) return {mime:'audio/wav',data:wav(pcm)};
  const af='volume='+gain.toFixed(4)+',silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,'+
    'areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,aresample=48000';
  const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-f','s16le','-ar',String(SR),'-ac','1','-i','pipe:0','-af',af,
    '-ac','1','-c:a','libopus','-b:a',bitrate||'32k','-application','voip','-f','ogg','pipe:1'],{input:pcm,maxBuffer:64<<20});
  if(r.status!==0) throw new Error('ffmpeg: '+String(r.stderr).slice(0,400));
  return {mime:'audio/ogg',data:r.stdout};
}

function writePack(file,lang,pack){
  const keys=Object.keys(pack.clips).sort();
  const lines=keys.map(k=>'  '+JSON.stringify(k)+':'+JSON.stringify(pack.clips[k]));
  const src='/* Сгенерировано make-voice.mjs — не редактировать руками. */\n'+
    '(window.PIPKA_LETTERS_VOICE=window.PIPKA_LETTERS_VOICE||{})['+JSON.stringify(lang)+']={\n'+
    'meta:'+JSON.stringify(pack.meta)+',\nclips:{\n'+lines.join(',\n')+'\n}};\n';
  fs.writeFileSync(file+'.tmp',src); fs.renameSync(file+'.tmp',file);
}

async function run(){
  const a=args();
  const cfg=JSON.parse(fs.readFileSync(a.config,'utf8'));
  const DICT=loadWin(a.dict).PIPKA_LETTERS_DICT;
  if(!DICT) die('в '+a.dict+' нет window.PIPKA_LETTERS_DICT');
  const langs=a.lang==='all'?Object.keys(DICT):a.lang.split(',');
  const key=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY;
  const mock=!!process.env.PIPKA_TTS_MOCK;
  if(!key && !mock && !a.dry && !a.recut) die('нужен GEMINI_API_KEY (или PIPKA_TTS_MOCK=1 для проверки без API)');
  if(!hasFfmpeg()) console.warn('ffmpeg не найден: записи будут в WAV, без обрезки тишины');
  fs.mkdirSync(a.cache,{recursive:true});
  let failed=0;
  for(const lang of langs){
    const dict=DICT[lang], lc=cfg[lang];
    if(!dict) die('в словаре нет языка '+lang);
    if(!lc||!lc.voice) die('в '+path.basename(a.config)+' нет голоса для '+lang);
    const file=path.join(a.out,'voice-'+lang+'.js');
    const old=(loadWin(file).PIPKA_LETTERS_VOICE||{})[lang]||{clips:{}};
    const list=items(dict), bs=batches(list,cfg.batch||40);
    const pack={meta:{model:mock?'mock':cfg.model,voice:lc.voice,made:new Date().toISOString().slice(0,10)},clips:{}};
    console.log(`${lang}: ${list.length} записей в ${bs.length} пачках (голос ${lc.voice}, ${pack.meta.model})`);
    for(const b of bs){
      const h=batchHash(cfg,lc,b)+(mock?'m':''), name=`${lang} ${b.kind}${b.parts>1?' '+(b.part+1)+'/'+b.parts:''}`;
      const raw=path.join(a.cache,`${lang}-${b.kind}-${b.part}-${h}.pcm`);
      const picked=!a.only||a.only.includes(b.kind)||b.items.some(it=>a.only.includes(it.key)||a.only.includes(it.key.slice(2))||a.only.includes(it.text));
      const have=b.items.every(it=>old.clips[it.key]&&old.clips[it.key].h===h);
      const keepOld=()=>{ for(const it of b.items) if(old.clips[it.key]) pack.clips[it.key]=old.clips[it.key]; };
      if(!picked || (have && !a.force && !a.recut)){ keepOld(); if(picked) console.log(`  ${name}: без изменений`); continue; }
      if(a.dry){ console.log(`  ${name}: ${b.items.length} шт. — «${b.items.map(it=>it.text).join(' · ')}»`); keepOld(); continue; }
      try{
        let pcm;
        if(fs.existsSync(raw) && !a.force){ pcm=fs.readFileSync(raw); console.log(`  ${name}: из кеша`); }
        else if(a.recut){ console.log(`  ${name}: в кеше нет, пропускаю`); keepOld(); continue; }
        else { console.log(`  ${name}: запрос, ${b.items.length} шт.…`); pcm=await tts(cfg,lc,b,key); fs.writeFileSync(raw,pcm); }
        const sp=split(pcm,b.items.length);
        if(sp.err){ console.error(`  ${name}: ${sp.err}. Сырая запись: ${raw}`); failed++; keepOld(); continue; }
        for(const w of sp.warn) console.warn(`  ${name}: внимание — ${w}`);
        const g=gainFor(pcm);
        b.items.forEach((it,i)=>{
          const enc=encode(sp.segs[i],g,cfg.bitrate);
          pack.clips[it.key]={h,t:it.text,d:'data:'+enc.mime+';base64,'+enc.data.toString('base64')};
          console.log(`    ${it.key.padEnd(10)} «${it.text}» ${(sp.segs[i].length/2/SR).toFixed(2)} с`);
        });
        writePack(file,lang,{...pack,clips:{...old.clips,...pack.clips}});
      }catch(e){ console.error(`  ${name}: ${e.message}`); failed++; keepOld(); }
    }
    if(a.dry) continue;
    writePack(file,lang,pack);
    console.log(`${lang}: ${Object.keys(pack.clips).length} записей, ${path.basename(file)} — ${Math.round(fs.statSync(file).size/1024)} КБ`);
  }
  if(failed) process.exitCode=2;
}
run().catch(e=>die(e.stack||e.message));
