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
      zzfx(...[1.02,,473,.01,.11,.52,,1.84,-1.6,.1,-412,.07,,,15,,.01,.69,,.02]); // Powerup 9 - Mutation 3
      game.add(player.clone(x));
      pad.ttl = 0;
    } else {
        if(pad.parent.type === 'trampoline') {
            zzfx(...[,,916,.02,1.18,.15,2,1.09,7.1,,,,,,,,,.9,.07]); // Jump 115
        } else {
            zzfx(...[,,153,.03,.04,.11,1,.82,9,,,,,,,,,.92,.07]); // Jump 16
        }
      player.jump(pad);
    }
  });
}
