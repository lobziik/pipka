# Pipka Danmaku

Almost Touhou: procedural waves, Cirno every ninth, generated music.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#danmaku), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

The pipka is the ship's velocity (let go and you stop), the left
button or `Shift` is focus (slower, hitbox shown), the right button or `X` is a bomb.
Firing is automatic.

## How it works

The field is 384×448 logical pixels, Touhou's native size, scaled to fit the window, so
bullet speeds do not depend on the monitor. Only the white dot in the middle of the ship
can be hit; bullets passing within 16 px of it count as graze. Flying above the top quarter
pulls every item on screen to you.

Each wave is built on the spot from 2–4 groups: a formation (line, stream, vee, arc, big
fairy, rain, pair) times a pattern (aimed, fan, ring, spray, rice; spiral, flower, petals and
wall for big fairies). Formations and patterns unlock with the wave number; bullet speed,
bullets per volley, toughness, rate of fire and fairy count then grow towards ceilings set
in `diff()`, chosen so that late waves are dense rather than fast. Every ninth wave is
Cirno: five spell phases on the first loop, six from the second, with more hit points and
the safe gap in "Icicle Fall" closed by aimed shots.

The music is generated: a minor chord progression, a two-bar motif made by a random walk
over the scale with strong beats pulled to chord tones, repeated over the next chords. A
25% pulse lead with an echo, sawtooth octave bass, a 12.5% pulse arpeggio and noise drums.
The seed is the loop number; Cirno has her own theme. Music can be switched off separately
from the effects.

Checked by a bot in headless Chromium, not by ear: a bot that only shies away from bullets
dies on waves 6–8, an immortal one reaches wave 27 at a peak of 830 bullets on screen. Under
software rasterisation 2000 bullets cost 8.7 ms a frame.
