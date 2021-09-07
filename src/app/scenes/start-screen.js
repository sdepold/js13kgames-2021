import Scene from "../scene";

const gameTitle = "SPACE JUMP";

export function getStartScreen(callback) {
  return new Scene(
    [
      "Welcome to",
      (() => {
        let text = gameTitle;
        let lastShuffle = new Date();
        let delta = 2000;

        return function (ctx, canvas, line) {
          if (new Date() - lastShuffle > delta) {
            text = text
              .split("")
              .sort(() => (Math.random() > 0.5 ? -1 : 1))
              .join("");
            if (Math.random() < 0.2) {
              text = gameTitle;
            } else if (Math.random() > 0.8) {
              text = gameTitle;
            }
            lastShuffle = new Date();
            delta = 250;
          }

          this.context.font = `20px Marker Felt`;
          ctx.fillText(text, this.width / 4, line.y);
        };
      })(),
      "",
      "",
      "",
      ["Touch to start!", { pulsate: true }],
      [
        "(The game will ask for audio + control access!)",
        { footer: true, fontSize: 8 },
      ],
    ],
    callback,
    {
      fontSize: 14,
      lineHeight: 30,
    }
  );
}
