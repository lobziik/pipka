// Прогон модели машины из race.html.  Запуск: node physics-test.js
// Ядро физики берётся прямо из игры между маркерами PHYSICS-CORE, так что
// тест и игра не могут разъехаться: после любой правки констант прогнать заново.
const fs=require('fs'), path=require('path');
const src=fs.readFileSync(path.join(__dirname,'race','index.html'),'utf8');
const A=src.indexOf('/* --- PHYSICS-CORE-BEGIN --- */'), B=src.indexOf('/* --- PHYSICS-CORE-END --- */');
if(A<0||B<0){ console.error('не нашёл маркеры PHYSICS-CORE в race/index.html'); process.exit(2); }
eval(src.slice(A,B));   // определяет CAR и carStep
const ROAD={mu:CAR.muRoad, roll:CAR.roll}, GRASS={mu:CAR.muGrass, roll:CAR.roll*6};
const DT=1/120;
function fresh(o){ return Object.assign({x:0,y:0,th:0,vx:0,vy:0,w:0,steer:0,ax:0}, o||{}) }
function run(V,In,secs,surf,stop){
  let t=0, out=null;
  for(let i=0;i<Math.round(secs/DT);i++){
    const r=carStep(V,typeof In==='function'?In(t):In,surf||ROAD,DT);
    t+=DT;
    if(!isFinite(V.vx)||!isFinite(V.vy)||!isFinite(V.w)||!isFinite(V.x)) return {t,nan:true,V,r};
    if(stop&&stop(V,t)){ out={t}; break; }
  }
  return {t, V, out};
}
const ok=[], bad=[];
function check(name,cond,detail){ (cond?ok:bad).push(name+': '+detail); }

// 1. разгон 0-100 км/ч
let V=fresh(), r=run(V,{steer:0,gas:1,brk:0,hb:false},20,ROAD,v=>v.vx>=27.78);
check('разгон 0-100', r.out && r.out.t<9, r.out?r.out.t.toFixed(2)+' с':'не достиг');

// 2. максималка
V=fresh(); run(V,{steer:0,gas:1,brk:0,hb:false},60);
check('максималка', V.vx*3.6>110 && V.vx*3.6<165, (V.vx*3.6).toFixed(0)+' км/ч');

// 3. торможение с 30 м/с
V=fresh({vx:30}); const x0=V.x;
r=run(V,{steer:0,gas:0,brk:1,hb:false},12,ROAD,v=>v.vx<=0.5);
check('тормозной путь с 108 км/ч', r.out && r.out.t<5.5,
  r.out?(r.out.t.toFixed(2)+' с, '+(V.x-x0).toFixed(0)+' м, среднее '+(30/r.out.t/9.81).toFixed(2)+' g'):'не остановилась');

// 4. накат без газа
V=fresh({vx:30});
r=run(V,{steer:0,gas:0,brk:0,hb:false},60,ROAD,v=>v.vx<=5);
check('накат 108→18 км/ч', r.out && r.out.t<22, r.out?r.out.t.toFixed(1)+' с':'не замедлилась (>60 с)');

// 5. руль в упор на 20 м/с — должна ехать по дуге, а не разворачиваться
V=fresh({vx:20});
r=run(V,{steer:1,gas:0.3,brk:0,hb:false},6);
let ay=Math.abs(V.w*V.vx), sl=Math.abs(Math.atan2(V.vy,V.vx)*57.3);
check('руль в упор на 72 км/ч', !r.nan && V.vx>8 && sl<35 && ay/9.81<1.6,
  (ay/9.81).toFixed(2)+' g, рыскание '+V.w.toFixed(2)+' рад/с, снос '+sl.toFixed(1)+'°, скорость '+(V.vx*3.6).toFixed(0)+' км/ч');

// 5б. то же на 110 км/ч
V=fresh({vx:30});
r=run(V,{steer:1,gas:0.5,brk:0,hb:false},5);
ay=Math.abs(V.w*V.vx); sl=Math.abs(Math.atan2(V.vy,V.vx)*57.3);
check('руль в упор на 110 км/ч', !r.nan && V.vx>12 && sl<35,
  (ay/9.81).toFixed(2)+' g, снос '+sl.toFixed(1)+'°, скорость '+(V.vx*3.6).toFixed(0)+' км/ч');

// 5в. радиус дуги на малой скорости — должен пролезать в самый тесный поворот (104 px = 13 м)
V=fresh({vx:13});
r=run(V,{steer:1,gas:0.2,brk:0,hb:false},4);
const Rturn=Math.abs(V.vx/(V.w||1e-6));
check('радиус на 47 км/ч', Rturn<13, Rturn.toFixed(1)+' м (нужно <13)');

