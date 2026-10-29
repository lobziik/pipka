# Pipka Féerie

A psychedelic tunnel: mandala walls with slits, beads of light that are the notes of the
tune, and a glow that fades unless you feed it.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#feerie), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

The pipka sets the spark's velocity across the tunnel, and the spark follows it with
inertia: it reaches the commanded speed with a time constant of 0.25 s and glides a little
after you let go. The first version had no lag, the spark stopped dead, and a person who
played it could not hit the beads and asked for "some inertia". The left
button or `Shift` is **breath**: the world slows to 45% while the spark keeps its speed,
and glow drains at 6/s while held. A ring on the nearest wall marks where the spark will
meet it: red is a hit, white is a pass. **Calm** in the bottom bar shortens the trails,
nearly stops the swirl and keeps the colours from fading; it starts on when the system
asks for reduced motion.

## How it works

**Geometry.** The tunnel's cross-section is a circle of radius 1, and the spark lives in it
(clamped to 0.9). The camera sits `D = 1` behind the spark's plane, so something at depth
`z` is drawn at scale `D/(D+z)`; walls appear at `ZFAR = 28`. The tunnel bends only in the
picture: the offset grows with depth and is zero in the spark's plane, so collisions never
see it.

**Walls.** Six kinds: iris (round holes, decoys from depth 2), pie (a missing sector),
groove (an open ring), spokes, rose (petals) and polar checkerboard; they unlock at
depths 1, 1, 2, 3, 4 and 5. Each wall is defined in the pose it will have when it reaches
the spark and is drawn rotated by `k·z`, so the rotation is zero at `z = 0` whatever the
speed or breathing. `solid(w, x, y)` decides hits and is the same shape the path is drawn
from (even-odd fill).

The generator walks a safe path: each wall's slit lies within 55% of what the spark can
cover at full deflection in the time between that wall and the previous one
(`VMAX = 1.6` radii/s) minus the 0.25 s inertia eats on the way, and the slit must have a clear margin of 0.09 around the path —
three times the spark's radius — or the wall falls back to an iris. Beads are strung along
the path between slits, the last one in the slit itself. A hit is the spark's centre and
at least two of four edge points (radius 0.03) on solid. A bead is caught within 0.17 of
its centre; at first it was 0.11, with the bead drawn with a bright core of 0.03, and a
person caught 20 notes in two depths.

**Glow.** Starts at 80, max 100, leaks 1.6/s at depth 1 rising to 3.2/s from depth 9.
A cleared wall gives +2.5, a bead +2 to +4 by chain length, a new depth +10. A hit costs
12 at depth 1 rising to 20 (it was 15 to 26, and a person went out at depth 4 from hits). At zero it is dawn and the game ends. Below 60 the colours start
to fade with it (not in Calm), and the music's low-pass cutoff follows it all the way.

**Depth.** 24 walls per depth. Speed goes from 3.8 m/s to a ceiling of 5.5 m/s (4.4 at
depth 4) and the wall spacing from 7 to 4.5 m, so the gap between walls shrinks from 1.8 s
to 0.85 s by depth 9 and stays there; difficulty grows with the shapes and the rotation of
the walls rather than with speed. The first version flew 7 to 14 m/s, 1.0 to 0.29 s between
walls. The first person to play it called that too fast; after a cut to 4.5–9 they asked
for a little slower still; at 3.8–7.5 they reached depth 4 (5.2 m/s) and asked "am I a
fighter pilot?".
Nine named depths, then "The Noosphere +1, +2…".

