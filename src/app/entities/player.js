import { getCanvas, keyPressed, radToDeg, Text } from "kontra";
import { sub } from "../pubsub";

export const TEASER = "teaser";
export const GAME = "game";
export const JUMP = "jump";

export default class Player {
  constructor() {
    this.size = 1;
    this.state = TEASER;
    this.score = 0;
    this.acceleration;

    sub("pad:disappear", () => {
      this.score++;
    });
    sub("device:tilt", (acceleration) => {
      if (this.sprite) {
        this.sprite.dx = acceleration.x / 3;
      }
    });
  }
  handleMovement() {
    if (keyPressed("left")) {
      this.sprite.x -= 3;
    }
    if (keyPressed("right")) {
      this.sprite.x += 3;
    }
  }

  checkBounderies() {
    const canvas = getCanvas();

    if (this.sprite.x < 0) {
      this.sprite.x = canvas.width / 2;
    } else if (this.sprite.x > canvas.width / 2) {
      this.sprite.x = 0;
    }
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
              this.ddy = 0.075;
              player.state = GAME;
            }
          } else {
            player.handleMovement();
            player.checkBounderies();

            if (player.state === JUMP) {
              if (this.dy >= 0) {
                player.state = GAME;
              }
            } else if (player.state === GAME) {
              // non-jump specifics
            }
          }

          this.advance();
        },
      });

    return [this.sprite];
  }

  jump() {
    this.state = JUMP;
    this.sprite.dy = -2;
  }

  leaveRocket(rocket) {
    this.ddSize = 0.0025;
    this.dSize = 0;

    this.x = rocket.sprite.x;
    this.y = rocket.sprite.y;
  }
}
