const GAME_TITLE = "SPACE JELLY";

export function getGameTitle() {
  let text = GAME_TITLE;
  let lastShuffle = new Date();
  let delta = 2000;

  return function (ctx, canvas, line) {
    if (new Date() - lastShuffle > delta) {
      text = text
        .split("")
        .sort(() => (Math.random() > 0.5 ? -1 : 1))
        .join("");
      if (Math.random() < 0.2) {
        text = GAME_TITLE;
      } else if (Math.random() > 0.8) {
        text = GAME_TITLE;
      }
      lastShuffle = new Date();
      delta = 250;
    }

    this.context.font = `20px Marker Felt`;
    ctx.fillText(text, this.width / 4, line.y);
  };
}
