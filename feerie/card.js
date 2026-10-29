/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["feerie"]={
 order:7, play:"feerie/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <rect width="300" height="190" fill="#05030a"/>
    <g fill="none" stroke-width="2">
      <circle cx="158" cy="94" r="90" stroke="#ff5fd2" opacity=".45"/>
      <circle cx="162" cy="92" r="64" stroke="#b48cff" opacity=".6"/>
      <circle cx="167" cy="89" r="43" stroke="#7fd8ff" opacity=".7"/>
      <circle cx="170" cy="87" r="28" stroke="#58d68d" opacity=".8"/>
      <circle cx="172" cy="86" r="17" stroke="#f0b429"/>
      <circle cx="174" cy="85" r="9" stroke="#ff5fd2"/>
    </g>
    <path d="M162 92 L100.2 97.4 A62 62 0 1 1 126.4 142.8 Z" fill="#ff5fd2" fill-opacity=".3" stroke="#ffb0e8" stroke-width="2"/>
    <polygon points="174,77 176.5,82 182,82 178,85.5 180,91 174,88 168,91 170,85.5 166,82 171.5,82" fill="#f0b429"/>
    <g>
      <circle cx="104" cy="137" r="4" fill="#7fd8ff"/><circle cx="114" cy="129" r="4.5" fill="#58d68d"/>
      <circle cx="124" cy="120" r="5" fill="#f0b429"/><circle cx="132" cy="111" r="5.5" fill="#ff5fd2"/>
    </g>
    <circle cx="90" cy="150" r="13" fill="#e4322b" opacity=".35"/>
    <circle cx="90" cy="150" r="7" fill="#e4322b"/>
    <circle cx="90" cy="150" r="3" fill="#fff"/>
  `},
 ru:{title:"Пипка-Феерия", kicker:"Туннель, который снится сам себе",
  time:"~23 мин", tokens:"~185k", model:"Opus 5.5",
  body:`<blockquote>Давай новую крутую пипка-игру. Удиви меня. Нужна фиерия.
Психоделика.<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>Заказ был без жанра, поэтому я начал с того, что пипка умеет лучше мыши: держать
скорость и возвращаться в ноль. Значит, нужно что-то, что ведут, а не наводят. Психоделика
в браузере — это прежде всего обратная связь кадра, как в Milkdrop из старого Winamp:
каждый кадр рисуется поверх прошлого, чуть увеличенного и повёрнутого, и любая точка
расплывается спиралью. А раз картинка сама течёт из центра к краям, ей нужен полёт вглубь.
Так вышел туннель: искра летит по его оси, пипка ведёт её поперёк сечения, навстречу
выплывают стены-мандалы с прорезями.</p>

<p>Пипка и здесь задаёт скорость, а не положение: нажим — скорость искры, отпустил —
остановится (после второй переделки — плавно, с инерцией). Чтобы было видно, куда ты попадёшь, на ближайшей стене горит кольцо в той точке,
где искра её встретит: красное — удар, белое — мимо. Цвет кольца считается по позе стены
в момент встречи, а не по тому, как она повёрнута сейчас. Вращающаяся стена с белым
кольцом учит главному: прорезь придёт к тебе сама, не дёргайся. Поэтому стены и заданы
в позе прихода, а летят повёрнутыми на k·z: при любой скорости и любом вдохе прорезь
окажется ровно там, где её поставил генератор.</p>

<p>Генератор ведёт безопасный путь. Каждая следующая прорезь лежит не дальше 55% того, что
искра пролетит на полном нажиме до этой стены, и вокруг пути в прорези есть зазор втрое
больше искры. По пути нанизаны бусины, и это ноты: каждая несёт ступень лада, мелодия —
случайное блуждание по ступеням. Собираешь цепочку — играешь фразу, пропустил — в ней
пауза. У каждой глубины свой лад, аккорды строятся внутри лада, так что любая собранная
фраза ложится на гармонию, а на «Четвёртом измерении» лад целотонный и звучат одни
увеличенные трезвучия.</p>

<p>Жизнь здесь — сияние. Оно утекает само, его кормят бусины и пройденные стены, удар его
отнимает. И сияние видно и слышно: ниже 60 мир выцветает к серому, а срез фильтра музыки
идёт за сиянием на всём ходу, так что на излёте играешь как из-под воды. На нуле наступает
рассвет. Левая кнопка под пробелом — вдох: мир замедляется вдвое, искра нет, и сияние
тратится. Это для пипки: когда стены идут через 0.3 с, иногда нужно выиграть время, а не
точность.</p>

<p>Цвет и вращение во весь экран подходят не всем, поэтому на стартовом экране
предупреждение, а внизу кнопка «Мягко»: шлейфы короче, закрутки почти нет, цвета не
выцветают. Если система просит меньше движения, «Мягко» включено сразу.</p>

<h3>Что пошло не так</h3>
<p>Первая сборка рисовала кадр 29 мс на программной растеризации. Замер по частям показал,
что 12 из них уходят на одну строчку: растянуть маленький буфер на экран через
<code>drawImage</code> со сглаживанием. Теперь буфер сам стоит на странице и его растягивает
CSS, а искра и метки рисуются в отдельный прозрачный холст поверх. Вышло 11.5 мс, но
безголовый Chromium без видеокарты всё равно крутит заставку на 29–35 кадрах в секунду.
Сколько будет на живом ноутбуке, я не знаю.</p>

<p>Первый баланс был негодный, и показали это боты, а не глаза. При 14 стенах на глубину
идеальный бот проходил все девять названий за 70 секунд, их не успеть прочесть. Бот,
который вообще не двигается, гас за 4 секунды, на третьей стене. Теперь глубина — 30 стен,
удар на первой стоит 15 вместо 24, старт с 80 вместо 70, неподвижный бот живёт 17 секунд.
Розы выпадали в 2% стен, потому что толстые лепестки не оставляли зазора. Стали тоньше,
теперь 5%.</p>

<p>Мелочи, которые поймал прогон: <code>requestPointerLock</code> в новом Chromium
возвращает промис, и отказ всплывал необработанной ошибкой. После рассвета шапка
обнулялась, потому что за оверлеем летит автопилот со своим счётом. А подсказка под игрой
обещала, что в «Мягко» музыка всё равно глохнет вместе с сиянием, хотя код держал фильтр
открытым. Нашёл, когда сверял README с кодом. Поправил код, а не подсказку.</p>

<p>Потом нырнул живой человек, и отзыв уложился в две фразы: «Слишком быстро и
глазовыжигательно» и «ну и нихрена дырки не видно». Ни один бот этого поймать не мог:
бот знает путь заранее, ему дырку видеть не нужно. А скриншоты я смотрел глазами
автора, который знает, где прорезь. Скорость я снизил вдвое: с 7 до 4.5 м/с на старте, с
14 до 9 на потолке, стены теперь раз в 1.6 с, а не раз в секунду. Насыщенность
ограничил 70%, обратную связь ослабил, закрутку и дрейф цвета замедлил. Инверсию
всего поля при ударе убрал совсем, её я, кстати, так ни разу и не поймал на скриншоте.
Дырку не было видно потому, что стены рисовались в буфер с обратной связью и их шлейфы
ложились копиями прямо на прорезь. Теперь стены и бусины рисуются в чёткий слой поверх.
Твёрдое — это шторка средней яркости, прорезь — окно в туннель, и белым обведены только
края прорези. Первая попытка сделала шторку почти чёрной, и на тёмном туннеле она слилась
с дыркой. Это я увидел сам, на серии кадров, и переделал до того, как отдать.</p>

<p>Второй заход того же человека: счёт 2650, глубина 2, 20 нот, лучшая цепь 9, и
«в точки я попасть не могу, слишком маленькие + нужна какая-то инерция может?», а следом
«ещё чутка медленней надо и траектория бусин плохо читается». Бусина ловилась в радиусе
0.11, а её яркое ядро было 0.03 — я нарисовал цель вчетверо меньше, чем она была на самом
деле. Теперь радиус 0.17, бусина вдвое крупнее, с белым ядром на тёмной подложке, и
ближайшие восемь бусин связаны нитью. Искра получила инерцию 0.25 с: пипка по-прежнему
задаёт скорость, но искра набирает и сбрасывает её плавно. Генератор теперь вычитает эти
0.25 с из времени на переход, а бот рассчитывает команду с учётом запаздывания, и
идеальный бот снова проходит без ударов. Скорость снизил ещё раз: старт 3.8 м/с, потолок
7.5.</p>

<p>Третий заход, после этих правок: счёт 12 700 вместо 2650, глубина 4 вместо 2,
144 ноты вместо 20, лучшая цепь 13. Без комментариев, но это первый замер на живой пипке,
и он вчетверо лучше прошлого.</p>

<p>И отзыв к нему: «звук — пойдёт. Скорость — быстровато, в какой-то момент была мысль —
я что, пилот истребителя? Ещё пару раз я терял точку, путался в её положении. Это сложная
игра», и что сияние гасло от ударов о стены. Звук, который я так и не услышал, впервые
услышал человек, и звук прошёл. Скорость на четвёртой глубине была 5.2 м/с и росла дальше до
7.5; теперь разгон пологий — 4.4 на четвёртой, потолок 5.5, — и сложность с глубиной
растёт формой и вращением стен, а не скоростью. Удар подешевел с 15–26 до 12–20. А точку
терять было из-за меня: хвост искры я рисовал в буфер с обратной связью, и та размножала
его в спираль красных точек — несколько ложных искр рядом с настоящей. Хвост убран, а
сама искра теперь на тёмной подложке в белом кольце, такого знака на поле больше нет.</p>

<p>Пятый заход, после этих правок: счёт 28 520, глубина 6, 352 ноты, лучшая цепь 28 —
вдвое больше прошлого по каждой цифре, и впервые за пятой глубиной, где появляется
шахматка.</p>

<p>Не проверено: звука я сам так и не слышал, а глубже шестой живой человек ещё не нырял,
так что выход на потолок скорости и лады с седьмой глубины, включая целотонное
«Четвёртое измерение», проверены только ботом.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>~23 мин<small>первый ход, 16 мин из них — модель; четыре переделки по отзывам не замерены</small></dd></div>
  <div><dt>Токенов</dt><dd>~185k<small>первый ход: контекст; 97k на выходе, $4.29; переделки не замерены</small></dd></div>
  <div><dt>Кода</dt><dd>1003 строки<small>один файл, без зависимостей</small></dd></div>
  <div><dt>Проверено</dt><dd>ботами, замером, скриншотами<small>и живым человеком на пипке, до шестой глубины</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Féerie", kicker:"A tunnel that dreams itself",
  time:"~23 min", tokens:"~185k", model:"Opus 5.5",
  body:`<blockquote>Let's have a new cool pipka game. Surprise me. I want a féerie.
Psychedelia.<cite>The brief, translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>The brief named no genre, so I started from what the pipka does better than a mouse:
hold a rate and come back to zero. So it had to be something you steer, not aim. In a
browser, psychedelia is above all frame feedback, as in Milkdrop from old Winamp: each
frame is drawn over the previous one, slightly enlarged and rotated, and every point smears
into a spiral. A picture that flows from the centre to the edges by itself wants a flight
inwards. That gave the tunnel: a spark flies along its axis, the pipka steers it across
the cross-section, and mandala walls with slits float towards it.</p>

<p>Here too the pipka sets velocity, not position: pressure is the spark's speed, let go
and it stops (since the second rework, smoothly, with inertia). To show where you will hit, the nearest wall carries a ring at the point
where the spark will meet it: red is a hit, white is a pass. The colour comes from the
wall's pose at the moment of meeting, not from how it is turned now. A rotating wall with a
white ring teaches the main thing: the slit will come to you, don't twitch. That is why
walls are defined in their arrival pose and fly rotated by k·z: whatever the speed or
breathing, the slit ends up exactly where the generator put it.</p>

<p>The generator walks a safe path. Each slit lies no further than 55% of what the spark
can cover at full deflection before that wall, and the slit leaves a margin around the
path three times the spark's size. Beads are strung along the path, and they are notes:
each carries a degree of the mode, and the tune is a random walk over the degrees. Collect
a run and you play a phrase; miss one and the phrase has a rest. Every depth has its own
mode and the chords are built inside it, so whatever you collect fits the harmony. In "The
Fourth Dimension" the mode is whole-tone and every chord is an augmented triad.</p>

<p>Life here is glow. It leaks by itself, beads and cleared walls feed it, a hit takes a
chunk. And you can see and hear it: below 60 the world fades towards grey, and the music's
filter cutoff follows the glow all the way down, so near the end you play as if under
water. At zero, dawn breaks. The left button under the space bar is breath: the world
slows to half, the spark does not, and glow drains. That is for the pipka: when walls come
every 0.3 s, sometimes what you need is time, not precision.</p>

<p>Colour and rotation across the whole screen do not suit everyone, so the start screen
carries a warning and the bottom bar a Calm button: shorter trails, almost no swirl, no
fading. If the system asks for reduced motion, Calm starts on.</p>

<h3>What went wrong</h3>
<p>The first build took 29 ms a frame under software rasterisation. Timing it piece by
piece showed that 12 of those went on one line: stretching the small buffer onto the screen
with a smoothed <code>drawImage</code>. Now the buffer sits on the page and CSS stretches
it, while the spark and markers go into a separate transparent canvas on top. That is
11.5 ms, but headless Chromium with no GPU still runs the attract screen at 29–35 frames a
second. What a real laptop does, I do not know.</p>

<p>The first balance was unusable, and the bots showed it, not my eyes. With 14 walls per
depth the perfect bot went through all nine names in 70 seconds, too fast to read them. A
bot that does not move at all went out in 4 seconds, on the third wall. Now a depth is 30
walls, a hit at depth one costs 15 instead of 24, glow starts at 80 instead of 70, and the
motionless bot lasts 17 seconds. Roses came up in 2% of walls because fat petals left no
margin. They are thinner now, and it is 5%.</p>

<p>Small things the runs caught: in current Chromium <code>requestPointerLock</code> returns
a promise, and a refusal surfaced as an unhandled error. After dawn the header reset to
zero, because the autopilot behind the overlay keeps its own score. And the tip under the
game promised that in Calm the music still dulls with the glow, while the code held the
filter open. I found that while checking the README against the code. I fixed the code, not
the tip.</p>

<p>Then a real person dived, and the review took two lines: "Too fast and eye-searing" and
"and you can't see the bloody hole at all". No bot could have caught that: a bot knows the
path in advance and never needs to see the hole. And I looked at the screenshots as the
author, knowing where the slit was. I halved the speed: 4.5 m/s at the start instead of 7,
9 at the ceiling instead of 14, a wall every 1.6 s instead of every second. I capped
saturation at 70%, weakened the feedback, slowed the swirl and the colour drift. The
whole-field inversion on a hit is gone; I never once caught it in a screenshot anyway.
The hole was invisible because walls were drawn into the feedback buffer and their trails
laid copies right over the slit. Now walls and beads go into a sharp layer on top. The solid
part is a mid-tone curtain, the slit is a window into the tunnel, and only the slit's edges
are outlined in white. My first attempt made the curtain nearly black, and on the dark
tunnel it merged with the hole. That one I saw myself, in a series of frames, and redid it
before handing it back.</p>

<p>The same person's second dive: score 2650, depth 2, 20 notes, best chain 9, and "I
can't hit the dots, they're too small + maybe it needs some inertia?", followed by "a
little slower still, and the bead path reads badly". A bead was caught within 0.11, while
its bright core was 0.03: I drew the target four times smaller than it really was. Now the
radius is 0.17, the bead is drawn twice as big with a white core on a dark backing, and the
next eight beads are joined by a thread. The spark got 0.25 s of inertia: the pipka still
sets the velocity, but the spark gains and sheds it smoothly. The generator now subtracts
those 0.25 s from the time allowed for each move, the bot plans its command for the lag,
and the perfect bot again goes through without a hit. Speed came down once more: 3.8 m/s
at the start, 7.5 at the ceiling.</p>

<p>The third dive, after those changes: score 12,700 instead of 2650, depth 4 instead of 2,
144 notes instead of 20, best chain 13. No comment came with it, but it is the first
measurement on a live pipka, and it is four times better than the last.</p>

<p>And the review that came with it: "sound — it'll do. Speed — a bit fast, at one point I
thought, am I a fighter pilot? A couple of times I lost the dot, got confused about where it
was. It's a hard game", and that the glow went out from hitting walls. The sound I never heard
was heard by a person for the first time, and passed. Speed at depth four was 5.2 m/s and
still climbing to 7.5; now the climb is gentle — 4.4 at depth four, a ceiling of 5.5 — and
difficulty grows with the shapes and rotation of the walls rather than speed. A hit got
cheaper, 12–20 instead of 15–26. And losing the dot was my doing: I drew the spark's trail
into the feedback buffer, which multiplied it into a spiral of red dots — several false
sparks next to the real one. The trail is gone, and the spark now sits on a dark backing
inside a white ring, a mark used nowhere else on the field.</p>

<p>The fifth dive, after those changes: score 28,520, depth 6, 352 notes, best chain 28 —
double the previous run on every count, and the first time past depth five, where the
checkerboard appears.</p>

<p>Unchecked: I still have not heard the sound myself, and no person has
dived deeper than depth six yet, so reaching top speed and the modes from depth seven down,
whole-tone "The Fourth Dimension" included, have been checked by the bot alone.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>~23 min<small>first turn, 16 min of it the model; four reworks after feedback not measured</small></dd></div>
  <div><dt>Tokens</dt><dd>~185k<small>first turn: context; 97k output, $4.29; the reworks not measured</small></dd></div>
  <div><dt>Code</dt><dd>1003 lines<small>one file, no dependencies</small></dd></div>
  <div><dt>Verified</dt><dd>by bots, timing, screenshots<small>and by a person on a pipka, down to depth six</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`}
};
