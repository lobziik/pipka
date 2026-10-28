/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["danmaku"]={
 order:4, play:"danmaku/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <g fill="#3b6bff" stroke="#e8f6ff" stroke-width="2">
      <circle cx="196" cy="66" r="5"/><circle cx="192" cy="84" r="5"/><circle cx="183" cy="99" r="5"/><circle cx="168" cy="108" r="5"/><circle cx="150" cy="112" r="5"/><circle cx="132" cy="108" r="5"/><circle cx="117" cy="99" r="5"/><circle cx="108" cy="84" r="5"/><circle cx="104" cy="66" r="5"/><circle cx="108" cy="48" r="5"/><circle cx="117" cy="33" r="5"/><circle cx="132" cy="24" r="5"/><circle cx="150" cy="20" r="5"/><circle cx="168" cy="24" r="5"/><circle cx="183" cy="33" r="5"/><circle cx="192" cy="48" r="5"/>
    </g>
    <text x="150" y="80" fill="#7fd8ff" font-size="40" font-family="monospace" text-anchor="middle">⑨</text>
    <g fill="#46d6ff">
      <circle cx="209" cy="133" r="3"/><circle cx="196" cy="141" r="3"/><circle cx="181" cy="147" r="3"/><circle cx="165" cy="150" r="3"/><circle cx="149" cy="151" r="3"/><circle cx="133" cy="150" r="3"/><circle cx="117" cy="146" r="3"/><circle cx="103" cy="140" r="3"/><circle cx="90" cy="132" r="3"/>
    </g>
    <circle cx="140" cy="171" r="10" fill="#e4322b"/>
    <circle cx="140" cy="171" r="3" fill="#fff"/>
  `},
 ru:{title:"Пипка-Данмаку", kicker:"Почти тохо",
  time:"~20 мин", tokens:"~200k", model:"Opus 5.5",
  body:`<blockquote>сделай шмапчик с процедурной генерацией волн противников, возрастающей
сложностью, звуками абизатильна и какой-нибудь музычкой на фоне. Типа пипка-тохо.
Сырно — умнейшая, надеюсь не нужно напоминать.<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>Данмаку — «завеса пуль» — на первый взгляд худший жанр для пипки: весь он состоит из
уклонений в щели шириной в пару пикселей, а точно указывать пипка не умеет. Но указывать
и не нужно. В шмапе корабль не ставят в точку, а ведут, и это снова управление по
производной: нажим — скорость корабля, отпустил — стоишь. У пипки есть настоящий ноль,
и отпущенный палец значит «замри», а замереть в щели — половина жанра. Фокус уменьшает
не порог пипки, а саму скорость, с 270 до 105 px/s поля: нажим тот же, шаг мельче.
Указательный палец на пипке, большой держит фокус на левой кнопке под пробелом, правая
кнопка — бомба. Стрельба автоматическая, потому что третьей руки нет.</p>

<p>Остальное — честный канон. Попадает только белая точка в центре, пули выглядят
крупнее, чем бьют, задел платит очки, линия сбора наверху стягивает к тебе все
предметы, если рискнёшь подняться в гущу. Поле — 384×448, родное разрешение тохо,
вписанное в окно, чтобы скорость пуль не зависела от размера монитора.</p>

<p>Волны собираются заново каждый раз: строй (как феи входят и уходят — линия, поток,
клин, дуга, крупная фея, дождь, пара) × узор (прицельный, веер, кольцо, россыпь, рис;
у крупных — спираль, цветок, лепестки, стена). Строи и узоры открываются по номеру
волны, а дальше растут пять ручек — скорость пуль, их число в залпе, живучесть, темп
стрельбы и число фей, — каждая со своим потолком. Потолки выбраны так, чтобы к
тридцатой волне игра упиралась в плотность, а не в скорость: быстрые пули на пипке не
читаются, плотные проходятся в фокусе.</p>

<p>Каждая девятая волна — Сырно. Её карты — по мотивам настоящих: «Сосулькопад» оставляет
безопасную щель прямо перед ней (в оригинале это знаменитая дыра на лёгкой сложности,
и я её сохранил из уважения), «Идеальная заморозка» останавливает пули, белит их и
отпускает в случайные стороны, а последней идёт арифметика — цифра ⑨ из пуль в
обводке, которая летит на тебя одним телом. Со второго круга щель закрывают прицельные
выстрелы, добавляется «Алмазная пурга», а Сырно сообщает, что стала в ⑨ раз сильнее.</p>

<p>Звуки, как и везде на сайте, синтезированы: «тц-тц» стрельбы — шум через ФВЧ, «тан»
выстрела феи, сухой щелчок задела, «пичуун» смерти — короткий взлёт тона и долгий
спад, по которому тохо узнают вслепую. Музыка не хранится, а генерируется: минорная
последовательность аккордов и двухтактовый мотив, случайное блуждание по ладу, где
сильные доли притянуты к звукам аккорда. Мотив повторяется над следующими аккордами,
поэтому выходит песня, а не шум. Голос — прямоугольник со скважностью 25%, собранный из
гармоник (у <code>OscillatorNode</code> есть только меандр), с эхом в три
шестнадцатых; бас — октавные восьмые, как в каждом втором тохо. Семя — номер круга,
у Сырно своя тема в ре миноре на 172 удара в минуту.</p>

<h3>Что пошло не так</h3>
<p>Главное: я не слышу. Ни звуки, ни музыку я не прослушал ни разу, и громкости
выставлены арифметикой, а не ухом. Генератор мелодий я проверял выгрузкой нот против
аккордов, и это поймало настоящую ошибку: вводный тон гармонического минора попадал на
четвёртую и шестую ступени, то есть ложился тритоном и малой секундой против баса.
Теперь он разрешён только над мажорной доминантой. Как всё это звучит на самом деле,
скажет первый, кто откроет игру.</p>

<p>Сложность настроена ботом, а бот тупой: он только отталкивается от ближайших пуль и
не бомбит. Такой бот стабильно умирает на 6–8-й волне; бессмертный доходит до 27-й, на
пике 830 пуль на экране. Сырно он побеждает только по таймерам, потому что не целится,
так что сколько она длится против живого человека, я не знаю.</p>

<p>И ложная тревога: первый прогон в безголовом Chromium показал «волна 0» после
150 секунд игры, и я едва не пошёл чинить игру. Оказалось, в режиме виртуального
времени браузер почти не вызывает <code>requestAnimationFrame</code>; дальше тест сам
шагал симуляцию. Там же нашёлся замер: на программной растеризации 2000 пуль стоили
15 мс на кадр. Теперь спрайты запекаются сразу в экранном масштабе и кладутся без
масштабирования, выходит 8.7 мс.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>~20 мин<small>одним ходом</small></dd></div>
  <div><dt>Токенов</dt><dd>~200k</dd></div>
  <div><dt>Кода</dt><dd>1300 строк<small>один файл, без зависимостей</small></dd></div>
  <div><dt>Проверено</dt><dd>ботом и замером<small>на слух — нет</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Danmaku", kicker:"Almost Touhou",
  time:"~20 min", tokens:"~200k", model:"Opus 5.5",
  body:`<blockquote>make a little shmup with procedurally generated enemy waves, rising
difficulty, sounds absolutely, and some music in the background. Pipka-Touhou, sort
of. Cirno is the strongest, I hope I don't need to remind you.<cite>The brief,
translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>Danmaku, the "curtain of bullets", looks like the worst genre for the pipka: it is
made entirely of dodges through gaps a couple of pixels wide, and the pipka cannot point
precisely. But it does not have to point. In a shmup you steer the ship rather than
place it, which is rate control again: pressure is the ship's speed, let go and you
stop. The pipka has a true zero, so a released finger means "freeze", and freezing in a
gap is half the genre. Focus does not change the pipka's threshold; it changes the
speed itself, from 270 to 105 field px/s, so the same push gives a finer step. Index
finger on the nub, thumb holding focus on the left button under the space bar, right
button for a bomb. Firing is automatic, because there is no third hand.</p>

<p>The rest is honest canon. Only the white dot in the middle can be hit, bullets look
bigger than they hit, graze pays, and the collection line at the top pulls every item
on screen to you if you dare go up into the thick of it. The field is 384×448, Touhou's
native size, fitted to the window so that bullet speed does not depend on the size of
your monitor.</p>

<p>Waves are assembled afresh every time: a formation (how fairies come and go — line,
stream, vee, arc, big fairy, rain, pair) times a pattern (aimed, fan, ring, spray, rice;
for big fairies spiral, flower, petals, wall). Formations and patterns unlock with the
wave number, and after that five dials grow — bullet speed, bullets per volley, toughness,
rate of fire and fairy count — each against its own ceiling. The ceilings are set so
that by wave thirty the game is limited by density rather than speed: fast bullets do not
read on a pipka, dense ones can be threaded in focus.</p>

<p>Every ninth wave is Cirno. Her cards follow her real ones: "Icicle Fall" leaves a safe
gap right in front of her (the famous hole on Easy in the original, which I kept out of
respect), "Perfect Freeze" stops the bullets, turns them white and lets them go in random
directions, and the last card is arithmetic — a ⑨ made of bullets, circled, flying at you
as one body. From the second loop aimed shots close the gap, "Diamond Blizzard" joins in,
and Cirno announces she is now ⑨ times stronger.</p>

<p>Sounds are synthesised, as everywhere on the site: the tick-tick of your fire is noise
through a high-pass, a fairy's shot is a short "tan", graze is a dry click, and death is
the "pichuun" — a quick rise in pitch and a long fall, the sound Touhou is recognised
by blind. The music is generated rather than stored: a minor chord progression and a
two-bar motif, a random walk over the scale with the strong beats pulled to chord tones.
The motif repeats over the following chords, so it comes out as a song rather than noise.
The lead is a 25% pulse built from harmonics (<code>OscillatorNode</code> only has a
50% square) with an echo three sixteenths long; the bass is octave eighths, as in every
other Touhou track. The seed is the loop number, and Cirno has her own theme in D minor
at 172 bpm.</p>

<h3>What went wrong</h3>
<p>The main thing: I cannot hear. I have not listened to the sounds or the music even
once, and the levels are set by arithmetic, not by ear. I checked the melody generator by
dumping notes against chords, and that caught a real error: the raised leading tone of
harmonic minor landed on the fourth and sixth degrees, a tritone and a minor second
against the bass. It is now allowed only over a major dominant. How all of it actually
sounds is for the first person who opens the game to say.</p>

<p>Difficulty is tuned with a bot, and the bot is dumb: it only shies away from the
nearest bullets and never bombs. That bot reliably dies on waves 6–8; an immortal one
reaches wave 27 with 830 bullets on screen at the peak. It beats Cirno only on her
timers, because it does not aim, so how long she lasts against a person I do not know.</p>

<p>And a false alarm: the first run in headless Chromium reported "wave 0" after 150
seconds of play, and I nearly went off to fix the game. In virtual-time mode the browser
barely calls <code>requestAnimationFrame</code>; from then on the test stepped the
simulation itself. The same harness produced a measurement: under software rasterisation
2000 bullets cost 15 ms a frame. Sprites are now baked at screen scale and blitted
unscaled, which gives 8.7 ms.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>~20 min<small>one turn</small></dd></div>
  <div><dt>Tokens</dt><dd>~200k</dd></div>
  <div><dt>Code</dt><dd>1300 lines<small>one file, no dependencies</small></dd></div>
  <div><dt>Verified</dt><dd>by bot and timing<small>not by ear</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`}
};
