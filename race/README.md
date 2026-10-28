# Pipka Circuit

A Monza-flavoured circuit: armco, tyre squeal, sound.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#race), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

Left/right steers (travel tightens with speed), forward is throttle,
back is the brake, `Space` is the handbrake, `R` puts you back on the track.
There is no reverse gear: on a two-axis control "back" is already the brake, and
telling braking from reversing needs a piece of state the finger cannot feel.

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

## Checks

```sh
node physics-test.js    # from the repository root: the car model, 14 checks
```

The model is cut straight out of `index.html` between the `PHYSICS-CORE-BEGIN` / `PHYSICS-CORE-END` markers, so the harness and the game cannot drift apart.
