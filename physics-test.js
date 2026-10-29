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
// (стартовые условия те же, что в игре: 220 м, снижение 6 м/с)
L=lander({y:220,vy:-6});
rr=fly(L,(l)=>{
  const want=Math.max(-20,Math.min(-0.8,-(l.y*0.16+0.7)));
  return {thr:Math.max(0,Math.min(1,hoverThr(l.fuel)+(want-l.vy)*0.95)), rot:0};
},240,(l)=>l.y<=0);
check('автопилот садится мягко', rr.hit && Math.abs(L.vy)<LAND.vLand && L.fuel>0,
  rr.hit?('касание на '+Math.abs(L.vy).toFixed(2)+' м/с за '+rr.t.toFixed(0)+' с, израсходовано '+
    (LAND.fuel0-L.fuel).toFixed(0)+' кг из '+LAND.fuel0):'не долетел');

// запас топлива: на номинальную посадку должно уходить заметно меньше бака
L=lander({y:220,vy:-6});
rr=fly(L,(l)=>{
  const want=Math.max(-20,Math.min(-0.8,-(l.y*0.16+0.7)));
  return {thr:Math.max(0,Math.min(1,hoverThr(l.fuel)+(want-l.vy)*0.95)), rot:0};
},240,(l)=>l.y<=0);
const used=LAND.fuel0-L.fuel;
check('бак примерно вдвое больше номинала', used>LAND.fuel0*0.3 && used<LAND.fuel0*0.75,
  'номинал '+used.toFixed(0)+' кг, бак '+LAND.fuel0+' кг');

// допуски вне площадки должны быть именно «сильно ниже», а не чуть-чуть
check('допуски на грунте втрое строже',
  LAND.vLandRough<=LAND.vLand*0.4 && LAND.vSideRough<=LAND.vSide*0.4 && LAND.tiltRough<=LAND.tiltLand*0.4,
  LAND.vLandRough+' / '+LAND.vSideRough+' м/с и '+(LAND.tiltRough*57.3).toFixed(1)+
  '° против '+LAND.vLand+' / '+LAND.vSide+' и '+(LAND.tiltLand*57.3).toFixed(0)+'°');

// посадка на грунт в принципе достижима: автопилот должен в неё укладываться
L=lander({y:220,vy:-6});
rr=fly(L,(l)=>{
  const want=Math.max(-20,Math.min(-0.5,-(l.y*0.14+0.45)));
  return {thr:Math.max(0,Math.min(1,hoverThr(l.fuel)+(want-l.vy)*0.95)), rot:0};
},240,(l)=>l.y<=0);
check('на грунт сесть можно', rr.hit && Math.abs(L.vy)<LAND.vLandRough,
  'касание на '+Math.abs(L.vy).toFixed(2)+' м/с при допуске '+LAND.vLandRough+
  ' (запас '+((LAND.vLandRough-Math.abs(L.vy))*1000).toFixed(0)+' мм/с)');

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


/* ================= КАТАПУЛЬТА ================= */
const srcC=fs.readFileSync(path.join(__dirname,'catapult','index.html'),'utf8');
const A3=srcC.indexOf('/* --- CATAPULT-CORE-BEGIN --- */'), B3=srcC.indexOf('/* --- CATAPULT-CORE-END --- */');
if(A3<0||B3<0){ console.error('не нашёл маркеры CATAPULT-CORE в catapult/index.html'); process.exit(2); }
eval(srcC.slice(A3,B3));   // определяет CAT, AMMO, armInit, armStep, release, launch, projStep, flyTo
const [ROCK,GROT,SQUIG]=AMMO;
const range=(t,am,wx,wz,dh)=>{ const P=flyTo(t,am,0,wx||0,wz||0,(dh||0)+am.r,0,0,0); return {d:P.z, lat:P.x, t:P.t}; };

