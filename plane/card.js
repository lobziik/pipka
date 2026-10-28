/* Карточка игры для хаба (index.html в корне): заказ, как появилась игра, что пошло
   не так, метрики. Хаб подключает её тегом <script> — с file:// иначе никак.
   Требования к тексту — в AGENTS.md, раздел «Card». */
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["plane"]={
 order:1, play:"plane/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`    <g stroke="#39424e" stroke-width="13" fill="none">
      <path d="M8 44H96M204 44H292M8 104H70M230 104H292M8 164H120M228 164H292"/>
    </g>
    <g fill="#e4322b">
      <rect x="92" y="34" width="7" height="20"/><rect x="201" y="34" width="7" height="20"/>
      <rect x="66" y="94" width="7" height="20"/><rect x="227" y="94" width="7" height="20"/>
    </g>
    <path d="M150 128l15 34-15-7-15 7z" fill="#e6ecf3"/>
    <path d="M150 182V150" stroke="#6fd0e8" stroke-width="4" opacity=".5"/>
  `},
 ru:{title:"Пипка-Пилот", kicker:"Ночной слалом",
  time:"14 мин", tokens:"~76k", model:"Opus 5",
  body:`<blockquote>Ленова т480. Хочу игру с самолетиком (ну или предложи идеи получше),
чтоб теребить «пипку». Тут такая красная пипка есть которая управляет курсором.
Как она называется кстати?<cite>Заказ</cite></blockquote>

<h3>Так родилась игра</h3>
<p>В заказе было спрятано техническое задание, о котором заказчик не подозревал.
«Теребить пипку» — это глагол про усилие, а не про точность. Значит, игра не должна
требовать попадания в мелкие цели: пипка в этом проигрывает даже тачпаду. Зато она
умеет то, чего не умеет мышь, — держать <em>постоянное усилие</em>. Палец лежит
и давит; устройство всё это время честно сообщает «меня держат вот с такой силой».</p>

<p>Отсюда весь дизайн. Самолётик — не прихоть заказчика, а единственно верный жанр:
настоящая ручка управления самолётом работает ровно так же. Отклонил — получил не
поворот, а <em>скорость</em> поворота. Такое управление называют управлением по
производной, и изометрические устройства (те, что меряют силу, а не ход) к нему
подходят лучше всего — это давно измеренный факт, а не вкусовщина.</p>

<p>Технически всё держится на Pointer Lock: браузер отдаёт относительные дельты
<code>movementX/Y</code>, я делю их на время кадра и получаю мгновенную скорость
курсора в пикселях в секунду — а она у TrackPoint пропорциональна нажиму. Дальше
экспоненциальное сглаживание с постоянной 70 мс превращает рваный поток событий
в аналоговое отклонение ручки от −1 до +1. Ползунок «чувствительность» — это порог,
при котором отклонение считается полным; у разных ThinkPad'ов пипка разной
жёсткости, так что настройка обязана быть в интерфейсе, а не в коде.</p>

<p>Дальше начинается собственно удовольствие. Отклонение задаёт не снос, а крен;
крен уже даёт боковое ускорение. Два интегрирования между пальцем и траекторией —
это ровно та инерция, из-за которой самолёт «ведут», а не «двигают». Игра получилась
про упреждение: створ ворот надо начинать проходить за полсекунды до того, как он
доехал до экрана. Индикатор пипки слева внизу показывает живой нажим в px/s — на него
залипаешь отдельно, потому что впервые видишь, что делает твой палец.</p>

<h3>Что пошло не так</h3>
<p>Опубликовал — и получил «не работает, не пропадает экран с кнопкой ещё раз».
Мой CSS <code>.ov{display:flex}</code> перебивал браузерное правило
<code>[hidden]{display:none}</code>, и все три оверлея лежали друг на друге;
игра шла под ними. Платформа, куда я публиковал страницу, добавляет это правило
сама, поэтому у меня всё работало, а в локальном файле — нет. Урок дешёвый, но
показательный: проверял я ту сборку, которой пользователь не пользуется.</p>

<dl class="stats">
  <div><dt>Время</dt><dd>14 мин<small>22:03 → 22:17</small></dd></div>
  <div><dt>Токенов</dt><dd>~76k<small>два хода</small></dd></div>
  <div><dt>Кода</dt><dd>470 строк<small>один файл, без зависимостей</small></dd></div>
  <div><dt>Проверено</dt><dd>синтаксис<small>числовых проверок не было</small></dd></div>
  <div><dt>Модель</dt><dd>Opus 5<small>claude-opus-5</small></dd></div>
</dl>`},
 en:{title:"Pipka Pilot", kicker:"Night slalom",
  time:"14 min", tokens:"~76k", model:"Opus 5",
  body:`<blockquote>Lenovo T480. I want a game with a little plane (or suggest something
better) for fiddling with the "nub". There is this red nub here that moves the
cursor. What is it called, by the way?<cite>The brief, translated</cite></blockquote>

<h3>How the game came out of it</h3>
<p>The brief contained a technical specification its author did not know he was
writing. "Fiddling with the pipka" is a verb about effort, not about precision. So
the game must not ask you to hit small targets: at that the pipka loses even to a
touchpad. What it can do instead, and a mouse cannot, is hold a <em>steady
force</em>. Your finger rests and pushes, and all the while the device honestly
reports "I am being held this hard".</p>

<p>Everything else follows. The little plane was not an indulgence of the client's
whim but the only correct genre: a real aircraft stick works exactly this way.
Deflect it and you get not a turn but a <em>turn rate</em>. That arrangement is
called rate control, and isometric devices — the ones that measure force rather
than travel — pair with it best. That is a measured result, not a matter of taste.</p>

<p>Technically it rests on Pointer Lock: the browser hands over relative
<code>movementX/Y</code> deltas, I divide them by the frame time and get the
instantaneous pointer speed in pixels per second — which, on a TrackPoint, is
proportional to pressure. An exponential filter with a 70 ms time constant then
turns that ragged event stream into an analogue stick deflection from −1 to +1.
The sensitivity slider sets the pressure that counts as full deflection; pipkas
differ in stiffness from ThinkPad to ThinkPad, so that setting belongs in the
interface, not in the source.</p>

<p>Then the actual pleasure starts. Deflection sets bank, not drift; bank then
produces lateral acceleration. Two integrations between finger and trajectory are
exactly the inertia that makes you <em>fly</em> the plane rather than move it. The
game turned out to be about anticipation: you have to start taking a gate half a
second before it reaches the screen. The pipka readout in the bottom left shows live
pressure in px/s, and it is weirdly absorbing on its own, because it is the first
time you get to see what your fingertip is actually doing.</p>

<h3>What went wrong</h3>
<p>I published it and got back "doesn't work, the screen with the Again button
won't go away". My own <code>.ov{display:flex}</code> was overriding the browser's
<code>[hidden]{display:none}</code>, so all three overlays sat on top of each
other and the game ran underneath them. The platform I published to adds that rule
itself, so it worked there and not in the local file. A cheap lesson, but a telling
one: I had tested the build the user does not use.</p>

<dl class="stats">
  <div><dt>Time</dt><dd>14 min<small>22:03 → 22:17</small></dd></div>
  <div><dt>Tokens</dt><dd>~76k<small>across two turns</small></dd></div>
  <div><dt>Code</dt><dd>470 lines<small>one file, no dependencies</small></dd></div>
  <div><dt>Verified</dt><dd>syntax<small>no numeric checks</small></dd></div>
  <div><dt>Model</dt><dd>Opus 5<small>claude-opus-5</small></dd></div>
</dl>`}
};
