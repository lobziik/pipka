# Pipka Ladybird

For a three-year-old: a ladybird, buds that bloom into notes, balloons from every key.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#ladybird), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

The pipka flies the ladybird (let go and she lands), any key launches a
balloon from where it sits on the keyboard, the buttons under the space bar make her laugh
and the flowers sing. The game goes full screen; hold `Esc` to leave.

## How it works

For a three-year-old, so there is no losing, no timer and no text on the field. A garden is
six buds (four in the very first); touching one makes it bloom with a note of C major
pentatonic, assigned left to right in rising order, so a sweep along the row plays a scale
and no order of touching can sound wrong. When all are open there is a rainbow, a fanfare
and a butterfly joins the flock behind the ladybird (kept in `localStorage`). The flock is
at most eight: the ninth butterfly scatters it, the eight fly off in a fan past the edges,
and the newcomer stays alone. Letters follows the same rule. Scenes
cycle morning, day, evening, night; at night the buds are sleeping stars and the moon wakes
when the last one is lit.

The help is explicit and measured. Within 130 px a closed bud pulls the ladybird at up to
190 px/s, less than her 280 px/s top speed, so she can always fly past; the last two buds
pull from 1.5 times as far. After six seconds without input the nearest bud waves and
chimes. The stick filter is τ = 120 ms, twice the danmaku's, and the default threshold is
560 px/s, because a child's finger pushes hard and all at once.

The magnet strength is chosen below the field ("Magnet", kept in `localStorage`):

| | radius | pull at the centre |
|---|---|---|
| strong (default, the original) | 130 px | 190 px/s |
| medium | 110 px | 130 px/s |
| weak | 90 px | 80 px/s |
| off | — | — |

The pull is always below the ladybird's 280 px/s top speed, and the last two buds pull
from 1.5 times the radius. The strong magnet visibly steers the ladybird on its own, which
is why the strength is a setting.

A bot pushing at random (8 gardens per setting) shows almost no difference: a garden's
median is 84–128 s in all four settings, ranging over 24–230 s. In the ladybird any bud
will do, and random flight bumps into them without a magnet too.

Every key is a balloon rising above that key's place on the keyboard, with a note fixed to
the key. While playing, every key's default is suppressed (`F5` and `Tab` included), and in
Chromium full screen `navigator.keyboard.lock()` keeps the browser's own shortcuts too; a
short `Esc` is then a balloon and only holding it leaves. In Firefox `Esc` pauses at once.

Checked by a bot in headless Chromium, not by a child: one that flies straight at the nearest
bud clears a garden in 10–12 s including the six-second celebration; one that pushes in a
random direction for 0.2–1 s and lets go 30% of the time takes 25–124 s, median about 60
(before the stronger pull on the last two buds the tail reached 270 s).
