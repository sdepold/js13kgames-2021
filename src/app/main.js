import { collides, GameLoop, getContext, init, initKeys } from "kontra";
import { initAudio, playMusic } from "./audio";
import { initDeviceControl } from "./device-control";
import Background from "./entities/background";
import Level from "./entities/level";
import Player, { GAME } from "./entities/player";
import Rocket from "./entities/rocket";
import Game from "./game";
import { setCanvasSize } from "./misc/helper";
import { observePlayerSpawning } from "./misc/player-spawner";
import Score from "./misc/score";
import { pub, sub } from "./pubsub";
import { getEndScreen } from "./scenes/end-screen";
import { getStartScreen } from "./scenes/start-screen";

setCanvasSize();
init();
initKeys();
playMusic();

const game = new Game();
const player = new Player(game);
const rocket = new Rocket({
  onDestinationReached() {
    game.add(player);
    player.leaveRocket(rocket);
    setTimeout(() => {
      game.remove(rocket);
    }, 20000);
  },
});

game.loaded = true;

let level;
const score = new Score();
const startScreen = getStartScreen(async () => {
  const initGame = () => {
    level = new Level();

    startScreen.hide();
    game.add(level);
    pub("game:start");
  };

  console.log("Init device control...");
  await initDeviceControl();

  console.log("Init game...");
  initGame();
});
game.add(new Background());
game.add(startScreen, 12);
game.add(rocket);
game.add(score);

sub("player:death", (player) => {
  game.add(getEndScreen(score.score), 13);
});

observePlayerSpawning(game);

GameLoop({
  update() {
    if (level && player && player.state === GAME) {
      const playerSprite = game
        .getSprites()
        .filter((s) => s.type === "player");

      level.getSprites().forEach((pad) => {
        playerSprite.forEach((playerSprite) => {
          
          if (collides(playerSprite, pad)) {
            pub("collision", { with: pad, player: playerSprite.player });
          }
        });
      });
    }
    game.getSprites().forEach((sprite) => sprite.update && sprite.update());
  },
  render() {
    const ctx = getContext();

    game.getSprites().forEach((sprite) => {
      ctx.save();
      ctx.scale(2, 2);
      sprite.render();
      ctx.restore();
    });
  },
}).start();
