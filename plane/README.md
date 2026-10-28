# Pipka Pilot

Night slalom: bank, inertia, gates.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#plane), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

Left/right banks, forward/back is throttle.

## How the pipka is read

The input model shared by every later game started here. The field requests Pointer Lock,
`mousemove` accumulates relative deltas divided by frame time — pointer speed in px/s,
which on a TrackPoint is proportional to pressure. An exponential filter (τ = 70 ms) turns
the ragged event stream into a stick deflection of −1…+1, and the slider sets how many
px/s count as full deflection.

Deflection commands bank, not drift, and bank gives lateral acceleration: two
integrations between finger and flight path, so the plane has to be led ahead.
