import Scene from "../scene";

export function getEndScreen(score) {
  const tweetText = "Tell the world";
  return new Scene(
    [
      "Thanks for playing",
      ["SPACE JELLY", { fontSize: 20 }],
      "",
      ["Final score: " + score, { fontSize: 16 }],
      "",
      "",
      ["Try again", { fontSize: 18 }],
      [tweetText, { fontSize: 10 }],
      ["Press to restart!", { footer: true }],
    ],
    (line) => {
      if (line && line.text === tweetText) {
        window.open(
          `https://twitter.com/intent/tweet?url=https%3A%2F%2Fjs13kgames.com%2Fentries%2Fspace-jelly&via=sdepold&text=I%20scored%20${score}%20points%20at%20Space%20Jelly%21&hashtags=js13k`,
          "game",
          "width=800,height=600"
        );
      } else {
        document.location.reload();
      }
    }
  );
}
