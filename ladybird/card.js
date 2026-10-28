/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["ladybird"]={
 order:5, play:"ladybird/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <path d="M0 120c50-18 100-14 150-4s100 8 150-6v80H0z" fill="#3f8f3a"/>
    <path d="M238 118v-42" stroke="#58a64e" stroke-width="5"/>
    <g fill="#ff6fa8"><circle cx="238" cy="60" r="12"/><circle cx="252" cy="72" r="12"/><circle cx="246" cy="88" r="12"/><circle cx="230" cy="88" r="12"/><circle cx="224" cy="72" r="12"/></g>
    <circle cx="238" cy="75" r="9" fill="#ffd84a"/>
    <path d="M66 140v-30" stroke="#58a64e" stroke-width="5"/>
    <path d="M66 86c12 12 10 22 0 28c-10-6-12-16 0-28z" fill="#5cc04e"/>
    <path d="M66 90c5 6 4 10 0 13c-4-3-5-7 0-13z" fill="#b77cff"/>
    <ellipse cx="54" cy="44" rx="15" ry="19" fill="#5fb8ff"/>
    <path d="M54 63c4 10-4 16 2 28" stroke="#8b96a1" stroke-width="1.5" fill="none"/>
    <g transform="translate(150 86)">
      <ellipse cx="-20" cy="-26" rx="11" ry="22" fill="#e8f4ff" opacity=".55" transform="rotate(-35 -20 -26)"/>
      <ellipse cx="20" cy="-26" rx="11" ry="22" fill="#e8f4ff" opacity=".55" transform="rotate(35 20 -26)"/>
      <path d="M-7-32q-6-12-14-13M7-32q6-12 14-13" stroke="#1d1d22" stroke-width="2.5" fill="none"/>
      <circle cy="-24" r="15" fill="#1d1d22"/>
      <circle r="25" fill="#e4322b"/>
      <path d="M0-24V25" stroke="#1d1d22" stroke-width="2.5"/>
      <g fill="#1d1d22"><circle cx="-12" r="5"/><circle cx="12" r="5"/><circle cx="-8" cy="14" r="4"/><circle cx="8" cy="14" r="4"/><circle cx="-17" cy="10" r="3"/><circle cx="17" cy="10" r="3"/></g>
      <g fill="#fff"><circle cx="-6" cy="-29" r="4.5"/><circle cx="6" cy="-29" r="4.5"/></g>
      <g fill="#1d1d22"><circle cx="-5" cy="-29" r="2.2"/><circle cx="7" cy="-29" r="2.2"/></g>
    </g>
    <g fill="#f0b429" font-family="monospace" font-size="18"><text x="190" y="44">♪</text><text x="206" y="28">♫</text></g>
  `},
 ru:{title:"Пипка-Коровка", kicker:"Для тех, кому три",
  time:"~40 мин", tokens:"~150k", model:"Opus 5.5",
  body:`<blockquote>Сделай новую крутую пипка-игру. Для трехлетней девочки.<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>Трёхлетка не читает, не знает, что такое проигрыш, и не дозирует нажим: палец давит
резко и сразу до упора. Зато пипка здесь добрее мыши. Курсора, который можно потерять
за краем экрана, нет, а отпущенный палец значит «стой». Поэтому управление то же, что
везде на сайте, — нажим задаёт скорость, — только мягче: фильтр вдвое длиннее, чем в
данмаку, порог полного отклонения выше, а предельная скорость такая, чтобы поле
пересекалось за три с половиной секунды и было когда отпустить.</p>

<p>Героиню подсказала сама пипка: она красная и круглая, то есть божья коровка. Летит,
пока давишь, а когда отпустишь, садится и складывает крылья, так что ноль пипки виден
без всякого индикатора. Бутоны распускаются от касания, у каждого цветка рожица и нота.
Ноты взяты из пентатоники и разложены слева направо по возрастанию: в пентатонике нет
полутонов, поэтому в каком порядке цветы ни трогай, фальши не будет, а пролёт вдоль ряда
играет гамму. Когда открыты все — радуга, фанфара и бабочка, которая остаётся насовсем.
Ночью вместо бутонов спят звёзды, и луна просыпается, когда зажжена последняя.</p>

<p>Ребёнок обязательно будет бить ладошкой по клавиатуре, и я не стал с этим бороться,
а сделал из этого игру. Каждая клавиша выпускает воздушный шарик над своим местом на
клавиатуре, и одна и та же клавиша всегда звучит одной нотой; шарик можно догнать и
лопнуть. Чтобы удары по клавишам не закрыли вкладку, игра уходит на весь экран и
забирает клавиатуру через Keyboard Lock: в Chromium короткий Esc — тоже шарик, выход —
только долгим нажатием. Кнопки под пробелом смешат коровку и заставляют цветы петь.</p>

<p>Помощь явная. Закрытый бутон тянет коровку к себе, но слабее, чем она летит сама,
поэтому пролететь мимо можно всегда, а остановиться рядом — значит долететь. Если пипку
не трогают шесть секунд, ближайший бутон машет и звенит. Текста на поле нет ни одного,
громкость ниже, чем в остальных играх: уши ближе к динамику.</p>

<h3>Что пошло не так</h3>
<p>Главное: ни одного трёхлетнего ребёнка я не видел. «Ребёнком» в проверке был бот,
который давит в случайную сторону по 0.2–1 секунды и в трети случаев отпускает. Он
собирал сад за 40–270 секунд, и весь длинный хвост приходился на последний бутон: до
него случайно не долетишь. Теперь последние два тянут в полтора раза дальше, и
выходит 25–124 секунды, медиана около минуты. Бот, который летит прямо к цели,
собирает сад за 10–12 секунд вместе с праздником. Сколько это займёт у живой девочки и
будет ли ей интересно, бот не скажет.</p>

<p>Второе нашлось, когда я перестал вызывать функции игры напрямую и послал в
безголовый Chromium настоящие клик и нажатия. Сразу после «Играть» игра вставала на
паузу: при переходе на весь экран браузер отпускает захват курсора, а игра принимала это
за выход. Теперь паузу ставит только потеря захвата, который был и прожил дольше
перехода. Там же проверилось, что <code>F5</code> и <code>Tab</code> дают шарики, а
страница остаётся на месте.</p>

<p>Третье — колыбельная. Первый генератор на каждой сильной доле притягивал мелодию к
ближайшему звуку аккорда, и она залипла на одной ноте: до, до, до. Выгрузка нот против
аккордов это показала, теперь ближайший звук не может повторить предыдущий. И как и в
данмаку: я не слышу. Ни колокольчиков, ни музыки я не слушал.</p>

<p>И то, что уехало сломанным, — увидел первый же живой человек. Курсор не
захватывался и ездил по всему экрану: в Chromium <code>requestFullscreen</code>
расходует жест пользователя, а захват курсора я запрашивал после него, и браузеру
уже не на что было его списать. Безголовый прогон этого не показал — там захват
давался и так. Теперь сначала захват, потом полный экран, а слетевший захват
возвращает любой клик или клавиша. Второе — пятна коровки: несколько кругов одним
путём canvas соединяет отрезками, и заливка рисовала клинья между пятнами. Снимки
я смотрел, но целиком, а коровка на них размером с ноготь; крупный план это показал
сразу. Коровку я перерисовал: короткие лапки, объёмный панцирь, семь точек, из
которых передняя при взлёте расходится надвое.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>~40 мин<small>одним ходом</small></dd></div>
  <div><dt>Токенов</dt><dd>~150k</dd></div>
  <div><dt>Кода</dt><dd>1000 строк<small>один файл, без зависимостей</small></dd></div>
  <div><dt>Проверено</dt><dd>ботом и вводом<small>ребёнком — нет</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Ladybird", kicker:"For three-year-olds",
  time:"~40 min", tokens:"~150k", model:"Opus 5.5",
  body:`<blockquote>Make a cool new pipka game. For a three-year-old girl.<cite>The brief,
translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>A three-year-old cannot read, does not know what losing is, and does not meter
pressure: the finger pushes hard and all the way at once. But here the pipka is kinder
than a mouse. There is no cursor to lose off the edge of the screen, and a released
finger means "stop". So the control is the same as everywhere on the site, pressure
sets the speed, only softer: the filter is twice as long as the danmaku's, the
full-deflection threshold is higher, and top speed crosses the field in three and a half
seconds, which leaves time to let go.</p>

<p>The pipka itself suggested the heroine: it is red and round, which makes it a
ladybird. She flies while you push, and when you let go she lands and folds her wings,
so the pipka's zero is visible without any gauge. Buds bloom at a touch, and every
flower has a face and a note. The notes come from the pentatonic scale and rise from
left to right: the pentatonic has no semitones, so no order of touching can sound
wrong, and a sweep along the row plays a scale. When all are open there is a rainbow, a
fanfare and a butterfly that stays for good. At night the buds are sleeping stars, and
the moon wakes when the last one is lit.</p>

<p>A child will slap the keyboard, so I did not fight it and made it part of the game.
Every key launches a balloon above its place on the keyboard, the same key always
sounds the same note, and a balloon can be chased and popped. So that slapping does not
close the tab, the game goes full screen and takes the keyboard through Keyboard Lock:
in Chromium a short Esc is a balloon too, and only holding it leaves. The buttons under
the space bar make the ladybird laugh and the flowers sing.</p>

<p>The help is out in the open. A closed bud pulls the ladybird towards it, but more
weakly than she flies herself, so she can always fly past, and stopping nearby means
arriving. If the pipka is left alone for six seconds, the nearest bud waves and chimes.
There is not a word of text on the field, and the volume is lower than in the other
games: the ears are closer to the speaker.</p>

<h3>What went wrong</h3>
<p>The main thing: I have never seen a three-year-old. The "child" in testing was a bot
that pushes in a random direction for 0.2–1 seconds and lets go a third of the time. It
took 40–270 seconds per garden, and the whole long tail was the last bud, which you do
not reach by chance. The last two buds now pull from 1.5 times as far, which gives
25–124 seconds, median about a minute. A bot that flies straight at the target clears a
garden in 10–12 seconds, celebration included. How long it takes a real girl, and
whether she likes it, no bot can tell.</p>

<p>The second turned up when I stopped calling the game's functions directly and sent
a real click and real key presses into headless Chromium. Right after Play the game
paused itself: the browser releases the pointer lock on the way into full screen, and the
game took that for leaving. Now only the loss of a lock that existed and outlived the
transition pauses. The same run confirmed that <code>F5</code> and <code>Tab</code>
make balloons and the page stays put.</p>

<p>The third was the lullaby. The first generator pulled the melody to the nearest
chord tone on every strong beat, and it got stuck on one note: C, C, C. Dumping notes
against chords showed it; now the nearest tone may not repeat the previous one. And as
with the danmaku: I cannot hear. I have not listened to the bells or the music.</p>

<p>And what shipped broken was seen by the first live person. The pointer was not
captured and wandered all over the screen: in Chromium <code>requestFullscreen</code>
consumes the user gesture, and I asked for the pointer lock after it, leaving the
browser nothing to grant it against. The headless run did not show this, since the
lock was granted there regardless. Now the lock comes first and full screen second,
and a lost lock is taken back by any click or key. The second was the ladybird's
spots: canvas joins several circles in one path with line segments, and the fill drew
wedges between the spots. I had looked at screenshots, but whole ones, where the
ladybird is the size of a fingernail; a close-up showed it at once. I redrew her: short
legs, a domed shell, seven spots, the front one splitting in two on take-off.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>~40 min<small>one turn</small></dd></div>
  <div><dt>Tokens</dt><dd>~150k</dd></div>
  <div><dt>Code</dt><dd>1000 lines<small>one file, no dependencies</small></dd></div>
  <div><dt>Verified</dt><dd>by bot and input<small>not by a child</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`}
};