// 6. ГЛАВНОЕ: выход из заноса без газа
V=fresh({vx:6,vy:18,w:3.5});
r=run(V,{steer:0,gas:0,brk:0,hb:false},12,ROAD,v=>Math.hypot(v.vx,v.vy)<1 && Math.abs(v.w)<0.3);
check('занос гасится сам', !r.nan && r.out && r.out.t<9,
  r.nan?'NaN!':(r.out?r.out.t.toFixed(1)+' с до остановки':'НЕ ОСТАНОВИЛАСЬ, скорость '+Math.hypot(V.vx,V.vy).toFixed(1)+' м/с, рыскание '+V.w.toFixed(2)));

// 7. занос с тормозом в пол (раньше тут был лёд)
V=fresh({vx:6,vy:18,w:3.5});
r=run(V,{steer:0,gas:0,brk:1,hb:false},12,ROAD,v=>Math.hypot(v.vx,v.vy)<1&&Math.abs(v.w)<0.3);
check('занос + тормоз в пол', !r.nan && r.out && r.out.t<9,
  r.out?('остановилась за '+r.out.t.toFixed(1)+' с'):'НЕ ОСТАНОВИЛАСЬ, '+Math.hypot(V.vx,V.vy).toFixed(1)+' м/с');

// 8. движение задом: боковая сила не должна разгонять снос
V=fresh({vx:-6,vy:4,w:1.0});
r=run(V,{steer:0,gas:0,brk:0,hb:false},10,ROAD,v=>Math.hypot(v.vx,v.vy)<1);
check('задним ходом боком', !r.nan && r.out, r.out?r.out.t.toFixed(1)+' с до остановки':'разогналась: '+Math.hypot(V.vx,V.vy).toFixed(1)+' м/с');

// 9. заднего хода нет: тормоз в пол на месте держит машину
V=fresh();
run(V,{steer:0,gas:0,brk:1,hb:false},14);
check('назад не едет', Math.abs(V.vx)<0.15, (V.vx*3.6).toFixed(2)+' км/ч за 14 с тормоза в пол');

// 9б. после отскока от стены назад — сама останавливается, а не катится
V=fresh({vx:-5});
let r9=run(V,{steer:0,gas:0,brk:0,hb:false},10,ROAD,v=>Math.abs(v.vx)<0.3);
check('откат назад гасится', r9.out && r9.out.t<6, r9.out?r9.out.t.toFixed(1)+' с':'катится дальше');

// 10. ручник: срыв есть, но машина не улетает навсегда
V=fresh({vx:22});
run(V,{steer:0.8,gas:0.3,brk:0,hb:true},1.8);
const slipHB=Math.abs(Math.atan2(V.vy,Math.abs(V.vx))*57.3);
r=run(V,{steer:0,gas:0,brk:0,hb:false},10,ROAD,v=>Math.abs(Math.atan2(v.vy,Math.abs(v.vx)))<0.05||Math.hypot(v.vx,v.vy)<1);
check('ручник: занос и выход', slipHB>6 && r.out, 'снос '+slipHB.toFixed(0)+'°, выпрямился за '+(r.out?r.out.t.toFixed(1):'>10')+' с');

// 11. трава тормозит
V=fresh({vx:25});
r=run(V,{steer:0,gas:0,brk:0,hb:false},20,GRASS,v=>v.vx<=5);
check('накат по траве 90→18 км/ч', r.out && r.out.t<12, r.out?r.out.t.toFixed(1)+' с':'>20 с');


/* ================= ЛУННЫЙ МОДУЛЬ ================= */
const srcM=fs.readFileSync(path.join(__dirname,'moon','index.html'),'utf8');
const A2=srcM.indexOf('/* --- LANDER-CORE-BEGIN --- */'), B2=srcM.indexOf('/* --- LANDER-CORE-END --- */');
if(A2<0||B2<0){ console.error('не нашёл маркеры LANDER-CORE в moon/index.html'); process.exit(2); }
eval(srcM.slice(A2,B2));   // определяет LAND и landStep

function lander(o){ return Object.assign({x:0,y:400,vx:0,vy:0,th:0,w:0,fuel:LAND.fuel0,thr:0,tq:0}, o||{}) }
function fly(L,In,secs,stop){
  let t=0, r=null;
  for(let i=0;i<Math.round(secs/DT);i++){
    r=landStep(L,typeof In==='function'?In(L,t):In,DT);
    t+=DT;
    if(!isFinite(L.y)||!isFinite(L.vy)||!isFinite(L.th)) return {t,nan:true,r};
    if(stop&&stop(L,t)) return {t,r,hit:true};
  }
  return {t,r};
}
const hoverThr=(fuel)=>((LAND.dry+fuel)*LAND.g)/LAND.thrust;

