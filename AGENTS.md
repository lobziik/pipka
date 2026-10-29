# AGENTS.md

Guidance for agents and humans working in this repository.
Руководство для агентов и людей, работающих в этом репозитории.

This repository is written by AI from chat requests and is practically not edited by
hand. Treat the documentation as part of the deliverable: a game without its README pair
and its card is not finished.

## Layout

```
index.html          the hub: tabs — contents table plus one tab per game, built from */card.js
README.md           what the repository is: the idea, the game list, where the docs are
README.ru.md        the same in Russian
AGENTS.md           this file
physics-test.js     model harness for the car, the lander and the catapult (node, no deps)
LICENSE             MIT
.nojekyll           GitHub Pages serves the files as they are
.gitignore

<game>/             one folder per game: plane, race, moon, danmaku, ladybird, letters,
                    feerie, catapult
  index.html        the game — a complete standalone document
  README.md         details of this game, English
  README.ru.md      the same, Russian
  card.js           this game's tab on the hub: request, story, metrics, thumbnail
  ...               extra files only when the game needs them (letters: words.js,
                    voice-settings.json, make-voice.mjs, generated voice-ru.js / voice-en.js)
```

There is **no build step, no bundler and no dependencies**. The only external resource is
the Google Fonts stylesheet. Keep it that way: these pages are meant to run from `file://`
on a fifteen-year-old laptop. That is also why every sidecar file is loaded with a plain
`<script src>` and never with `fetch`: `fetch` does not work from `file://`.

## Documentation

Everything comes in pairs, English and Russian, and both are updated in the same change.

### Root README (`README.md` / `README.ru.md`)

Only what the repository is, kept short:

* the pipka and why the games read pressure, not position;
* that the code is written by AI and practically not touched by hand, and that each game
  is a slop one-shot — one request, one game in one sitting, with an honest record;
* the list of games: name, link to its folder, one sentence (may be funny);
* where the documentation lives (hub, game README, card, this file);
* how to run, licence;
* at the very bottom, after `---`, the `FUTURE GADGET` lab-note block in a code fence, as
  in the author's other repositories. It is the author's own: never edit it, not even to
  add a line for a new game.

No game details in the root README: controls, models, numbers and checks go to the game's
own README. Adding a game means one row in the root list, nothing more.

### Game README (`<game>/README.md` / `README.ru.md`)

The details of one game, for someone about to change it:

* title, one-line outline, links: the other language, `index.html`, the hub tab
  (`../index.html#<game>`) and `card.js`;
* controls: the shared paragraph plus this game's own;
* how it works: models, constants and *what they were measured against*, generated
  content, sound, persistence keys in `localStorage`;
* checks: what verifies it (`physics-test.js`, bot runs in headless Chromium) and the
  measured numbers; state plainly what has not been checked.

The story of how the game came about does not go here; it goes into the card.

### Card (`<game>/card.js`)

The game's tab on the hub. It is a script, not an HTML fragment, because the hub opens
from `file://` too. Format:

```js
(window.PIPKA_CARDS=window.PIPKA_CARDS||{})["<game>"]={
 order:7, play:"<game>/index.html",
 thumb:{viewBox:"0 0 300 190", svg:`<inline SVG body>`},
 ru:{title:"Пипка-…", kicker:"…", time:"~40 мин", tokens:"~150k", model:"Opus 5.5",
  body:`…HTML…`},
 en:{title:"Pipka …", kicker:"…", time:"~40 min", tokens:"~150k", model:"Opus 5.5",
  body:`…HTML…`}};
```

`title`, `kicker`, `time`, `tokens` and `model` also feed the contents table on the hub,
so they must be short and present in both languages; an unknown value is `"—"`, never a
guess. The `body` is trusted HTML in the hub's classes, in this order:

1. `<blockquote>` with the **request**, verbatim, `<cite>Заказ</cite>` /
   `<cite>The brief, translated</cite>`;
2. `<h3>Так родилась игра</h3>` / `How the game came out of it` — **how the game came
   about**: how the request turned into this game, what the pipka's character dictated,
   the main design decisions and what they were measured against;
3. `<h3>Что пошло не так</h3>` / `What went wrong` — what broke, what shipped broken, what
   a live person found that the checks did not, and what is still unchecked. First
   person, specific, no excuses;
4. `<dl class="stats">` — the **metrics**: time (wall clock, and over how many sittings),
   tokens, code size, how it was verified, model (name and id). These are the record of
   the one-shot; fill them honestly, and when a game is reworked later, say so in the
   metrics rather than silently restating them.

No backticks and no `${` inside `body` or `svg`: they are template literals.

### Hub (`index.html`)

The hub has no game content of its own: the contents table and every game tab are built
by its script from `window.PIPKA_CARDS`. Its own text is only the lede about the pipka,
"What this taught" and "Run it yourself", in both languages. The open tab lives in the
URL hash (`#race`), so a link can point at one game.

### Adding a game

1. `<game>/index.html`, following the hard rules below;
2. `<game>/README.md` and `README.ru.md`;
3. `<game>/card.js` with the next `order`;
4. one `<script src="<game>/card.js">` line in `index.html`, in order;
5. one row in the games list of both root READMEs;
6. this file's layout, if the game brings extra files or rules.

## Hard rules

