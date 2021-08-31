const gameTitle = "SPACE JAM";

export function getStartScreen() {
  return [
    "Welcome to the",
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

        ctx.fillText(text, this.width / 4, line.y);
      };
    })(),
    "",
    "",
    "",
    ["Touch to start!"],
    [
      "(The game will ask for access to your audio system!)",
      { footer: true, fontSize: 8 },
    ],
  ];
};
