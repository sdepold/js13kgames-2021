import Scene from "../scene";

export function getEndScreen(player) {
  return new Scene(
    [
      "Oh noez :(",
      "",
      ["You died!", { fontSize: 20 }],
      "",
      "",
      "",
      [`Your score: ${player.score}`, { fontSize: 20 }],
      ["Press to restart!", { footer: true }],
    ],
    () => {
      document.location.reload();
    }
  );
}
