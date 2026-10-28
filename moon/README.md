# Pipka Cosmonaut

Lunar landing: analogue throttle, fuel, contact lamp.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#moon), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

Forward/back is the throttle (half travel is a hover),
left/right commands rotation rate, `R` aborts the approach. On a pad the margins are
2.5 m/s down, 1.2 m/s sideways and 8° of tilt; bare ground will take you too, but three
times tighter (0.85, 0.40 and 3°) and without the pad's score multiplier.

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

## Checks

```sh
node physics-test.js    # from the repository root: the lander model alongside the car
```

The model is cut straight out of `index.html` between the `LANDER-CORE-BEGIN` / `LANDER-CORE-END` markers. The thrust-to-weight ratio (~2) and the tank (~2.5 nominal descents) are assertions in the harness, not comments.
