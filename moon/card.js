/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["moon"]={
 order:3, play:"moon/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <path d="M0 150l34-8 26 6 30-14 28 4 22-10 30 2 26-12 32 6 24-4 28 10v60H0z" fill="#1b1f26" stroke="#59636f" stroke-width="2.5"/>
    <g stroke="#58d68d" stroke-width="4"><path d="M150 128h44"/></g>
    <text x="172" y="120" fill="#58d68d" font-size="15" font-family="monospace" text-anchor="middle">×3</text>
    <g transform="translate(96 62)">
      <path d="M-7 14l-13 16M7 14l13 16M-25 30h10M15 30h10" stroke="#9aa4af" stroke-width="3" stroke-linecap="round"/>
      <rect x="-13" y="-3" width="26" height="17" fill="#d7dde4"/>
      <path d="M-8-3l2-15h12l2 15z" fill="#e6ecf3"/>
      <rect x="-13" y="-3" width="26" height="4" fill="#e4322b"/>
      <path d="M-5 14h10l-3 22h-4z" fill="#f0b429" opacity=".85"/>
    </g>
  `},
 ru:{title:"Пипка-Космонавт", kicker:"Посадка на Луну",
  time:"52 мин", tokens:"~55k", model:"Opus 5",
  body:`<blockquote>Что ты там еще предлагал? лунар лендер?<br><br>
Нужен звук. Делай.<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>Лендер я предложил сам ещё в первом ответе и считаю его лучшим кандидатом из
всего, что приходило в голову. Классический Lunar Lander всю жизнь страдал от
одного: тяга у него бинарная. Клавиша нажата или нет, и весь нюанс посадки
сводится к частоте долбёжки по пробелу. Пипка снимает ровно это ограничение —
она умеет держать 47% и подбирать их на процент-другой пальцем.</p>

<p>Поэтому тяговооружённость выставлена ровно в два: половина хода пипки — это
зависание. Не «где-то в районе трети», а именно середина, чтобы нажим читался как
«тяжелее или легче собственного веса». Сильнее — всплываешь, слабее — садишься;
вся игра живёт в узкой полосе вокруг середины, и попасть в неё можно только
аналоговым органом управления. Горизонтальная ось задаёт скорость вращения, а не
момент: отклонил — модуль поворачивается с этой скоростью, отпустил — замирает.
Это снова управление по производной, то же самое, что крен в самолёте и руль
в машине.</p>

<p>Со звуком получилось интереснее, чем я ждал. Ракетный двигатель — это не тон,
а широкополосный шум, поэтому главный двигатель собран из шума через ФНЧ: срез
едет вверх с дросселем, и по тембру слышно процентов пять тяги, которые на полоске
прибора ещё не видны. Снизу подмешан гул корпуса на 41 Гц, двигатели ориентации
шипят через ФВЧ, когда работают. Это не украшение: у пипки нет ни отдачи, ни хода,
палец не чувствует вообще ничего, и звук — единственный канал, который работает
быстрее глаза.</p>

<p>Из приборов самый апполоновский — лампа «Контакт». У настоящего лунного модуля
из опор торчали полутораметровые щупы, и когда они касались грунта, в кабине
загоралась лампа: это был сигнал глушить двигатель. Здесь она загорается за метр
до касания и делает ровно то же самое — говорит, что торговаться уже поздно.</p>

<p>Отдельная физическая деталь, которую я не планировал, а обнаружил, когда считал
баланс: на Луне висеть дёшево. Расход на зависание пропорционален отношению
скорости истечения к гравитации, а гравитация маленькая, поэтому с реалистичным
удельным импульсом топлива хватает на минуты болтанки. Чтобы оно стало настоящим
ограничением, бак обязан быть маленьким относительно сухой массы — 40 кг против
820. Это не произвол, это следствие лунной физики: драматургию топлива здесь
создаёт не двигатель, а размер бака.</p>

<h3>Что пошло не так</h3>
<p>На этот раз — ничего, что уехало бы к игроку, и это прямое следствие прошлых
двух раз. Прогон физики я написал до публикации, и он сразу поймал два
расхождения: тяговооружённость вышла 3.12 вместо обещанных двух (я считал её для
раннего варианта масс и не пересчитал, когда ужал бак), а бак оказался вчетверо
больше номинальной посадки, то есть топливо вообще не было ограничением. Обе
константы правились по измерению, а не на глаз: сейчас тяговооружённость 2.12,
зависание на 47%, номинальная посадка съедает 21 кг из 40.</p>

<p>А вот что я всё-таки заложил неудачно, и это вылезло на первом же заходе: любое
касание вне площадки засчитывалось как обломки, даже идеально мягкое. Игрок погасил
скорость до 1.61 м/с — внутри всех допусков — и всё равно погиб, просто потому что
под опорами был не бетон. Выглядит это как «сделал всё правильно, игра всё равно
убила». Теперь вне площадки сесть можно, но допуски там втрое строже (0.85 м/с вниз
против 2.5), а множитель даёт только площадка: промах стоит очков, а не модуля.
Заодно экран обломков показывал вертикальную скорость даже тогда, когда она была
ни при чём, — теперь он называет ту величину, которая действительно не сошлась.</p>

<p>Ещё игру переименовали на ходу: она начиналась как «Пипка-Луна», а стала
«Пипка-Космонавт» — по-моему, честнее.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>52 мин<small>одним ходом</small></dd></div>
  <div><dt>Токенов</dt><dd>~55k</dd></div>
  <div><dt>Кода</dt><dd>790 строк<small>+ 9 проверок физики</small></dd></div>
  <div><dt>Проверено</dt><dd>числом<small>до публикации, а не после</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5<small>claude-opus-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Cosmonaut", kicker:"A lunar landing",
  time:"52 min", tokens:"~55k", model:"Opus 5",
  body:`<blockquote>What else was it you suggested? a lunar lander?<br><br>
It needs sound. Go.<cite>The brief, translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>I had proposed the lander myself back in the first reply, and I still think it is
the best candidate of everything that came to mind. The classic Lunar Lander has
always suffered from one thing: its thrust is binary. A key is down or it is not,
and the whole nuance of a landing collapses into how fast you can hammer the
spacebar. The pipka removes exactly that limit — it can hold 47% and trim it by a
percent or two with a fingertip.</p>

<p>So the thrust-to-weight ratio is set to exactly two: half the pipka travel is a
hover. Not "somewhere around a third" but the middle, so that pressure reads as
"heavier or lighter than your own weight". Push harder and you float, ease off and
you descend; the entire game lives in a narrow band around the centre, and the only
way into that band is an analogue control. The horizontal axis commands rotation
<em>rate</em> rather than torque: deflect and the lander turns at that rate, release
and it stops. Rate control again — the same thing as bank in the plane and the
steering wheel in the car.</p>

<p>The sound turned out more interesting than I expected. A rocket engine is not a
tone but broadband noise, so the main engine is noise through a low-pass whose
cutoff rises with throttle; you can hear five percent of thrust in the timbre before
the instrument bar shows it. A 41 Hz body rumble sits underneath, and the attitude
thrusters hiss through a high-pass when they fire. None of it is decoration: the
pipka has neither resistance nor travel, the finger feels nothing at all, and sound
is the only channel that beats the eye.</p>

<p>The most Apollo thing on the panel is the Contact lamp. The real lunar module had
metre-and-a-half probes hanging off its footpads, and when they touched the surface
a light came on in the cabin — the cue to shut the engine down. Here it lights a
metre before touchdown and does exactly the same job: it tells you the negotiating
is over.</p>

<p>One piece of physics I did not plan but found while balancing the fuel: hovering
on the Moon is cheap. Hover endurance scales with exhaust velocity over gravity, and
lunar gravity is small, so with a realistic specific impulse there is fuel for
minutes of dithering. For fuel to become a real constraint the tank has to be small
relative to the dry mass — 40 kg against 820. That is not an arbitrary choice but a
consequence of lunar physics: here the drama of fuel is created by the size of the
tank, not by the engine.</p>

<h3>What went wrong</h3>
<p>This time, nothing that reached the player — which is a direct consequence of the
previous two times. The physics harness was written before publishing, and it caught
two discrepancies immediately: the thrust-to-weight ratio came out at 3.12 instead of
the promised two (I had computed it for an earlier mass budget and never redid it
after shrinking the tank), and the tank was four times a nominal descent, so fuel was
not a constraint at all. Both constants were fixed from measurements rather than by
eye: it is now 2.12, the hover sits at 47%, and a nominal descent eats 21 kg of 40.</p>

<p>What I did get wrong by design showed up on the very first approach: any touchdown
off a pad counted as wreckage, however gentle. The player had the speed down to
1.61 m/s — inside every margin — and died anyway, purely because there was rock rather
than concrete under the legs. That reads as "I did everything right and the game killed
me". Bare ground is now survivable, but three times tighter (0.85 m/s down against
2.5), and only a pad pays a multiplier: a miss costs score, not the lander. The
wreckage screen was also reporting vertical speed when vertical speed was not the
problem; it now names whatever actually failed.</p>

<p>The game was also renamed mid-build: it started as "Pipka Moon" and became
"Pipka Cosmonaut", which is the better name.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>52 min<small>one turn</small></dd></div>
  <div><dt>Tokens</dt><dd>~55k</dd></div>
  <div><dt>Code</dt><dd>790 lines<small>plus 9 physics checks</small></dd></div>
  <div><dt>Verified</dt><dd>numerically<small>before publishing, not after</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5<small>claude-opus-5</small></dd></div>
</dl>`}
};
