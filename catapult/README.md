# Pipka Catapult

An ork catapult in 3D, seen from behind: the pipka cranks the winch and turns the
carriage, rocks and grots fly at a humie fort, and the fort falls apart block by block.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#catapult), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback
(half deflection), the slider at the bottom sets pipka sensitivity, and the `EN`/`RU`
button switches language (the choice is shared across the site through `localStorage`).

The pipka is two rate controls at once. **Sideways** turns the carriage, up to 26°/s at
full deflection. **Towards you** cranks the winch and twists the torsion, **away** lets it
off, up to 35% tension a second. Both go through an expo curve, `x·(0.25 + 0.75·|x|)`, so a
light touch gives about a degree a second for finishing the aim. A diagonal is damped:
each axis loses half of the other's deflection, because a finger does not hold a clean
axis and an unnoticed tension change only shows when the rock falls short.

The **left button** or `Space` looses; during the flight and the aftermath it goes
straight back to the catapult. The **right button** or `Z` is binoculars: an 11° field
along the aim, and both rates drop to 30%. The **wheel** (on a ThinkPad that is the middle
button plus the pipka) or `1 2 3` or `Tab` picks the ammo: rock, grot, squig. A grot in
flight is steered with the pipka: it turns its flight path with its ears.

## How it works

**The catapult** is a model, not an animation. The arm is a 5 m, 150 kg rod on an axle
3.2 m up; the torsion bundle is twisted by the winch to an angle `th` and unwinds while the
arm travels from cocked (−36° from the horizontal, backwards) to the crossbar (+48°). At
+48° the bucket is moving 42° upwards. Tension 0…1 is `th` from `PHI` to `3·PHI`, where
`PHI` is the 84° of travel: at zero the bundle runs out exactly at the crossbar. The energy
`K·(th·PHI − PHI²/2)` is linear in tension, and so, nearly, is the range: one per cent of
tension is 1.34–1.48 m of range anywhere on the scale. That is what makes tension readable
as distance. `K = 27 700 N·m/rad` was chosen so that a rock leaves at 40 m/s at full
tension.

The arm is integrated with eight substeps per frame step (spring torque against the
weight of the arm and the load), and the load leaves the bucket along the tangent. Lighter
ammo leaves faster, because the same energy is shared with the arm.

| ammo | mass | leaves at (100%) | still-air range, 0 / 50 / 100% | what it does |
|---|---|---|---|---|
| rock | 120 kg | 40.0 m/s | 23 / 91 / 153 m | barely notices the air, breaks blocks |
| grot | 30 kg | 59.5 m/s | 51 / 125 / 169 m | sprawled, drifts most, steered by ears |
| squig | 60 kg | 50.4 m/s | 39 / 119 / 178 m | explodes on first contact, radius 6.5 m |

Flight: gravity, quadratic drag relative to the air (`k = ½·ρ·cd·A/m`), wind. The grot's
ears turn its flight path at up to 0.09 rad/s sideways and 0.06 rad/s up; over a 90 m
flight (4.6 s) full deflection carries it 17.6 m to the side or adds 6 m of range.

**The mek** (left, under the tension gauge) shows the range for the current tension and
ammo in still air, to the fort's ground level. The wind is not in it. The wind is shown by
the windsock on the catapult, the arrow top right (relative to the aim, up is downrange)
and the fort's banner; it gusts a little before every shot. After a miss that knocked no
humie, a line says short/long relative to the fort's front and how far left/right.
The last shot's trail stays in the sky and its flag stays on the ground, the tension gauge
keeps a tick at the last shot's tension, and the last three impacts are numbered.

**The fort** is built from 1.2 m blocks on a grid in the fort's own frame: a front wall
with crenels, a 2×2 tower at each end, a keep from fort 2, a third tower from fort 6;
humies stand on top of towers, the keep and the wall, and from fort 3 also on the ground
behind the wall. There are 3 + fort number humies, at most nine. Distance is
66 + 11·fort + up to 14 m, capped at 132 m, at 6–18° off the starting aim; the fort stands
on a mound 3 m above its surroundings. Wind is at most 0.4 m/s at fort 1 and grows to
at most 7 m/s from fort 7.
Ammo: rocks/grots/squigs 6/2/0 on fort 1, 4/2/1 on forts 2–3, then 4/2/2.

A glued block does not simulate. A hit deals the impulse `(1+e)·|vₙ|·m` against it; the
block's strength (wood 2200, stone 3400, metal 6000 N·s) is spent and accumulates over
hits. When it runs out the block comes loose with the two-body impulse, and a quarter of
the hit spreads to its six neighbours. Support is recomputed layer by layer from the
ground: a block stands if the block under it stands, or if at least two of its four side
neighbours stand. A lintel over a knocked-out block holds; a ledge does not. Everything
left unsupported comes loose at once, with a slight lean away from the catapult, which is
how a tower falls rather than dissolving in place.

