import { collides, GameLoop, getContext, init, initKeys } from "kontra";
import { initAudio } from "./audio";
import Background from "./entities/background";
import Player, { GAME } from "./entities/player";
import Rocket from "./entities/rocket";
import Game from "./game";
import Level from "./entities/level";
import Scene from "./scene";
import { getStartScreen } from "./scenes/start-screen";
import { setCanvasSize } from "./misc/helper";
import Score from "./misc/score";
import { initDeviceControl } from "./device-control";
import { sub } from "./pubsub";
import { getEndScreen } from "./scenes/end-screen";

setCanvasSize();
init();
initKeys();

const game = new Game();
const player = new Player();
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
const startScreen = new Scene(
  getStartScreen(),
  async () => {
    const initGame = () => {
      level = new Level();

      startScreen.hide();
      game.add(level);
    };
    console.log("Init audio...");
    await initAudio();
    console.log("Init device control...");
    await initDeviceControl();
    console.log("Init game...");
    initGame();
  },
  {
    fontSize: 14,
    lineHeight: 30,
  }
);
game.add(new Background());
game.add(startScreen, 12);
game.add(rocket);
game.add(new Score(player));

sub("player:death", (player) => {
  game.add(getEndScreen(player), 13);
});

GameLoop({
  update() {
    if (level && player && player.state === GAME) {
      level.getSprites().forEach((pad) => {
        if (collides(player.sprite, pad)) {
          pad.color = "red";
          player.jump(pad);
        }
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
