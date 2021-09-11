import Scene from "../scene";
import { getGameTitle } from "./game-title";
import { Mascot } from "./octopus";

export function getStartScreen(callback) {
  let clicked = false;
  const mascot = new Mascot();

  return new Scene(
    [
      (ctx, canvas, line) => {
        mascot
          .getSprites()
          .filter((s) => s.isAlive())
          .forEach((s) => {
            s.update();
            s.render();
          });
      },
      "Welcome to",
      getGameTitle(),
      "",
      "",
      "",
      ["Touch to start!", { pulsate: true }],
      ["(The game requests device access!)", { footer: true, fontSize: 8 }],
    ],
    () => {
      if (!clicked) {
        clicked = true;
        callback();
      }
    },
    {
      fontSize: 14,
      lineHeight: 30,
    }
  );
}