// энергия: всё, что отдал торсион, минус подъём рычага и груза, — в кинетику на сходе
for(const am of AMMO){
  const A=armInit(1); let n=0; while(!armStep(A,am.m,DT)&&n++<600);
  const E=CAT.K*(A.th*CAT.PHI-CAT.PHI*CAT.PHI/2), dh=Math.sin(CAT.A0+CAT.PHI)-Math.sin(CAT.A0);
  const Eg=(am.m*CAT.L+CAT.mrod*CAT.L/2)*CAT.g*dh, KE=0.5*(CAT.Irod+am.m*CAT.L*CAT.L)*A.w*A.w;
  check('энергия рычага: '+am.id, Math.abs(KE-(E-Eg))/(E-Eg)<0.015,
    'кинетика '+(KE/1000).toFixed(1)+' кДж против '+((E-Eg)/1000).toFixed(1)+', вылет '+(A.w*CAT.L).toFixed(1)+' м/с за '+(n*DT).toFixed(2)+' с');
}
let P0=launch(1,ROCK,0,0,0,0), v0=Math.hypot(P0.vz,P0.vy), ang=Math.atan2(P0.vy,P0.vz)*57.3;
check('камень на полном натяге', v0>38&&v0<42 && Math.abs(ang-42)<1, v0.toFixed(1)+' м/с под '+ang.toFixed(1)+'°');

// дальность: от «под ноги» до дальше самого дальнего форта, и строго растёт с натягом
let r0=range(0,ROCK), r1=range(1,ROCK);
check('дальность камня, натяг 0…100%', r0.d<35 && r1.d>140 && r1.d<170, r0.d.toFixed(0)+' … '+r1.d.toFixed(0)+' м, полёт '+r1.t.toFixed(1)+' с');
for(const am of AMMO){
  let prev=-1, mono=true, out=[];
  for(let t=0;t<=1.0001;t+=0.05){ const d=range(t,am).d; if(d<=prev) mono=false; prev=d; if(Math.abs(t*4-Math.round(t*4))<1e-6) out.push(Math.round(d)); }
  check('дальность растёт с натягом: '+am.id, mono, out.join(' / ')+' м на 0/25/50/75/100%');
}
// линейность: шаг 1% натяга в середине и по краям отличается не больше чем вдвое
{ const s=(t)=>range(t+0.01,ROCK).d-range(t,ROCK).d, a=s(0.1), b=s(0.5), c=s(0.9);
  check('1% натяга ≈ одинаковые метры', Math.max(a,b,c)/Math.min(a,b,c)<2, a.toFixed(2)+' / '+b.toFixed(2)+' / '+c.toFixed(2)+' м на 10/50/90%'); }

// форты на 66–132 м (FORT.D в genLevel) и на 3 м выше катапульты; донжон ещё на 7 м
// глубже. Самый дальний достаём камнем против самого сильного ветра, 7 м/с
{ const far=range(1,ROCK,0,-7,3).d, near=range(0,ROCK,0,7,3).d;
  check('все форты в досягаемости камня', far>132+8 && near<66, 'встречный 7 м/с: '+far.toFixed(0)+' м; попутный 7 м/с на нуле: '+near.toFixed(0)+' м'); }

// ветер сносит грота сильнее камня, на одной дистанции ~90 м
{ const tr=(am)=>{ let lo=0,hi=1; for(let i=0;i<30;i++){ const m=(lo+hi)/2; if(range(m,am).d<90) lo=m; else hi=m; } return lo; };
  const tR=tr(ROCK), tG=tr(GROT), dR=range(tR,ROCK,5,0).lat, dG=range(tG,GROT,5,0).lat;
  check('боковой ветер 5 м/с на 90 м', dG>2*dR && dR>0.5, 'камень '+dR.toFixed(1)+' м, грот '+dG.toFixed(1)+' м (натяг '+(tR*100).toFixed(0)+'% и '+(tG*100).toFixed(0)+'%)');
  // уши: полный нажим вбок весь полёт
  const P=launch(tG,GROT,0,0,0,0); let T=0; while(T<30){ projStep(P,GROT,0,0,1,0,DT); T+=DT; if(P.vy<0&&P.y<=GROT.r) break; }
  // вправо — это −x: камера смотрит вдоль +z
  check('грот рулит ушами', -P.x>6&&-P.x<20, 'вправо на '+(-P.x).toFixed(1)+' м за '+T.toFixed(1)+' с полёта на '+P.z.toFixed(0)+' м');
  const Q=launch(tG,GROT,0,0,0,0); T=0; while(T<30){ projStep(Q,GROT,0,0,0,1,DT); T+=DT; if(Q.vy<0&&Q.y<=GROT.r) break; }
  check('грот тянет ушами вверх', Q.z>90+5&&Q.z<90+40, 'дальность '+Q.z.toFixed(0)+' м вместо 90'); }


console.log('— прошло —'); ok.forEach(s=>console.log('  ✓ '+s));
if(bad.length){ console.log('— ПРОВАЛ —'); bad.forEach(s=>console.log('  ✗ '+s)); process.exitCode=1; }
