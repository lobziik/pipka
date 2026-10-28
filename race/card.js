/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["race"]={
 order:2, play:"race/index.html",
 thumb:{viewBox:"150 280 2920 1780", svg:`    <path d="M2116 1930L2155 1934L2194 1928L2229 1912L2260 1888L2406 1735L2430 1715L2458 1700L2488 1692L2693 1656L2729 1648L2763 1635L2795 1618L2825 1597L2853 1573L2877 1545L2898 1515L2914 1483L2927 1448L2935 1413L2948 1337L2952 1300L2951 1263L2945 1227L2934 1191L2919 1158L2899 1126L2875 1098L2848 1072L2818 1051L2674 963L2647 950L2618 942L2588 939L2558 942L2483 956L2445 958L2409 953L2374 939L2344 918L2319 891L2235 776L2212 749L2185 726L2155 708L2122 696L2087 689L1868 662L1856 660L1844 658L1833 655L1207 472L1202 471L1198 469L1193 468L974 392L939 384L902 383L866 389L832 401L801 421L722 482L691 500L657 510L621 511L586 503L555 487L536 474L506 460L474 455L442 461L414 477L391 500L314 612L295 643L279 677L268 712L261 748L258 785L249 1132L250 1171L254 1210L262 1248L273 1285L288 1322L305 1356L326 1389L350 1420L376 1449L405 1475L437 1498L470 1519L505 1536L541 1550L578 1561Z" fill="none" stroke="#39424e" stroke-width="150" stroke-linejoin="round"/>
    <path d="M2116 1930L2155 1934L2194 1928L2229 1912L2260 1888L2406 1735L2430 1715L2458 1700L2488 1692L2693 1656L2729 1648L2763 1635L2795 1618L2825 1597L2853 1573L2877 1545L2898 1515L2914 1483L2927 1448L2935 1413L2948 1337L2952 1300L2951 1263L2945 1227L2934 1191L2919 1158L2899 1126L2875 1098L2848 1072L2818 1051L2674 963L2647 950L2618 942L2588 939L2558 942L2483 956L2445 958L2409 953L2374 939L2344 918L2319 891L2235 776L2212 749L2185 726L2155 708L2122 696L2087 689L1868 662L1856 660L1844 658L1833 655L1207 472L1202 471L1198 469L1193 468L974 392L939 384L902 383L866 389L832 401L801 421L722 482L691 500L657 510L621 511L586 503L555 487L536 474L506 460L474 455L442 461L414 477L391 500L314 612L295 643L279 677L268 712L261 748L258 785L249 1132L250 1171L254 1210L262 1248L273 1285L288 1322L305 1356L326 1389L350 1420L376 1449L405 1475L437 1498L470 1519L505 1536L541 1550L578 1561Z" fill="none" stroke="#22262b" stroke-width="96" stroke-linejoin="round"/>
    <path d="M2116 1930L2155 1934L2194 1928L2229 1912L2260 1888L2406 1735L2430 1715L2458 1700L2488 1692L2693 1656L2729 1648L2763 1635L2795 1618L2825 1597L2853 1573L2877 1545L2898 1515L2914 1483L2927 1448L2935 1413L2948 1337L2952 1300L2951 1263L2945 1227L2934 1191L2919 1158L2899 1126L2875 1098L2848 1072L2818 1051L2674 963L2647 950L2618 942L2588 939L2558 942L2483 956L2445 958L2409 953L2374 939L2344 918L2319 891L2235 776L2212 749L2185 726L2155 708L2122 696L2087 689L1868 662L1856 660L1844 658L1833 655L1207 472L1202 471L1198 469L1193 468L974 392L939 384L902 383L866 389L832 401L801 421L722 482L691 500L657 510L621 511L586 503L555 487L536 474L506 460L474 455L442 461L414 477L391 500L314 612L295 643L279 677L268 712L261 748L258 785L249 1132L250 1171L254 1210L262 1248L273 1285L288 1322L305 1356L326 1389L350 1420L376 1449L405 1475L437 1498L470 1519L505 1536L541 1550L578 1561Z" fill="none" stroke="#e4322b" stroke-width="18" stroke-dasharray="70 90"/>
    <circle cx="1150" cy="1948" r="60" fill="#58d68d"/>
  `},
 ru:{title:"Пипка-Трек", kicker:"Кольцо в духе Монцы",
  time:"59 мин", tokens:"~120k", model:"Opus 5",
  body:`<blockquote>Сделай еще какую нибудь. Гоночку по кругу, симулятор машинки,
не забудь про физику и энерцию.<cite>Заказ</cite></blockquote>

<p>А потом, уже по готовой игре:</p>

<blockquote>Добавь отбойники и звук, в тч звук сноса, трассу чуть пошире и побольше
поворотов, хз, монцу или еще какую такую трассу.<br><br>
И почему машина как на льду. Она не останавливается, поверхность супер скользкая.<br><br>
И бесконечно машинка улетает, если ее занесло.<br><br>
Задний ход — жестко бесит.<cite>Три следующих заказа</cite></blockquote>

<h3>Так родилась игра</h3>
<p>«Не забудь про физику и инерцию» — самая содержательная часть заказа. Для
пипки руль даже удобнее, чем ручка самолёта: настоящий руль тоже управляет не
направлением, а <em>скоростью</em> поворота, и тоже самовозвращается в ноль.
Палец на пипке и руки на руле делают физически одно и то же.</p>

<p>Поэтому модель здесь не «аркадная машинка со скольжением», а велосипедная схема
с углами увода шин: боковая сила каждой оси считается из поперечной скорости и
скорости рыскания, растёт линейно по углу увода и упирается в предел сцепления.
Сверху — эллипс трения: чем больше тяги на задней оси, тем меньше бюджета остаётся
на боковую силу. Из этой одной формулы само собой получается всё, ради чего такие
игры и делают: недостаточная поворачиваемость на входе, срыв кормы от газа,
перенос веса под тормозом, занос и выход из него.</p>

<p>Трассу я сначала строил сплайном по опорным точкам и выбросил этот подход:
у сплайна кривизна пикует ровно в опорных точках, и численная проверка показала
радиусы 5–8 метров при ширине трассы 10 — внутренняя кромка ленты сворачивалась бы
сама в себя. Четыре варианта раскладки провалили ту же проверку. Работающий способ —
полигон со скруглением углов дугами заданного радиуса: у каждого поворота радиус
задан явно, петля замкнута по построению, а минимальный радиус можно проверить
до того, как увидишь результат. Конфигурация в духе Монцы: главная прямая 212 м,
Реттифило, Курва Гранде, Роджиа, два Лесмо, прямая Серральо, связка Аскари и
длинная Параболика. Круг 869 м, 14 поворотов, ширина 12 м.</p>

<p>Звук весь синтезирован в WebAudio, сэмплов нет. Важен в нём ровно один канал:
визг покрышек повешен на угол увода задней оси, то есть он включается ровно в тот
момент, когда зад начинает уходить, и растёт вместе со сносом. Это не украшение —
это обратная связь, которой у пипки нет физически. У настоящей ручки есть отдача
и ход, у TrackPoint нет ни того, ни другого: палец не чувствует ничего, кроме
собственного нажима. Вернуть потерянный канал можно только звуком и картинкой,
поэтому визг появляется раньше, чем машина заметно поехала боком, а телеметрия
слева внизу показывает угол увода в градусах. По ней ловишь срыв на полсекунды
раньше, чем по экрану.</p>

<h3>Что пошло не так</h3>
<p>Первая версия поехала как по льду, и это были два моих бага, оба в одном месте.
В эллипсе трения я вычитал из бюджета задней оси 55% <em>полного</em> тормозного
усилия (12500 Н против бюджета 6830 Н) — под любым торможением боковое сцепление
сзади падало до остаточных 12%. Пипку на себя — и машина мгновенно на льду. Второй:
в углах увода стоял множитель <code>Math.sign(V.vx)</code>; как только машину
разворачивало и продольная скорость становилась отрицательной, боковая сила меняла
знак и начинала <em>разгонять</em> снос. Отсюда «бесконечно улетает, если занесло».</p>

<p>Чинить это на глаз я больше не стал и написал прогон модели в node:
разгон, торможение, накат, руль в упор, выход из заноса, ручник, трава. Проверка
тут же нашла ещё три вещи, которых никто не заказывал: задний ход блокировался
собственным тормозом, ручник не срывал корму, а на полблока руля при 72 км/ч руль
требовал 2.5 g при сцеплении 1.3 — машина уходила в неуправляемый разворот просто
от поворота. Теперь ход руля ограничен по сцеплению: при полном отклонении запрос
примерно на треть выше предела шин, так что занос спровоцировать можно, а
удержанный до упора руль юлу не крутит.</p>

<p>Последним ушёл задний ход. Он раздражал не потому, что был плохо сделан, а
потому, что на пипке у него нет своего жеста: «назад» уже занято тормозом, и
отличить «торможу» от «хочу назад» можно только по скорости — то есть по состоянию,
которого палец не чувствует. Орган управления с двумя осями не обязан вмещать три
намерения. Задний ход убран совсем, выезд из отбойника отдан клавише <code>R</code>.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>59 мин<small>22:17 → 23:16, две версии</small></dd></div>
  <div><dt>Токенов</dt><dd>~120k<small>51k + 69k</small></dd></div>
  <div><dt>Кода</dt><dd>850 строк<small>+ 14 проверок физики</small></dd></div>
  <div><dt>Проверено</dt><dd>числом<small>геометрия и динамика</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5<small>claude-opus-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Circuit", kicker:"A Monza-flavoured circuit",
  time:"59 min", tokens:"~120k", model:"Opus 5",
  body:`<blockquote>Make another one. A circuit race, a little car simulator, and don't
forget the physics and the inertia.<cite>The brief, translated</cite></blockquote>

<p>And then, against the finished game:</p>

<blockquote>Add armco and sound, including the sound of the slide, make the track
a bit wider and give it more corners, dunno, Monza or some track like that.<br><br>
And why is the car like on ice. It doesn't stop, the surface is super slippery.<br><br>
And the car flies off forever once it spins.<br><br>
Reverse gear — seriously annoying.<cite>The three briefs that followed</cite></blockquote>

<h3>How the game came out of it</h3>
<p>"Don't forget the physics and the inertia" was the substantive part. A steering
wheel suits the pipka even better than an aircraft stick: a real wheel also commands
not a direction but a <em>yaw rate</em>, and it also self-centres. A finger on the
nub and hands on a wheel are doing physically the same thing.</p>

<p>So the model here is not an arcade car with a slip factor but a bicycle model
with tyre slip angles: each axle's lateral force comes from the lateral and yaw
velocities, grows linearly with slip angle and saturates at the grip limit. On top
of that sits the friction ellipse: the more traction the rear axle spends going
forward, the less budget it has left to go sideways. That single formula produces,
on its own, everything such games are made for — understeer on turn-in, the rear
stepping out under power, weight transfer under braking, and the slide and the
recovery from it.</p>

<p>I first built the track as a spline through control points, and threw that
approach away: a spline's curvature peaks exactly at the control points, and a
numeric check showed radii of 5–8 metres on a 10-metre-wide track, which would fold
the inner edge of the ribbon over itself. Four candidate layouts failed the same
check. What works is a polygon with its corners filleted by arcs of a given radius:
every corner's radius is stated explicitly, the loop closes by construction, and the
minimum radius can be verified before you ever look at the result. The layout is
Monza-flavoured: a 212 m main straight, Rettifilo, Curva Grande, Roggia, both
Lesmos, the Serraglio straight, the Ascari esses and a long Parabolica. 869 m,
14 corners, 12 m wide.</p>

<p>All the sound is synthesised in WebAudio; there are no samples. Exactly one
channel really matters: tyre squeal is driven by the rear slip angle, so it comes in
at the precise moment the back starts to go and rises with the slide. It is not
decoration — it is the feedback channel the pipka physically lacks. A real stick has
resistance and travel; a TrackPoint has neither, and the finger feels nothing but
its own pressure. The only way to give that channel back is through sound and
picture, which is why the squeal arrives before the car visibly steps out, and why
the telemetry strip reports the slip angle in degrees. You catch the breakaway on
the readout half a second before you see it.</p>

<h3>What went wrong</h3>
<p>The first version drove like it was on ice, and those were two bugs of mine in
one place. In the friction ellipse I was subtracting 55% of the <em>total</em>
brake force from the rear axle's budget — 12500 N against a budget of 6830 N — so
under any braking the rear's lateral grip collapsed to a residual 12%. Pull the pipka
back and the car was instantly on ice. The second: the slip angles carried a
<code>Math.sign(V.vx)</code> factor, so once the car spun far enough for the
longitudinal speed to go negative, the lateral force flipped sign and began to
<em>accelerate</em> the slide. Hence "flies off forever once it spins".</p>

<p>I stopped fixing this by eye and wrote a model run in node: acceleration,
braking, coasting, full lock, spin recovery, handbrake, grass. The harness
immediately found three more things nobody had asked about: reverse gear was
blocked by its own brake, the handbrake did not break the rear loose, and half lock
at 72 km/h demanded 2.5 g against 1.3 g of grip, so the car span out from merely
being steered. Steering travel is now limited by grip: at full deflection the demand
is about a third above the tyres' limit, so a slide can still be provoked, but
holding the wheel at the stop no longer spins you.</p>

<p>Reverse gear went last. It was annoying not because it was badly made but because
on a pipka it has no gesture of its own: "back" is already the brake, and telling
"I am braking" from "I want to reverse" is only possible from speed — a piece of
state the finger cannot feel. A two-axis control is not obliged to carry three
intentions. Reverse is gone, and getting off the armco is now the <code>R</code>
key.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>59 min<small>22:17 → 23:16, two versions</small></dd></div>
  <div><dt>Tokens</dt><dd>~120k<small>51k + 69k</small></dd></div>
  <div><dt>Code</dt><dd>850 lines<small>plus 14 physics checks</small></dd></div>
  <div><dt>Verified</dt><dd>numerically<small>geometry and dynamics</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5<small>claude-opus-5</small></dd></div>
</dl>`}
};
