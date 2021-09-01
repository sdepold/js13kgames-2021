import { keyPressed, radToDeg, Text } from "kontra";
import { sub } from "../pubsub";

export const TEASER = "teaser";
export const GAME = "game";
export const JUMP = "jump";

export default class Player {
  constructor() {
    this.size = 1;
    this.state = TEASER;
    this.score = 0;

    sub("pad:disappear", () => {
      this.score++;
    });
  }
  getSprites() {
    const player = this;

    this.sprite =
      this.sprite ||
      Text({
        x: this.x,
        y: this.y,
        dy: -0.25,
        text: "👨‍🚀",
        font: "1px serif",
        rotation: 0,
        dRotation: 0.03,
        anchor: { x: 0.5, y: 0.5 },
        update() {
          if (player.state === TEASER) {
            player.dSize += player.ddSize;
            this.font = `${~~player.size}px serif`;
            this.rotation += this.dRotation;

            if (player.size < 20) {
              player.size += player.dSize;
            } else if (radToDeg(this.rotation) % 360 < 10) {
              this.rotation = this.dRotation = 0;
              this.dy = 0;
              this.ddy = 0.02;
              player.state = GAME;
            }
          } else if (player.state === JUMP) {
            if (keyPressed("left")) {
              this.x -= 3;
            }
            if (keyPressed("right")) {
              this.x += 3;
            }
            if (this.dy >= 0) {
              player.state = GAME;
            }
          } else if (player.state === GAME) {
            if (keyPressed("left")) {
              this.x -= 3;
            }
            if (keyPressed("right")) {
              this.x += 3;
            }
          }

          this.advance();
        },
      });

    return [this.sprite];
  }

  jump() {
    this.state = JUMP;
    this.sprite.dy = -1;
  }

  leaveRocket(rocket) {
    this.ddSize = 0.0025;
    this.dSize = 0;

    this.x = rocket.sprite.x;
    this.y = rocket.sprite.y;
  }
}