**Picture.** The world is drawn into a low-resolution buffer (200–300 rows) that is itself
on the page and stretched by CSS. Every frame the buffer is drawn into itself slightly
enlarged (1.012 + 0.0012·speed) and rotated (the swirl follows the pipka's sideways push)
at 76% opacity, 50% in Calm — the Milkdrop feedback that makes the trails and the
blooming mandala at the vanishing point. There are two buffers, swapped every frame.
Colour saturation is capped at 70%: full saturation, summed by additive blending and the
feedback, turned into neon that a person called eye-searing.

Everything that has to be read goes into a transparent full-resolution canvas on top and
is never fed back: walls, beads, the spark, the hit ring and the banners. A bead is a white
core with a dark outline on a dark backing inside a coloured halo, never smaller than 6 px,
and a white thread on a dark underlay joins the next eight beads, so the path reads as a
line rather than as separate lights on a busy tunnel. The spark is pipka-red on a dark
backing inside a white ring, a mark used nowhere else on the field. It leaves no trail in
the feedback buffer: there its echo spiralled into a string of red dots, and a person
"lost the dot, got confused about where it was". Walls used to be
drawn in the feedback buffer, and their trails laid concentric copies right over the slit
— "you can't see the hole at all". Now a wall's solid part is a mid-tone tinted curtain,
the slit is a window into the tunnel, and only the slit's edges are outlined, in white on
the nearest wall; the tunnel's own rim is not outlined, because it read as another hole.
A hit tints the field red for half a second. The first version also inverted the whole
field for 0.1 s; that went with the neon.

**Sound.** Generated, as everywhere on the site. Each depth has its own mode: D Dorian,
F Lydian, C Mixolydian, E Phrygian dominant, A Aeolian, E♭ Hungarian minor, C♯ whole tone,
F♯ Lydian, B Dorian. Chords are built in thirds inside the mode, so the whole-tone depth
plays nothing but augmented triads. A detuned saw pad, a syncopated triangle bass, a
sixteenth arpeggio whose level follows glow, sine kick, noise hats and claps; 100 bpm rising
4 per depth to 132. Beads carry scale degrees from a random walk in steps of 1–2, so the
tune you collect always fits the harmony; they and the arpeggio share an echo three
sixteenths long. The kick's scheduled time drives the mandala's pulse.

**Persistence** in `localStorage`: `pipka.feerie.sens`, `pipka.feerie.best`,
`pipka.feerie.music`, `pipka.feerie.calm`; shared `pipka.mute` and `pipka.lang`.

## Checks

Run in headless Chromium through the `#test` hook and DevTools-protocol input events.

* Generator, 6000 walls: every slit clear, the largest move between neighbouring slits
  0.42 of full deflection, kinds iris 46%, groove 15%, pie 13%, spokes 12%, rose 8%,
  checker 7%.
* Bots, made immortal for the statistics, five minutes each; the autopilot steers through
  the same 65 ms filter as the pipka and plans for the inertia. Perfect: 237 walls, 0 hits,
  807 beads out of 807, depth 9 at 262 s. With a sinusoidal error of 0.3 or 0.6 of full
  deflection: 0 hits (inertia smooths the error out). Error 1.0: 35 hits, dies at 201 s.
  Not moving: dies at 22 s.
* A person, on a real TrackPoint, four dives: depth 2 (20 notes) before inertia and the
  bigger beads, depth 4 (144 notes, best chain 13) after, went out from hits; depth 6
  (352 notes, best chain 28, score 28,520) after the gentler speed curve and cheaper hits. The sound was
  rated "it'll do".
* Live input: the start button by mouse click, mouse movement into stick deflection,
  arrows, `Shift` breath, dawn and the final screen, language switch; the `ru` and `en`
  dictionaries have the same keys.
* Timing, software rasterisation, field 1248×688: 12–13.5 ms of drawing per frame;
  headless Chromium without a GPU runs the game at 36–39 frames per second.
* Screenshots at depths 1, 3, 5, 7 and 9, a series of frames at depths 1 and 5 to see
  the slits, on a hit and at dawn, looked at closely.

Not checked: anything past depth 6 by a person (top speed, the modes from depth 7 including
the whole-tone one), and the frame rate on real hardware with a GPU.