Loose blocks, fallen humies and projectiles are spheres with mass, restitution and
Coulomb friction (the impulse of a landing also brakes along the slope). Spheres rather
than cubes on purpose: a heap of spheres goes to sleep quickly, a heap of honest cubes
jitters. A block is drawn as a cube and, once nearly at rest, turned face down. Bodies
sleep after 0.5 s below 0.35 m/s in contact and wake when something hits them harder
than 1 m/s or when a block near them comes loose. Collisions with the glued fort are
sphere-against-box in the fort's frame, so the fort wall is flat, not bumpy.

A humie falls when anything moving faster than 2.5 m/s passes through them, when their
block comes loose, within 85% of a squig's blast, and when the column they stand on takes
a hit of at least a third of the block's strength within three layers below them. The
last rule came from the bots: without it, a bot whose aim was off by 1.5% of tension did
not clear fort 1, because only a hit on the humie or on the block right under them
counted.

Scoring: a block 10/15/25 by material, a humie 100, a cleared fort 250 plus 150 per
unused round. Out of ammo with humies left is the end.

**Terrain.** A 100×100 grid of 9 m cells over 900×900 m, value noise, with a trampled
pad under the catapult, the mound under the fort and mountains around the edge so that
the horizon is not a straight line. Heights between nodes are interpolated over the same
triangles that are drawn, so a rock neither hovers above a slope nor sinks into it.

**Picture.** Raw WebGL 1, no libraries. Flat-shaded convex meshes (cube, octahedron,
pyramid, octagonal prism) with a sun, a sky term and squared-exponential fog into the
horizon colour; the sky is a gradient from the projected horizon line. Everything except
the terrain is rebuilt on the CPU every frame into one vertex buffer and drawn with one
call (~1000 boxes): on an old integrated GPU that is cheaper than a thousand draw calls.
Blob shadows go into a second, blended buffer; without them a rock's height cannot be
read in 3D. The GL canvas is capped at ~1.4 Mpixel. Markers over the humies, the gauge,
the wind dial, the ammo bar and the banners are drawn on a 2D canvas on top.

**Camera.** Aiming: behind and above the catapult, 3 m to the left of it so that the
frame does not cover the fort, with yellow distance marks along the aim and labels
at 50/100/150 m. Flight: a chase camera. After impact: a view of the impact point from the
catapult side, until everything is asleep (at least 2.2 s, at most 7 s). Title and end
screen: an orbit around the field.

**Sound.** Generated: the orks' WAAAGH is a sawtooth through two band-pass formants for
"a" with a noise "gh" at the end, the grot's squeal is the same voice an octave up with
"i" formants, hits are filtered noise by material, the drums are 100 bpm toms with a clap.

**Persistence** in `localStorage`: `pipka.catapult.sens`, `pipka.catapult.best`,
`pipka.catapult.music`, and the shared `pipka.mute` and `pipka.lang`.

## Checks

* `node physics-test.js` extracts `CATAPULT-CORE` from this page and checks: the arm's
  kinetic energy at release equals the torsion energy minus the lift of arm and load
  (0.1–0.3% for all three ammo); a rock at full tension leaves at 40.0 m/s at 42.0°;
  rock range 23…153 m; range strictly increasing in tension for every ammo; 1% of
  tension gives 1.48 / 1.34 / 1.41 m at 10/50/90%; the farthest fort (132 m, keep 8 m
  deeper, 3 m higher) is reachable by a rock against a 7 m/s headwind (146 m); a 5 m/s
  crosswind at 90 m drifts a rock 0.8 m and a grot 5.6 m; the grot's ears give 17.6 m
  sideways and +6 m range.
* Bots in headless Chromium through the `#test` hook: a solver finds tension and yaw
  through the core model with the actual wind and fires at the highest humie, 10 forts
  at most, four seeds. Perfect: cleared all 10 forts on three seeds, died on fort 9 on
  one. With a random error of 1.5% tension and 0.4° per shot (and no correction from
  shot to shot, which a person does): reached forts 3, 6, 8 and cleared all 10. With 3%
  and 0.8°: reached forts 1, 3, 3 and 5.
* Real input through the DevTools protocol: a click on the start button gets pointer
  lock, 1.2 s of pressure towards you raises tension 40 → 50.7%, pressure to the right
  turns the catapult right, a click looses.
* Frame time on the author's ThinkPad T480 (UHD 620) in headless Chromium with ANGLE on
  OpenGL: 58 fps, 3 ms of JavaScript per frame (1.7 building and drawing the scene, 1.3
  the 2D overlay). With the software rasteriser (SwiftShader) it is 2–3 fps: on a machine
  without a working GPU the game cannot be played.
* Screenshots of aiming, binoculars, flight of each ammo, the squig's blast, a collapse
  and the end screen in both languages, looked at frame by frame.

Not checked: the sound has never been heard by anyone; nobody has played it on a real
pipka, so the expo curve, the rates and the default sensitivity of 420 px/s are guesses;
whether a fort at 120 m reads without binoculars for a live eye; any GPU other than the
UHD 620.