// тяговооружённость и дроссель зависания
let L=lander(), rr=landStep(L,{thr:1,rot:0},DT);
check('тяговооружённость на полной заправке', rr.twr>1.7 && rr.twr<2.4, rr.twr.toFixed(2));
check('дроссель зависания', hoverThr(LAND.fuel0)>0.4 && hoverThr(LAND.fuel0)<0.62,
  (hoverThr(LAND.fuel0)*100).toFixed(0)+'% полный бак → '+(hoverThr(0)*100).toFixed(0)+'% пустой');

// висение на половине хода: высота не должна уезжать
L=lander({y:100});
fly(L,(l)=>({thr:hoverThr(l.fuel),rot:0}),20);
check('зависание держит высоту', Math.abs(L.y-100)<2.5 && L.fuel>0,
  'ушло на '+(L.y-100).toFixed(2)+' м за 20 с, топлива осталось '+L.fuel.toFixed(0)+' кг');

// свободное падение с 400 м
L=lander({y:400});
rr=fly(L,{thr:0,rot:0},120,(l)=>l.y<=0);
check('свободное падение с 400 м', rr.hit && Math.abs(Math.abs(L.vy)-Math.sqrt(2*LAND.g*400))<1,
  rr.t.toFixed(1)+' с, удар на '+Math.abs(L.vy).toFixed(1)+' м/с');

// автопилот: простой контур по вертикальной скорости обязан сажать мягко
L=lander({y:400,vy:-3});
rr=fly(L,(l)=>{
  const want=Math.max(-20,Math.min(-0.8,-(l.y*0.16+0.7)));
  return {thr:Math.max(0,Math.min(1,hoverThr(l.fuel)+(want-l.vy)*0.95)), rot:0};
},240,(l)=>l.y<=0);
check('автопилот садится мягко', rr.hit && Math.abs(L.vy)<LAND.vLand && L.fuel>0,
  rr.hit?('касание на '+Math.abs(L.vy).toFixed(2)+' м/с за '+rr.t.toFixed(0)+' с, израсходовано '+
    (LAND.fuel0-L.fuel).toFixed(0)+' кг из '+LAND.fuel0):'не долетел');

// запас топлива: на номинальную посадку должно уходить заметно меньше бака
L=lander({y:400,vy:-3});
rr=fly(L,(l)=>{
  const want=Math.max(-20,Math.min(-0.8,-(l.y*0.16+0.7)));
  return {thr:Math.max(0,Math.min(1,hoverThr(l.fuel)+(want-l.vy)*0.95)), rot:0};
},240,(l)=>l.y<=0);
const used=LAND.fuel0-L.fuel;
check('бак примерно вдвое больше номинала', used>LAND.fuel0*0.3 && used<LAND.fuel0*0.75,
  'номинал '+used.toFixed(0)+' кг, бак '+LAND.fuel0+' кг');

// вращение: отклонение задаёт скорость, а не момент
L=lander({y:200});
fly(L,{thr:0,rot:1},1.5);
check('вращение выходит на заданную скорость', Math.abs(L.w-LAND.omegaMax)<0.05,
  L.w.toFixed(3)+' рад/с при пределе '+LAND.omegaMax);
fly(L,{thr:0,rot:0},1.5);
check('отпущенная пипка гасит вращение', Math.abs(L.w)<0.03, L.w.toFixed(4)+' рад/с');

// пустой бак: тяги нет, NaN нет
L=lander({y:300,fuel:0});
rr=fly(L,{thr:1,rot:1},10);
check('пустой бак не даёт тяги', !rr.nan && L.vy<0 && Math.abs(L.w)<1e-9,
  'вертикальная '+L.vy.toFixed(1)+' м/с, вращение '+L.w.toFixed(3));

// снос гасится наклоном: 15 м/с вбок должно убираться за разумное время и топливо
L=lander({y:400,vx:15});
rr=fly(L,(l)=>({thr:hoverThr(l.fuel)*1.15, rot:0, }),0.001);
L.th=-0.35;  // наклон против сноса
rr=fly(L,(l)=>({thr:hoverThr(l.fuel)/Math.cos(l.th), rot:0}),60,(l)=>l.vx<=0);
check('снос 15 м/с гасится наклоном 20°', rr.hit && rr.t<30,
  rr.hit?(rr.t.toFixed(1)+' с, потрачено '+(LAND.fuel0-L.fuel).toFixed(0)+' кг'):'не погасился за 60 с');


console.log('— прошло —'); ok.forEach(s=>console.log('  ✓ '+s));
if(bad.length){ console.log('— ПРОВАЛ —'); bad.forEach(s=>console.log('  ✗ '+s)); process.exitCode=1; }
