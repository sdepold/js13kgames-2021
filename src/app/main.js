import { GameLoop, getContext, init } from "kontra";
import { initAudio } from "./audio";
import Background from "./entities/background";
import Player from "./entities/player";
import Rocket from "./entities/rocket";
import Game from "./game";
import Scene from "./scene";
import { getStartScreen } from "./scenes/start-screen";
import { setCanvasSize } from "./misc/helper";

setCanvasSize();
init();

let followShip = true;
const game = new Game();
const player = new Player();
const rocket = new Rocket({
  onDestinationReached() {
    game.add(player);
    player.leaveRocket(rocket);
  },
});

game.loaded = true;

const startScreen = new Scene(
  getStartScreen(),
  () => {
    const initGame = () => {
      startScreen.hide();
      game.add(level.getMonsters(player));
    };
    initAudio().then(initGame, initGame);
  },
  {
    fontSize: 14,
    lineHeight: 30,
  }
);
game.add(new Background());
game.add(startScreen, 12);
game.add(rocket);

GameLoop({
  update() {
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