1. **Run the physics harness after touching either model.**
   `node physics-test.js` — all checks must pass. It extracts the models straight out of
   the games: the car from `race/index.html` between `PHYSICS-CORE-BEGIN` /
   `PHYSICS-CORE-END`, the lander from `moon/index.html` between `LANDER-CORE-BEGIN` /
   `LANDER-CORE-END`, the catapult from `catapult/index.html` between
   `CATAPULT-CORE-BEGIN` / `CATAPULT-CORE-END`. Test and game therefore cannot drift
   apart. Do not move those markers, and keep `carStep`, `landStep`, `armStep` and
   `projStep` dependent on nothing outside their constants (`CAR`, `LAND`, `CAT`, `AMMO`)
   and their arguments — no DOM, no terrain, no track or fort data.

   The lander's balance in particular is set by measurement: thrust is chosen so that the
   thrust-to-weight ratio is ~2 (half the pipka travel hovers), and the tank is sized at
   roughly 2.5× the fuel a nominal automated descent consumes. Both are asserted.

   The catapult's torsion energy is linear in tension, so range is nearly linear in it
   (1% ≈ 1.4 m); the harness asserts that, energy conservation of the arm, and that the
   farthest fort (`FORT.D` cap in `genLevel`, 132 m) is reachable by a rock against the
   strongest wind. Change the cap and the harness together.

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
   A key added to one branch and not the other silently falls back to Russian. The same
   goes for cards (`ru` / `en`) and README pairs.

5. **`[hidden]` needs an explicit rule.** Every page carries
   `[hidden]{display:none!important}`. Without it, author rules such as `.ov{display:flex}`
   override the browser's default for the `hidden` attribute and overlays stack up
   invisibly. This has already shipped as a bug once.

6. **Sidecar files are optional at runtime.** A game that loads extra scripts must keep
   working when they are missing. `letters/` falls back from `words.js` to a short
   built-in word list, and from the recorded voice to the system speech synthesiser to
   silence — but never mixes recorded and system voices.

7. **Generated files are never edited by hand.** `letters/voice-*.js` is output of
   `letters/make-voice.mjs`. Clips are voiced in batches — all letters in one request
   separated by `<long pause>`, then cut at the n−1 longest pauses — because one request
   per letter gave a different delivery each time; keep it that way. Each batch is hashed
   over model, voice, language, pronunciation, style and every text in it, so a rerun
   regenerates only changed batches, always whole. Language and pronunciation are per
   language in `voice-settings.json` — never hard-code one language's accent into the
   shared prompt. Raw batches are cached in `letters/.voice-cache/` (git-ignored);
   `--recut` re-cuts them without the API. `PIPKA_TTS_MOCK=1` runs the whole pipeline with
   tones instead of speech — never commit its output.

## Input model

Every game reads the TrackPoint as a force stick, not a pointer:

* Pointer Lock is requested on the start button; `mousemove` deltas are accumulated and
  divided by the frame time to get px/s, which is proportional to nub pressure.
* An exponential filter (τ = 60–70 ms; 120 ms in the children's games, where the finger
  jabs) turns that into a deflection of −1…+1.
* The sensitivity slider is the px/s that counts as full deflection. It is per-machine
  and lives in `localStorage`; never hard-code it.
* What the deflection drives is not fixed. The project explores the pipka: rate control
  (bank, yaw, velocity), drawing and releasing, flicks, the direction of a press — any of
  them. When a brief describes a gesture, build that gesture. (An earlier version of this
  file required rate control everywhere; that rule was written by an AI, not by the
  author, and is withdrawn.)

## Simulation

* Fixed timestep `FIX = 1/120 s`, with the frame's elapsed time accumulated and spent in
  whole steps (`guard` caps the catch-up at 12 substeps). Do not integrate on raw `dt`.
* Physics is in metres and newtons; rendering multiplies by `PX = 8` px/m.
* The world is pre-rendered once into an offscreen canvas and blitted per frame by the
  visible rectangle. Tyre marks are painted into that same canvas, so they persist and
  cost nothing per frame. Re-baking (`bakeTrack()`) is only done on start.

## Verification

State what was checked and how, in the game README and in the card's metrics. The
established ways are the physics harness, a bot driving the game in headless Chromium
through its `#test` hook (or real input events through the DevTools protocol), and
screenshots looked at closely, not whole. Headless Chromium has no speech synthesiser and
no ears: anything audible is unchecked until a person has heard it, and the docs say so.

## Publishing

GitHub Pages serves the repository root as-is; unfinished work goes on a branch, because
`master` is the live site. For claude.ai artifacts the platform adds its own document
skeleton, so a fragment is derived by stripping the wrapper:

```sh
sed -e '/^<!doctype html>$/d' -e '/^<html lang="ru">$/d' -e '/^<\/html>$/d' \
    -e '/^<head>$/d' -e '/^<\/head>$/d' -e '/^<body>$/d' -e '/^<\/body>$/d' \
    -e '/^<meta charset="utf-8">$/d' race/index.html > pipka-track.html
```

The local files stay the source of truth; the fragment is generated, never edited. A game
with sidecar files (`letters/`) publishes them alongside the page.

## Style

Russian comments in the game sources, matching the existing density: explain *why* a
constant has the value it has (what it was measured against), not what the line does.
Game display names are the Russian ones with an English pair in the `TXT` dictionary; the
device is a TrackPoint, called the *pipka* in both languages.
Keep prose in the READMEs and on the hub plain and specific; the stories in the cards are
first-person and name what went wrong.
