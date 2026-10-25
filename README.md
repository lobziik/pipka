# Pipka Games

> «Играл с пипкой — проиграл» — *played with the pipka, lost the game.*

Games for the **TrackPoint** — the red nub between the G, H and B keys of a ThinkPad.
Here it goes by **pipka**, which is what these games are named after.

[Русская версия](README.ru.md) · Live site: enable GitHub Pages on this repository
(Settings → Pages → Deploy from branch, root) and open `/`.

The pipka reports **pressure**, not position: there is a strain gauge inside and the
pointer moves faster the harder your finger pushes. It is a miniature control stick
that self-centres when released. Both games are built around that: they read force,
where an ordinary game reads cursor position. The browser side is Pointer Lock —
relative `movementX/Y` deltas divided by frame time give the pointer speed in px/s,
which is proportional to pressure, smoothed by an exponential filter (τ = 60–70 ms)
into an analogue stick deflection of −1…+1.

| Path | What it is |
|---|---|
| `index.html` | Site hub: both games plus a developer's note on each |
| `plane/index.html` | **Pipka Pilot** — night slalom: bank, inertia, gates |
| `race/index.html` | **Pipka Circuit** — Monza-flavoured circuit, armco, sound |
| `moon/index.html` | **Pipka Cosmonaut** — lunar landing: analogue throttle, fuel, contact lamp |
| `physics-test.js` | Car model run: `node physics-test.js` |

No dependencies and no build step: three self-contained HTML files.

```sh
setsid -f xdg-open index.html >/dev/null 2>&1   # or just open it in a browser
node physics-test.js
```

`setsid -f` keeps Ctrl-C in the terminal from killing the browser (in zsh, `&!` works too).

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

**Pipka Pilot** — left/right banks, forward/back is throttle.

**Pipka Circuit** — left/right steers (travel tightens with speed), forward is throttle,
back is the brake, `Space` is the handbrake, `R` puts you back on the track.
There is no reverse gear: on a two-axis control "back" is already the brake, and
telling braking from reversing needs a piece of state the finger cannot feel.

**Pipka Cosmonaut** — forward/back is the throttle (half travel is a hover),
left/right commands rotation rate, `R` aborts the approach. On a pad the margins are
2.5 m/s down, 1.2 m/s sideways and 8° of tilt; bare ground will take you too, but three
times tighter (0.85, 0.40 and 3°) and without the pad's score multiplier.

## Sensitivity

The slider sets the pressure, in px/s, that counts as full deflection. Pipkas differ in
stiffness between ThinkPads, so each machine wants its own value; it is remembered in
that browser's `localStorage`. A car usually wants a higher threshold than the plane.

The system-level speed of the pipka itself is separate:

```sh
xinput list                                      # find "TPPS/2 ... TrackPoint"
xinput list-props <id>
xinput set-prop <id> "libinput Accel Speed" 0.4
```

## Car physics

A bicycle model in metres and newtons, fixed 1/120 s step, so behaviour does not
depend on frame rate:

* lateral tyre force is computed **in the wheel's own frame**, so it always opposes
  the slide — forwards, backwards or mid-spin;
* force is linear in slip angle and saturates at `mu*Fz`;
* a friction ellipse per axle: longitudinal force eats the lateral budget, which is
  what makes the rear step out under power and lose grip under braking;
* weight transfer from longitudinal acceleration shifts the axle loads;
* the brake is split between axles (5900/3400 N) so neither exceeds its grip budget;
* engine braking on a closed throttle; no reverse gear;
* steering travel is limited by grip: at full deflection the demand is about a third
  above the tyres' limit, so a slide can be provoked but holding full lock does not
  spin the car;
* grass is 0.55 grip against 1.30 on asphalt, with six times the rolling resistance;
  the handbrake cuts rear grip to 28%;
* armco down both sides: restitution ≈ 0.35, scrub along the wall, yaw damping,
  sparks and a thump in the audio.

