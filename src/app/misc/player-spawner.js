import { sub } from "../pubsub";

export function isLastPlayerSprite(game) {
  const playerSprites = game.getSprites().filter((s) => s.type === "player");

  return playerSprites.length === 1;
}

export function observePlayerSpawning(game) {
  sub("collision", (args) => {
    const pad = args.with;
    const player = args.player;

    if (pad.type === "splitter" && isLastPlayerSprite(game)) {
      game.add(player.clone(-50));
      game.add(player.clone(50));
    }
  });

  sub("collision", (args) => {
    const pad = args.with;
    const player = args.player;

    player.jump(pad);
  });
}
