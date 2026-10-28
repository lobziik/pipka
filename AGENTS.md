# AGENTS.md

Guidance for agents and humans working in this repository.
Руководство для агентов и людей, работающих в этом репозитории.

## Layout

```
index.html         site hub, bilingual, per-game developer notes
plane/index.html   Pipka Pilot      — self-contained game
race/index.html    Pipka Circuit    — self-contained game
moon/index.html    Pipka Cosmonaut  — self-contained game
danmaku/index.html Pipka Danmaku    — self-contained game
ladybird/index.html Pipka Ladybird  — self-contained game, for a three-year-old
letters/index.html Pipka Letters    — copy of the ladybird with letters, words and parent stats
letters/words.js   word lists and letter pronunciation, read by the game and the generator
letters/make-voice.mjs  Gemini TTS generator: voice-settings.json + words.js → voice-ru.js, voice-en.js
physics-test.js    model harness for the car and the lander (node, no deps)
LICENSE            MIT
README.md          English
README.ru.md       Russian
.nojekyll          GitHub Pages serves the files as they are
```

Every HTML file is a complete standalone document. There is **no build step, no bundler
and no dependencies**. The only external resource is the Google Fonts stylesheet. Keep it
that way: these pages are meant to run from `file://` on a fifteen-year-old laptop.

The one exception is `letters/`, which loads `words.js` and the generated `voice-ru.js` /
`voice-en.js` through plain `<script src>` (fetch does not work from `file://`). The game
must keep running when any of them is missing: a short built-in word list, then the
system speech synthesiser, then silence. The voice files are output of
`make-voice.mjs`, never edited by hand. Clips are voiced in batches (all letters in one
request, separated by `<long pause>`, then cut at the n−1 longest pauses), because one
request per letter gave a different delivery each time; keep it that way. Each batch is
hashed over model, voice, language, pronunciation, style and every text in it, so a
rerun regenerates only changed batches, always whole. Language and pronunciation are
per language in `voice-settings.json` — never hard-code one language's accent into the
shared prompt. Raw batches are cached in `letters/.voice-cache/` (git-ignored);
`--recut` re-cuts them without the API. `PIPKA_TTS_MOCK=1` runs the whole pipeline
without the API, with tones instead of speech — do not commit its output.

## Hard rules

1. **Run the physics harness after touching either model.**
   `node physics-test.js` — all checks must pass. It extracts the models straight out of
   the games: the car from `race/index.html` between `PHYSICS-CORE-BEGIN` /
   `PHYSICS-CORE-END`, the lander from `moon/index.html` between `LANDER-CORE-BEGIN` /
   `LANDER-CORE-END`. Test and game therefore cannot drift apart. Do not move those
   markers, and keep `carStep` and `landStep` dependent on nothing outside their constants
   (`CAR`, `LAND`) and their arguments — no DOM, no terrain, no track data.

   The lander's balance in particular is set by measurement: thrust is chosen so that the
   thrust-to-weight ratio is ~2 (half the pipka travel hovers), and the tank is sized at
   roughly 2.5× the fuel a nominal automated descent consumes. Both are asserted.

2. **No reverse gear in the car.** It was removed on purpose: on a two-axis pressure
   control, "back" is already the brake, and distinguishing braking from reversing needs
   state the finger cannot feel. Getting off the armco is the `R` key. Do not add it back
   without being asked.

3. **Track geometry is validated numerically, not by eye.** The centreline is a polygon
   (`POLY` in `race/index.html`) whose corners are filleted by arcs of an explicit radius.
   If you change it, re-check: minimum corner radius must exceed the barrier offset
   `BAR = HALF + 26` with margin (currently 104 px against 74), non-adjacent parts of the
   ribbon must stay at least `2*BAR + 16` apart, and the whole loop must fit inside
   `WORLD_W × WORLD_H` with a `BAR + 10` margin. A corner radius below `BAR` folds the
   inner edge of the ribbon over itself and breaks barrier collision, which maps position
   to a signed lateral offset from the centreline and assumes that mapping is
   single-valued.

4. **Both language branches must exist.** UI strings live in the `TXT` object
   (`ru` / `en`) and are applied by `applyLang()` through `data-i18n` (textContent),
   `data-i18n-html` (innerHTML, for strings containing `<b>`) and `data-i18n-title`.
   A key added to one branch and not the other silently falls back to Russian.
   Documentation changes land in both READMEs.

5. **`[hidden]` needs an explicit rule.** Every page carries
   `[hidden]{display:none!important}`. Without it, author rules such as `.ov{display:flex}`
   override the browser's default for the `hidden` attribute and overlays stack up
   invisibly. This has already shipped as a bug once.

## Input model

Both games read the TrackPoint as a force stick, not a pointer:

* Pointer Lock is requested on the start button; `mousemove` deltas are accumulated and
  divided by the frame time to get px/s, which is proportional to nub pressure.
* An exponential filter (τ = 60–70 ms) turns that into a deflection of −1…+1.
* The sensitivity slider is the px/s that counts as full deflection. It is per-machine
  and lives in `localStorage`; never hard-code it.
* Deflection commands a *rate* (bank rate, yaw rate), never a position. This is the whole
  point of the project — an isometric control paired with rate control.

## Simulation

* Fixed timestep `FIX = 1/120 s`, with the frame's elapsed time accumulated and spent in
  whole steps (`guard` caps the catch-up at 12 substeps). Do not integrate on raw `dt`.
* Physics is in metres and newtons; rendering multiplies by `PX = 8` px/m.
* The world is pre-rendered once into an offscreen canvas and blitted per frame by the
  visible rectangle. Tyre marks are painted into that same canvas, so they persist and
  cost nothing per frame. Re-baking (`bakeTrack()`) is only done on start.

## Publishing

GitHub Pages serves the repository root as-is. For claude.ai artifacts the platform adds
its own document skeleton, so a fragment is derived by stripping the wrapper:

```sh
sed -e '/^<!doctype html>$/d' -e '/^<html lang="ru">$/d' -e '/^<\/html>$/d' \
    -e '/^<head>$/d' -e '/^<\/head>$/d' -e '/^<body>$/d' -e '/^<\/body>$/d' \
    -e '/^<meta charset="utf-8">$/d' race/index.html > pipka-track.html
```

The local files stay the source of truth; the fragment is generated, never edited.

## Style

Russian comments in the game sources, matching the existing density: explain *why* a
constant has the value it has (what it was measured against), not what the line does.
Game display names are the Russian ones with an English pair in the `TXT` dictionary; the
device is a TrackPoint, called the *pipka* in both languages.
Keep prose in the READMEs and on the hub plain and specific; the developer notes on the
hub are first-person and name what went wrong.
