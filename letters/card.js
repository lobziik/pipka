/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["letters"]={
 order:6, play:"letters/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <path d="M0 124c50-18 100-14 150-4s100 8 150-6v76H0z" fill="#3f8f3a"/>
    <g font-family="sans-serif" font-weight="600" font-size="26" text-anchor="middle">
      <rect x="78" y="14" width="34" height="34" rx="6" fill="#fffdf6" stroke="#ff6fa8" stroke-width="3"/><text x="95" y="41" fill="#2b2230">М</text>
      <rect x="118" y="14" width="34" height="34" rx="6" fill="#fffdf6" stroke="#ffb03b" stroke-width="3"/><text x="135" y="41" fill="#2b2230">А</text>
      <rect x="158" y="14" width="34" height="34" rx="6" fill="#fff" fill-opacity=".25" stroke="#f0b429" stroke-width="2"/><text x="175" y="41" fill="#2b2230" fill-opacity=".5">М</text>
      <rect x="198" y="14" width="34" height="34" rx="6" fill="#fff" fill-opacity=".2" stroke="#8b96a1" stroke-width="1.5"/><text x="215" y="41" fill="#2b2230" fill-opacity=".3">А</text>
      <rect x="166" y="53" width="18" height="3" rx="1.5" fill="#f0b429"/>
    </g>
    <path d="M226 150v-30" stroke="#58a64e" stroke-width="4"/>
    <circle cx="226" cy="108" r="16" fill="#fffdf6" stroke="#b77cff" stroke-width="3"/>
    <text x="226" y="117" fill="#2b2230" font-family="sans-serif" font-weight="600" font-size="22" text-anchor="middle">М</text>
    <path d="M60 156v-30" stroke="#58a64e" stroke-width="4"/>
    <circle cx="60" cy="114" r="16" fill="#fffdf6" stroke="#5fb8ff" stroke-width="3"/>
    <text x="60" y="123" fill="#2b2230" font-family="sans-serif" font-weight="600" font-size="22" text-anchor="middle">А</text>
    <g transform="translate(150 104) scale(.8)">
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
  `},
 ru:{title:"Пипка-Буквы", kicker:"Для тех, кто учит буквы",
  time:"~35 мин + голос", tokens:"—", model:"Opus 5.5",
  body:`<blockquote>Прокачай игру с коровкой, добавь туда буквы, сделай копию. Чтоб учить буквы
и учиться читать. Показываем простое слово, в цветах буквы собирать, по порядку. И
таймер + статистику там, для оператора/родителя.<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>Это копия коровки, а не её режим: у коровки обещание «проиграть нельзя, читать не
нужно», и я не стал его трогать. Полёт, фильтр пипки, сцены, колыбельная, шарики и
бабочки — те же. Поменялось, куда лететь. Наверху всё слово сразу, плашками: собранные
буквы в цвет своего бутона, несобранные серые, нужная сейчас дышит и подчёркнута. На
каждом бутоне буква на белом круге, и бутон качается, а буква нет — иначе трёхлетка
каждый раз видит новую фигуру.</p>

<p>Порядок держит само слово. Нужная буква распускается от касания, и буква улетает
по дуге на своё место наверху. Не та качает головой, «не-а» двумя мягкими тонами, и
через полторы секунды нужная сама машет и называется. Ноты раздаются по месту в слове,
а не по бутону, поэтому собранное слово играет восходящую пентатонику, а в МАМА всё
равно, какую М взять первой. Когда слово собрано, его читают: плашки подпрыгивают по
одной, каждая с нотой и звуком своей буквы, потом слово целиком, и только потом
радуга. Голос — записи Gemini TTS, сгенерированные скриптом рядом с игрой; системный
синтезатор речи — запасной.</p>

<p>Магнит тянет только к нужной букве. Если бы тянули все, как в коровке, игра сама
затаскивала бы ребёнка в соседний бутон и сама же записывала промах. Промахом
считается не касание чужой буквы, а остановка на ней: скорость ниже 60 px/s полсекунды
подряд. Пролёт насквозь даже на половине скорости длится секунду, а по пути к нужной
коровка всё время пролетает над соседними.</p>

<p>Уровней четыре, переключает взрослый: короткие слова, стоящие слева направо, как
читаются; те же вразброс; с одной лишней буквой; длиннее и с двумя лишними. Первое
слово — МАМА. Клавиатура тоже учит: шарик несёт букву своей клавиши по ЙЦУКЕН,
независимо от включённой раскладки, и если это нужная буква, её бутон машет.</p>

<p>Таймер и статистика — для взрослого, ребёнок их не видит. В шапке время этого
слова, время за сегодня и промахи. Таймер слова идёт только в полёте, пауза и
праздник не считаются. По кнопке «Статистика» игра встаёт на паузу и показывает
сегодня и всего, среднее и лучшее время на слово, точность, таблицу букв по алфавиту
(сколько раз собрана, среднее время поиска, на скольких промахах её искали, цветом —
какие идут плохо), пары «искали Б — встали на В» и последние слова с временем.
Хранится в <code>localStorage</code> отдельно для каждого языка.</p>

<h3>Что пошло не так</h3>
<p>Голос. Первая версия говорила системным синтезатором, и я его не проверял: в
безголовом Chromium его нет. Первый же живой человек сообщил, что голос не работает.
На Linux браузер берёт голоса у speech-dispatcher, а его в системе не было вовсе, и
кнопка при этом бодро показывала «Голос: вкл». Поставили espeak-ng — голос
заработал, и вердикт был «полный отврат». Теперь главный голос — записи,
сгенерированные Gemini TTS скриптом рядом с игрой: словарь и настройки голоса на
входе, по записи на каждую букву, слово и похвалу на выходе, а системный синтезатор
остался запасным. Кнопка теперь говорит, если голоса нет и почему. Цепочку я
проверил на тонах вместо речи: обрезка тишины, сжатие, распаковка в игре, очередь
«слово, потом похвала». Настоящих записей я не слышал — ключа у меня не было.</p>

<p>С записями вылезло ещё три вещи, и все услышал человек, а не я. Робот пролазил:
шарик с Ь искал запись, которой не было, и игра молча уходила в espeak. Теперь
голоса не смешиваются: нет записи — тишина. Чтение по буквам шло ровно через
полсекунды, и «а» длиной в 1.4 с обрывалась на трети. И у букв «жёстко колбасило
стиль»: по одной букве на запрос каждая рождалась у генератора заново. Предложение
пришло от человека — озвучить все буквы одной длинной записью через паузы и потом
нарезать. Режу ровно на столько кусков, сколько букв, по самым длинным паузам, и
скрипт говорит, если модель что-то склеила. Ещё генератор тянул русские буквы в
английское произношение; теперь у каждого языка в настройках своё — русское и
британское RP. Буквы заодно стали звуками, как в букваре: «ммм», а не «эм».</p>

<p>«Ребёнок» опять был ботом. Тот, что летит прямо к нужной букве, собирает короткое
слово за 3–6 секунд, длинное с двумя лишними — за 4–8. Тот, что давит в случайную
сторону, на первом уровне собирает слово за 12–169 секунд, медиана около 80, на
третьем — медиана около 100 и 0–2 промаха на слово. Это дольше коровочного сада:
там годился любой бутон, здесь только один. Снизу это ограничивает мало — живой
ребёнок целится.</p>

<p>На снимках нашлись две вещи. Буква, летящая к слову, уходила за верхний край поля:
дуга была привязана ко времени, а положение — к сглаженному времени, и горб
приходился на место, где буква уже почти долетела. Теперь дуга идёт по тому же
сглаженному ходу. И в статистике секунды печатались как «8.2 S»: плашка наследовала
<code>text-transform:uppercase</code> от подписи.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>~35 мин<small>одним ходом</small></dd></div>
  <div><dt>Кода</dt><dd>1380 строк<small>один файл, без зависимостей</small></dd></div>
  <div><dt>Проверено</dt><dd>ботом и снимками<small>голос и ребёнок — нет</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Letters", kicker:"For learning letters",
  time:"~35 min + voice", tokens:"—", model:"Opus 5.5",
  body:`<blockquote>Level up the ladybird game, add letters, make a copy. For learning letters
and learning to read. Show a simple word, collect the letters in the flowers, in order.
And a timer + statistics, for the operator/parent.<cite>The brief, translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>It is a copy of the ladybird, not a mode of it: the ladybird promises "you cannot
lose, nothing needs reading", and I left that alone. Flight, the pipka filter, the
scenes, the lullaby, balloons and butterflies are the same. What changed is where to
fly. The whole word is at the top from the start, as tiles: collected letters in their
bud's colour, the rest grey, the one wanted now breathing and underlined. Every bud
carries its letter on a white disc, and the bud sways while the letter does not —
otherwise a three-year-old sees a new shape every time.</p>

<p>The word itself holds the order. The right letter blooms at a touch and its letter
flies in an arc to its place at the top. A wrong one shakes its head, says "uh-uh" in
two soft tones, and a second and a half later the right one waves and names itself.
Notes go by position in the word, not by bud, so a collected word plays a rising
pentatonic and in MAMA it does not matter which M comes first. When the word is done
it is read: the tiles jump one by one, each with a note and its letter spoken, then the
whole word, and only then the rainbow. The voice is Gemini TTS recordings made by a
script next to the game; the system speech synthesiser is the fallback.</p>

<p>The pull goes only towards the right letter. If every bud pulled, as in the
ladybird, the game would drag the child into a neighbouring bud and then log the miss
itself. A miss is not touching a wrong letter but stopping on it: below 60 px/s for
half a second running. Flying straight through, even at half speed, takes a second,
and on the way to the right letter the ladybird keeps crossing the others.</p>

<p>Four levels, set by the grown-up: short words standing left to right as they are
read; the same scattered; with one extra letter; longer with two extras. The first word
is MAMA (MOM in English). The keyboard teaches too: a balloon carries its key's letter
by physical position, whatever layout is switched on, and if it is the letter needed,
its bud waves.</p>

<p>Timer and statistics are for the grown-up; the child does not see them. The header
shows this word's time, today's time and the misses. The word timer only runs in
flight; pause and celebration do not count. The Statistics button pauses the game and
shows today and all time, average and best time per word, accuracy, a letter table in
alphabet order (times collected, average search time, misses while it was wanted, and
a colour for the ones that go badly), "wanted B, stopped on V" pairs, and the recent
words with their times. It is kept in <code>localStorage</code>, separately per
language.</p>

<h3>What went wrong</h3>
<p>The voice. The first version spoke through the system synthesiser, and I never
checked it: headless Chromium has none. The first live person reported that the voice
did not work. On Linux the browser gets its voices from speech-dispatcher, which was
not installed at all, while the button cheerfully read "Voice: on". With espeak-ng
installed the voice worked, and the verdict was "utterly vile". The main voice is now
recordings generated with Gemini TTS by a script next to the game: a dictionary and
voice settings in, one clip per letter, word and praise out, with the system
synthesiser kept as a fallback. The button now says when there is no voice, and why.
I checked the pipeline with tones instead of speech: silence trimming, compression,
decoding in the game, the "word, then praise" queue. I have not heard the real
recordings; I had no key.</p>

<p>The recordings brought out three more things, all heard by a person, not by me. A
robot kept slipping in: a soft-sign balloon looked for a clip that did not exist and
the game quietly fell back to espeak. Voices no longer mix: no clip means silence.
Reading letter by letter stepped every half second exactly, cutting a 1.4-second "a"
to a third. And the letters' style "lurched hard": with one letter per request each
was born afresh. The fix came from the person — voice all letters as one long
recording with pauses and cut it up. I cut it into exactly as many pieces as there are
letters, at the longest pauses, and the script says when the model ran two together.
The generator also pulled Russian letters towards English pronunciation; now each
language has its own in the settings, Russian and British RP. And the letters became
sounds, as in a primer: "mmm", not "em".</p>

<p>The "child" was a bot again. One that flies straight at the right letter collects a
short word in 3–6 seconds and a long one with two extras in 4–8. One that pushes in a
random direction takes 12–169 seconds per word on level one, median about 80, and on
level three a median of about 100 with 0–2 misses a word. That is longer than a
ladybird garden: there any bud would do, here only one. It says little about a real
child, who aims.</p>

<p>The screenshots found two things. A letter flying to the word went off the top of
the field: the arc was tied to time and the position to eased time, so the hump fell
where the letter had nearly arrived. The arc now follows the same eased progress. And
the statistics printed seconds as "8.2 S": the figure inherited
<code>text-transform:uppercase</code> from its label.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>~35 min<small>one turn</small></dd></div>
  <div><dt>Code</dt><dd>1380 lines<small>one file, no dependencies</small></dd></div>
  <div><dt>Verified</dt><dd>by bot and screenshots<small>not the voice, not a child</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5.5<small>claude-opus-5-5</small></dd></div>
</dl>`}
};
