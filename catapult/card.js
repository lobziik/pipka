/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["catapult"]={
 order:8, play:"catapult/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <rect width="300" height="190" fill="#6a8aa6"/>
    <rect y="70" width="300" height="50" fill="#d8ad78"/>
    <path d="M0 92 C40 70 70 78 110 86 C150 94 190 62 230 74 C260 82 280 72 300 78 V120 H0 Z" fill="#c99a62"/>
    <rect y="112" width="300" height="78" fill="#b8875a"/>
    <path d="M0 150 L120 128 L300 160 V190 H0 Z" fill="#a8744a"/>
    <path d="M60 118 Q140 -10 228 92" fill="none" stroke="#ffa62a" stroke-width="2.5" stroke-dasharray="3 6"/>
    <g fill="#8b8a86" stroke="#4a4844" stroke-width="1">
      <rect x="208" y="96" width="9" height="9"/><rect x="217" y="96" width="9" height="9"/><rect x="226" y="96" width="9" height="9"/>
      <rect x="235" y="96" width="9" height="9"/><rect x="244" y="96" width="9" height="9"/>
      <rect x="208" y="105" width="9" height="9"/><rect x="217" y="105" width="9" height="9"/><rect x="226" y="105" width="9" height="9"/>
      <rect x="235" y="105" width="9" height="9"/><rect x="244" y="105" width="9" height="9"/>
      <rect x="199" y="78" width="9" height="9"/><rect x="199" y="87" width="9" height="9"/><rect x="199" y="96" width="9" height="9"/><rect x="199" y="105" width="9" height="9"/>
      <rect x="253" y="78" width="9" height="9"/><rect x="253" y="87" width="9" height="9"/><rect x="253" y="96" width="9" height="9"/><rect x="253" y="105" width="9" height="9"/>
    </g>
    <rect x="228" y="88" width="7" height="8" fill="#8b8a86" stroke="#4a4844" stroke-width="1"/>
    <g fill="#4d6584"><rect x="201" y="66" width="5" height="12"/><rect x="255" y="66" width="5" height="12"/><rect x="242" y="86" width="5" height="10"/></g>
    <g fill="#e4322b"><path d="M199 58 h9 l-4.5 6 z"/><path d="M253 58 h9 l-4.5 6 z"/><path d="M240 78 h9 l-4.5 6 z"/></g>
    <rect x="18" y="146" width="96" height="9" fill="#6b4626"/>
    <g fill="#2d1d10"><circle cx="34" cy="160" r="12"/><circle cx="98" cy="160" r="12"/></g>
    <g fill="#55565a"><circle cx="34" cy="160" r="4"/><circle cx="98" cy="160" r="4"/></g>
    <path d="M44 146 L66 110 L88 146" fill="none" stroke="#6b4626" stroke-width="5"/>
    <path d="M66 110 L44 74" stroke="#c9241a" stroke-width="7" stroke-linecap="round"/>
    <rect x="34" y="64" width="18" height="10" fill="#55565a" transform="rotate(-58 43 69)"/>
    <circle cx="66" cy="110" r="6" fill="#4a3c28"/>
    <g fill="#f0b429"><rect x="18" y="146" width="12" height="9"/><rect x="42" y="146" width="12" height="9"/><rect x="66" y="146" width="12" height="9"/><rect x="90" y="146" width="12" height="9"/></g>
    <rect x="128" y="132" width="20" height="26" fill="#2b2420"/>
    <rect x="126" y="112" width="24" height="20" fill="#5aa02c"/>
    <rect x="124" y="124" width="28" height="9" fill="#468522"/>
    <g fill="#f1ead2"><path d="M129 126 l2 -7 l2 7 z"/><path d="M143 126 l2 -7 l2 7 z"/></g>
    <g fill="#ff3010"><rect x="131" y="117" width="5" height="3"/><rect x="141" y="117" width="5" height="3"/></g>
    <rect x="124" y="104" width="28" height="9" fill="#141414"/>
    <g fill="#e2d8b8"><path d="M124 106 l-8 -12 l10 6 z"/><path d="M152 106 l8 -12 l-10 6 z"/></g>
  `},
 ru:{title:"Пипка-Катапульта", kicker:"Орки, торсион и тензодатчик",
  time:"~43 мин", tokens:"~295k", model:"Opus 5.5",
  body:`<blockquote>сделай новую крутую пипка-игру с физикой. Хочу КАТАПУЛЬТУ! У нас тут таки
тензодатчик с возможностью определять направление. От третьего лица. И чтоб 3д.
Референс - орки из вахи и пипка естественно.<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>Первым делом надо было понять, что в катапульте делает пипка. Самое очевидное —
«натянул пальцем, отпустил — полетело», но это сила как положение, а весь сайт держится
на обратном: нажим задаёт скорость. И у катапульты как раз есть то, что крутят, — ворот.
Тянешь пипку на себя — орки крутят ворот и закручивают торсион, от себя — отпускают,
вбок — станок поворачивается. Чем сильнее давишь, тем быстрее. Оба направления
тензодатчика заняты, и оба — скорости. Пуск — левой кнопкой, бинокль — правой, а снаряд
выбирается колесом, которое на ThinkPad и есть средняя кнопка плюс та же пипка.</p>

<p>Физика здесь не нарисована. Рычаг — стержень на оси, торсион раскручивается по
закону упругости, рычаг считается с подшагами до перекладины, груз сходит по
касательной. Я подобрал геометрию так, чтобы энергия торсиона была линейна по натягу, и
стенд подтвердил, что тогда и дальность почти линейна: процент натяга — это полтора метра
в любом месте шкалы. От этого и вся игра: натяг читается как расстояние, а промах — как
поправка. Это артиллерия: выстрелил, увидел, что недолёт восемь метров, добавил пять
процентов. Мек считает дальность, но только в штиль, а ветер дует, и это видно по конусу
на катапульте, по стрелке и по флагу форта.</p>

<p>Орки из вахи — это камни, гроты и сквиги. Грот лёгкий и растопыренный, его сносит
ветром в семь раз сильнее камня, зато в полёте он рулит ушами, и пипка снова работает
скоростью: задаёт, как быстро поворачивает траектория. Сквиг взрывается. Рычаг
красный — красные быстрее летают, это знает каждый орк, — на раме жёлто-чёрные шашечки,
у ворота двое крутят, босс в рогатом шлеме машет при пуске и все орут ВАААГХ, собранное
из пилы и двух формант.</p>

<p>Форт людишек — блоки на сетке, у каждого прочность, удары копятся, а опора
пересчитывается по слоям: перемычка над выбитым блоком держится, карниз — нет, и всё,
что осталось без опоры, падает разом. 3D — на голом WebGL, без библиотек, как и всё на
сайте: плоские грани, туман в цвет горизонта, тени-кляксы, без которых не понять, на
какой высоте камень.</p>

<h3>Что пошло не так</h3>
<p>Первый же замер показал 2.3 кадра в секунду. Несколько прогонов подряд я резал кадр по частям:
без рельефа, без сцены, в половинном разрешении, без 2D поверх — и каждый раз те же 2–3
кадра. Это был не код, а программный растеризатор безголового браузера. С ANGLE поверх
настоящей видеокарты этого же ноутбука, UHD 620, вышло 58 кадров и 3 мс скрипта на кадр.
Но это значит и другое: на машине без работающей видеокарты играть нельзя совсем.</p>

<p>Идеальный бот на двух зёрнах из четырёх не взял первый форт, пять промахов из пяти, и
я сначала стал искать ошибку в игре. Ошибка была в боте: у решателя был перевёрнут знак бокового промаха, и он
с каждой итерацией уводил прицел дальше. Тот же знак я перепутал и в стенде: проверка
ушей грота ждала смещения в +x, а вправо от камеры — это −x.</p>

<p>Первый баланс был плохой, и показали это боты. Каменный блок держал 5000 Н·с, а
камень приносит в стену по нормали около 3600: прямое попадание отскакивало, как от
скалы. А бот с ошибкой 1.5% натяга не брал первый форт, потому что людишка падал только
от попадания в него самого или в блок прямо под ним. Теперь камень — 3400, сильный удар
в столб стряхивает людишек сверху, а на первом форте шесть камней вместо четырёх.
Самый дальний форт стоял на 138 м, а камень против встречного ветра 7 м/с летит на
146 — при донжоне на 8 м глубже не хватало. Предел теперь 132 м.</p>

<p>По скриншотам: камера при прицеливании стояла за перекладиной рамы, и та закрывала
форт; флюгер стоял прямо перед камерой во весь кадр. А подсказка «клик — к катапульте»
горела весь полёт, но клик ничего не делал, пока снаряд не упадёт: падение сбрасывало
флажок. Нашёл, когда в тесте ждал экран конца, а он не наступал.</p>

<p>Не проверено: звук не слышал никто. На живой пипке никто не играл, так что
экспонента, скорости поворота и натяга и чувствительность по умолчанию — догадки. Боты
не поправляются от выстрела к выстрелу, как человек, поэтому их цифры говорят о
разбросе, а не о том, насколько игра трудна. И я не знаю, читается ли форт на 120 м
живым глазом без бинокля.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>~43 мин<small>один заход, 33 мин из них — модель</small></dd></div>
  <div><dt>Токенов</dt><dd>~295k<small>контекст; 199k на выходе, $9.06</small></dd></div>
  <div><dt>Кода</dt><dd>1426 строк<small>один файл, без зависимостей, голый WebGL; плюс 48 строк стенда</small></dd></div>
  <div><dt>Проверено</dt><dd>стендом, ботами, живым вводом, скриншотами<small>на UHD 620 автора; живым человеком — нет</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Catapult", kicker:"Orks, torsion and a strain gauge",
  time:"~43 min", tokens:"~295k", model:"Opus 5.5",
  body:`<blockquote>make a new cool pipka game with physics. I want a CATAPULT! We do have a
strain gauge here that can tell direction. Third person. And make it 3D. Reference: the
orks from Warhammer, and the pipka, naturally.<cite>The brief, translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>The first question was what the pipka does in a catapult. The obvious answer is "pull
with the finger, let go, it flies", but that is force as position, and the whole site
rests on the opposite: pressure sets a rate. And a catapult happens to have something you
turn: the winch. Pull the pipka towards you and the orks crank the winch and twist the
torsion; push away and they let it off; sideways and the carriage turns. The harder you
press, the faster. Both directions of the strain gauge are used, and both are rates. The
left button looses, the right one is binoculars, and the ammo is picked with the wheel,
which on a ThinkPad is the middle button plus the same pipka.</p>

<p>The physics is not drawn. The arm is a rod on an axle, the torsion unwinds by Hooke's
law, the arm is integrated in substeps up to the crossbar, and the load leaves along the
tangent. I chose the geometry so that the torsion energy is linear in tension, and the
harness confirmed that the range then is nearly linear too: one per cent of tension is a
metre and a half anywhere on the scale. The whole game rests on that: tension reads as
distance and a miss reads as a correction. It is artillery: fire, see that it fell eight
metres short, add five per cent. The mek works out the range, but only in still air, and
the wind blows; you can see it by the windsock on the catapult, the arrow and the fort's
banner.</p>

<p>Warhammer orks mean rocks, grots and squigs. A grot is light and sprawled, the wind
drifts it seven times more than a rock, but in flight it steers with its ears, and the
pipka is again a rate: it sets how fast the flight path turns. A squig explodes. The arm
is red, because red ones go faster, as every ork knows; the frame has yellow-and-black
checks, two orks crank the winch, the boss in a horned helmet waves at the launch and
everyone yells WAAAGH, built from a sawtooth and two formants.</p>

<p>The humie fort is blocks on a grid, each with a strength; hits accumulate, and support
is recomputed layer by layer: a lintel over a knocked-out block holds, a ledge does not,
and everything left unsupported falls at once. The 3D is raw WebGL with no libraries, like
everything on the site: flat faces, fog in the horizon colour, blob shadows without which
you cannot tell how high a rock is.</p>

<h3>What went wrong</h3>
<p>The very first measurement showed 2.3 frames a second. For several runs in a row I cut
the frame apart: no terrain, no scene, half resolution, no 2D overlay, and every time the same 2–3
frames. It was not the code but the headless browser's software rasteriser. With ANGLE
on this same laptop's real GPU, a UHD 620, it is 58 frames and 3 ms of script per frame.
But that also means that on a machine without a working GPU the game cannot be played at
all.</p>

<p>On two seeds out of four the perfect bot did not clear fort 1, five misses out of five,
and I started looking for the bug in the game. It was in the bot: the solver had the sign of the lateral miss
flipped and moved the aim further away with every iteration. I got the same sign wrong in
the harness too: the check on the grot's ears expected a shift towards +x, while right of
the camera is −x.</p>

<p>The first balance was bad, and the bots showed it. A stone block held 5000 N·s, and a
rock brings about 3600 into a wall along the normal: a direct hit bounced off as if off
bedrock. And a bot with a 1.5% tension error did not clear fort 1, because a humie fell
only from a hit on themselves or on the block right under them. Now stone is 3400, a
heavy hit into a column shakes the humies off its top, and fort 1 comes with six rocks
instead of four. The farthest fort stood at 138 m, and a rock against a 7 m/s headwind
flies 146 m: with the keep 8 m deeper, that was not enough. The limit is now 132 m.</p>

<p>From the screenshots: while aiming, the camera sat behind the frame's crossbar, which
covered the fort, and the windsock stood right in front of the camera across the whole
frame. And the hint "click — back to the catapult" was lit for the whole flight, but a
click did nothing until the shot landed: landing cleared the flag. I found that when a
test waited for the end screen and it never came.</p>

<p>Unchecked: nobody has heard the sound. Nobody has played it on a real pipka, so the
expo curve, the turn and tension rates and the default sensitivity are guesses. The bots
do not correct from shot to shot as a person does, so their numbers describe scatter, not
how hard the game is. And I do not know whether a fort at 120 m reads to a live eye
without binoculars.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>~43 min<small>one sitting, 33 min of it the model</small></dd></div>
  <div><dt>Tokens</dt><dd>~295k<small>context; 199k output, $9.06</small></dd></div>
  <div><dt>Code</dt><dd>1426 lines<small>one file, no dependencies, raw WebGL; plus 48 lines of harness</small></dd></div>
  <div><dt>Verified</dt><dd>by the harness, bots, real input, screenshots<small>on the author's UHD 620; by a live person — no</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`}
};
