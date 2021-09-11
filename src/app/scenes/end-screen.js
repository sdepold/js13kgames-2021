import Scene from "../scene";
import { getGameTitle } from "./game-title";
import { Mascot } from "./octopus";

export function getEndScreen(score) {
  const tweetText = "Tell the world";
  const mascots = [
    new Mascot({ width: 40, height: 50 }),
    new Mascot({ width: 40, height: 50, origin: "left" }),
  ];

  return new Scene(
    [
      (ctx, canvas, line) => {
        mascots.forEach((mascot) =>
          mascot
            .getSprites()
            .filter((s) => s.isAlive())
            .forEach((s) => {
              s.update();
              s.render();
            })
        );
      },
      ["Thanks for playing", { fontSize: 10 }],
      getGameTitle(),
      "",
      ["Final score"],
      [score, { fontSize: 26 }],
      [tweetText, { fontSize: 10 }],
      ["Press to restart!", { footer: true }],
    ],
    (line) => {
      if (line && line.text === tweetText) {
        const a = document.createElement("a");
        a.href = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fjs13kgames.com%2Fentries%2Fspace-jelly&via=sdepold&text=I%20scored%20${score}%20points%20at%20Space%20Jelly%21&hashtags=js13k`;
        a.style.position = "absolute";
        a.style.top = "-1000px";
        a.target='_blank';
        document.body.appendChild(a);
        a.click();
      } else {
        document.location.reload();
      }
    },

    {
      fontSize: 14,
      lineHeight: 30,
    }
  );
}
