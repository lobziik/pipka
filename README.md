# Pipka Games

> «Играл с пипкой — проиграл» — *played with the pipka, lost the game.*

Browser games for the **TrackPoint**, the red nub between the G, H and B keys of a ThinkPad.
Here it goes by **pipka**, which is what the games are named after.

AI written, slop alert issued;

[Русская версия](README.ru.md) · Live site: GitHub Pages from the repository root,
open `/`.

## The idea

The pipka reports **pressure**, not position: there is a strain gauge inside and the
pointer moves faster the harder your finger pushes. It is a miniature control stick that
returns to zero by itself when released. The games are built around that: where an
ordinary game reads cursor position, they read force. In the browser that is Pointer
Lock: relative `movementX/Y` deltas divided by frame time give the pointer speed in px/s,
proportional to pressure, and an exponential filter turns it into a stick deflection of
−1…+1. What a game does with that force — a rate, a draw, a flick, a direction at the
moment of release — is the open question the games explore.

The slider under every game sets the pressure that counts as full deflection. Pipkas
differ in stiffness between ThinkPads, so the value is per machine and remembered in the
browser. The pipka's own system speed is separate:

```sh
xinput list                                      # find "TPPS/2 ... TrackPoint"
xinput set-prop <id> "libinput Accel Speed" 0.4
```

## Games

| | |
|---|---|
| [**Pipka Pilot**](plane/) | A night slalom where the plane is steered, not pushed: two integrations between finger and flight path. |
| [**Pipka Circuit**](race/) | Monza on a nub: armco, tyre squeal from the rear slip angle, and no reverse gear on principle. |
| [**Pipka Cosmonaut**](moon/) | A lunar landing where half the pipka travel is a hover and the tank is sized so that it is never quite enough. |
| [**Pipka Danmaku**](danmaku/) | Almost Touhou: procedural waves, and every ninth one is Cirno, ⑨ as it should be. |
| [**Pipka Ladybird**](ladybird/) | For a three-year-old: you cannot lose, and a palm on the keyboard is a balloon. |
| [**Pipka Letters**](letters/) | The ladybird learns to read: letters in order, sounds from a generated voice, statistics for the parent. |
| [**Pipka Féerie**](feerie/) | A tunnel that dreams itself: mandalas with slits, notes as beads of light, and game over is called dawn. |
| [**Pipka Catapult**](catapult/) | Orks in 3D: the pipka cranks the winch, tension is range, and red ones go faster. |

## Documentation

* **The hub** (`index.html`) — the site: a contents table with time, tokens and model per
  game, and a tab per game with what was asked, how it became that game and what went
  wrong.
* **`<game>/README.md`** — the details of one game: controls, models, numbers, checks.
* **`<game>/card.js`** — that game's tab on the hub: the request, the story, the metrics.
* **[AGENTS.md](AGENTS.md)** — rules for whoever changes anything here, agent or human:
  the layout, what each document must contain, the hard rules of the games.

No dependencies and no build step: every game is one HTML file that opens straight from
disk.

```sh
setsid -f xdg-open index.html >/dev/null 2>&1   # or just open it in a browser
node physics-test.js                              # the car, lander and catapult models
```

`setsid -f` keeps Ctrl-C in the terminal from killing the browser (in zsh, `&!` works too).

## License

[MIT](LICENSE).

---

```
FUTURE GADGET #%&?: PIPKA-GAMES
STATUS: OPERATIONAL
DIVERGENCE: ██████ (WITHIN-TOLERANCE)

AI wrote games. Human applied pressure. Pressure measured in px/s.

AI inventing design rules. No human ask issued. Revoked.
```
