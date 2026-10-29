# Pipka Letters

The ladybird copied with letters: a word on top, letters in order, a timer and statistics for the grown-up.

[Русский](README.ru.md) · [Play](index.html) · How it came about — in its tab on the [hub](../index.html#letters), text in [`card.js`](card.js)

## Controls

Shared: the play field captures the pointer, `Esc` pauses, arrow keys are a fallback,
the slider at the bottom sets pipka sensitivity, and the `EN`/`RU` button switches
language (the choice is shared across the site through `localStorage`).

Controls as in the ladybird; fly to the word's letters in order. A key
launches a balloon carrying that key's letter (the Balloons setting below the field: with
letters, without — as in the ladybird — or off; the choice is remembered), the buttons under the space bar repeat the
word. Word level, voice and statistics are in the bar below the field.

## How it works

A copy of the ladybird, not a mode of it. The whole word is at the top as tiles; every bud
carries a letter. Collection is in order: the right letter blooms and flies to its place,
a wrong one shakes its head. Notes go by position in the word, so a collected word plays a
rising pentatonic, and repeated letters (MAMA) are interchangeable. A finished word is read:
letter by letter with a note and the voice, then whole, then the celebration and a butterfly
for the flock — by the ladybird's rule: at most eight, the ninth scatters it.

The pull goes only towards the right letter (130 px, 1.5 times as far for the word's last
two letters). A miss is not touching a wrong letter but stopping on it: below 60 px/s for
half a second running; flying straight through, even at half speed, takes about a second.
After a miss, or six seconds without input, the right letter waves and names itself.

Levels: 1 — short words, letters left to right in reading order; 2 — the same, scattered;
3 — plus one extra letter not in the word; 4 — longer words and two extras. The first word
is MAMA (MOM in English). A balloon's letter comes from the physical key and the game's
language, not the current keyboard layout.

The voice is off by default and switched on with the Voice button below the field (the
choice is remembered). It is first of all recordings generated with Gemini TTS (`gemini-3.8-flash-tts`):
identical on every machine, independent of the system. The dictionary is
`letters/words.js` (words, alphabet and how each letter sounds: Russian ones as sounds,
as in a primer, М is "mmm" and П a bare "p"; the hard and soft signs are named; English
ones are still names). The voice settings are `letters/voice-settings.json`: per language
a Gemini voice, the language and pronunciation (`Russian (ru-RU)`, `English (en-GB)` in
British RP — without them the generator pulled Russian letters towards English
pronunciation) and a delivery style each for letters, words and praise. The generator
has no dependencies beyond node and ffmpeg:

```sh
export GEMINI_API_KEY=...                      # key from Google AI Studio
node letters/make-voice.mjs --dry              # what would be generated
node letters/make-voice.mjs                    # both languages → letters/voice-ru.js, voice-en.js
node letters/make-voice.mjs --lang en --only letter --force  # redo the letter batch
node letters/make-voice.mjs --recut            # re-cut and re-encode from the cache, no API
```

Voicing goes in batches: all letters as one long recording separated by `<long pause>`,
words as two, praise as one. One letter per request made the style wander: each letter
was born afresh. The recording is cut into exactly as many pieces as there are items, at
the longest pauses, so the gap inside "твёрдый знак" or the closure before a "t" never
becomes a cut. A doubtful cut (two items run together) gets a warning; too few pauses (an
item skipped) and the batch is not written. Loudness is evened out with one gain per
batch, not per clip, silence trimmed from both ends, everything encoded to Opus at
32 kbit/s — about 300 KB per language. Change one letter and the whole letter batch is
redone, or it would come from a different take again; raw batch recordings stay in
`letters/.voice-cache/` (git-ignored). The
recordings come first in the voice list next to the Voice button; music ducks while the
voice speaks. While recordings are in use the system voice is never mixed in: no clip
means silence (otherwise a soft sign off the keyboard spoke in espeak in the middle of the
proper voice). A system voice chosen before recordings existed does not override them.
Reading letter by letter waits for each letter to finish.

The fallback is the system `speechSynthesis`; with neither recordings nor a system voice
the game stays quiet and the button reads "Voice: none on system". On Linux both Chromium and Firefox get their voices from `speech-dispatcher`; without
it there are none:

```sh
sudo pacman -S speech-dispatcher rhvoice-voice-anna rhvoice-voice-elena   # Arch, official repos
pkill speech-dispatcher                             # respawns on its own and finds the rhvoice module
spd-say -o rhvoice -L                               # voices the module offers
spd-say -o rhvoice -y Anna -l ru 'мама'             # check outside the browser
```

espeak-ng works too but sounds robotic; RHVoice is far more human in Russian, the female
voices being anna, elena, irina, tatiana, victoria and arina. Restart the browser after
installing; Chromium may also need `--enable-speech-dispatcher` (on Arch, a line in
`~/.config/chromium-flags.conf`). When a language has several voices a list appears next
to the Voice button; by default the game puts espeak and mbrola last, and a chosen voice
says the current word at once and is remembered per language.

Statistics are for the grown-up, under `pipka.letters.stats` in `localStorage`, separately
per language. Word time only runs in flight, not in pause or celebration. The statistics
window has today and all time, average and best time per word, accuracy (letters collected
against misses), a letter table in alphabet order (times collected, average search time,
misses while it was wanted), "wanted — stopped on" pairs and the last 20 words (200 kept).

Checked by a bot in headless Chromium: flying straight at the right letter collects a short
word in 3–6 s and a long one with two extras in 4–8 s; a random one takes 12–169 s on level
one (median about 80), about 100 on level three. Batch voicing is checked only in mock
mode, with tones instead of speech: cutting, the cache, decoding and the queue in the game.
The `make-voice.mjs` commands above run from the repository root.
