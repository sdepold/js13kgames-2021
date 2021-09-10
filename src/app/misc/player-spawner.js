import { sub } from "../pubsub";

export function isLastPlayerSprite(game) {
  const playerSprites = game.getSprites().filter((s) => s.type === "player");

  return playerSprites.length === 1;
}

export function observePlayerSpawning(game) {
  sub("collision", (args) => {
    const pad = args.with;
    const player = args.player;

    if (pad.type === "splitter") {
      let x = 0;

      while (Math.abs(x) < 10) {
        x = -25 + Math.random() * 50;
      }

      game.add(player.clone(x));
      pad.ttl = 0;
    } else {
      player.jump(pad);
    }
  });
}