Measured by `node physics-test.js`: 0–100 km/h in 6.4 s, top speed 146 km/h, 108 km/h
to a stop in 45 m at an average 1.02 g, coasting 108 → 18 km/h in 12.8 s, full lock at
72 km/h pulls 1.22 g without spinning, a spin damps itself in 2.7 s.

## Lander physics

Metric too, same fixed 1/120 s step, extracted for the harness between the
`LANDER-CORE` markers:

* lunar gravity 1.62 m/s², dry mass 820 kg, 40 kg of fuel, 2950 N of thrust — a
  thrust-to-weight ratio of 2.12, so **half the pipka travel is a hover** (47%);
* the throttle is proportional to pressure, which is the entire point: a finger can hold
  47%, a key cannot;
* the horizontal axis commands rotation *rate*, which the attitude thrusters track with a
  torque limit, burning fuel in proportion;
* fuel burns at thrust over exhaust velocity (250 s specific impulse), and the lander gets
  livelier as the tank empties;
* hovering on the Moon is physically cheap — endurance scales with exhaust velocity over
  gravity — so the tank has to be small against the dry mass for fuel to be a real
  constraint at all. A nominal descent eats 21 kg of the 40.

Landing limits depend on what is under the legs: on a pad 2.5 m/s vertical, 1.2 m/s
lateral and 8° of tilt; on bare ground 0.85 m/s, 0.40 m/s and 3°, with no score
multiplier. The instrument panel shows whichever limits apply where you are, and the
Contact lamp lights a metre before touchdown, as the real lunar module's probes did.

## The circuit

Monza-flavoured: a 212 m main straight, Rettifilo, Curva Grande, Roggia, both Lesmos,
the Serraglio straight, the Ascari esses and a long Parabolica — 14 corners, 869 m,
12 m wide.

The centreline is not a spline but a **polygon with its corners filleted by arcs of a
given radius**: each corner's radius is explicit and the loop closes by construction.
A spline through control points was tried and dropped — its curvature peaks exactly at
the control points, which produced 5–8 m radii on a 10 m track, folding the inner edge
of the ribbon over itself.

Verified numerically before use: minimum radius 104 px (13 m, about 47 km/h through
Ascari 3), no two non-adjacent parts of the ribbon closer than 238 px against the 164 px
required, and the whole thing inside the 3200×2100 px world. The start/finish line is
placed on the middle of the main straight and kerbs are laid out from the sign of the
curvature.

## Sound

Everything is synthesised in WebAudio, no samples: the engine is a sawtooth plus a
square through a low-pass whose frequency and cutoff follow pseudo-revs; tyre squeal is
white noise through a band-pass with its gain driven by the **rear slip angle**, so it
comes in exactly when the back goes; grass rustle is the same noise through a low-pass,
by off-track speed; the armco impact is a noise burst plus a metallic ring, by the normal
component of the impact speed. The context is created on the start button (browsers
refuse it earlier) and suspended on pause.

## Developer's note

Per-game write-ups — what was asked, how the request turned into that game, what the
nub's character dictated and what shipped broken — are on the site hub (`index.html`),
in both languages. The short version:

| | Pipka Pilot | Pipka Circuit | Pipka Cosmonaut |
|---|---|---|---|
| Wall clock | 14 min | 59 min, two versions | 52 min |
| Tokens | ~76k | ~120k | ~55k |
| Code | 470 lines | 850 lines + 14 checks | 790 lines + 9 checks |
| Verified | syntax only | numerically | numerically, before publishing |
| Shipped broken | overlays never hid | ice, endless spin | nothing |
| Model | Opus 5 (`claude-opus-5`) | Opus 5 | Opus 5 |

The first two times what shipped broken was exactly what had not been measured. For the
third the harness existed before the first publish and caught two discrepancies — a
thrust-to-weight ratio of 3.12 where the design called for 2, and a tank four times a
nominal descent — before anyone saw them.

## License

[MIT](LICENSE).

## Repository conventions

Documentation comes in pairs (`README.md` / `README.ru.md`); game UI strings live in a
`TXT` dictionary with `ru` and `en` branches, applied through `data-i18n` attributes.
See [AGENTS.md](AGENTS.md) before changing anything.
