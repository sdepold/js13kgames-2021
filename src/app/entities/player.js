import {
  getCanvas,
  keyPressed,
  radToDeg,
  Sprite,
  SpriteSheet,
  Text,
} from "kontra";
import { pub, sub } from "../pubsub";

export const TEASER = "teaser";
export const GAME = "game";
export const JUMP = "jump";

export default class Player {
  constructor() {
    const image = document.querySelector("#char");

    this.size = 1;
    this.state = TEASER;
    this.score = 0;
    this.acceleration;
    this.dead = false;
    this.spriteSheet = SpriteSheet({
      image: image,
      frameWidth: 28,
      frameHeight: 37,
      animations: {
        walk: {
          frames: "0..3",
          frameRate: 8,
        },
        jump: {
          frames: "1..1",
        },
      },
    });

    sub("pad:disappear", (pad) => {
      this.score += pad.config.padScore;
      if (this.score === 30 || this.score === 100) {
        pub("level:increase");
      }
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
      this.sprite.scaleX = 1;
    }
    if (keyPressed("right")) {
      this.sprite.x += 3;
      this.sprite.scaleX = -1;
    }
  }

  checkBounderies() {
    const canvas = getCanvas();

    if (this.sprite.x < 0) {
      this.sprite.x = canvas.width / 2;
    } else if (this.sprite.x > canvas.width / 2) {
      this.sprite.x = 0;
    }
    if (!this.dead && this.sprite.y >= canvas.height / 2) {
      pub("player:death", this);
    }
  }

  getSprites() {
    const player = this;
    const height = 31;
    const width = 28;

    this.sprite =
      this.sprite ||
      Sprite({
        x: this.x,
        y: this.y,
        width: 1,
        height: 1,
        dy: -0.25,
        animations: this.spriteSheet.animations,
        rotation: 0,
        dRotation: 0.03,
        anchor: { x: 0.5, y: 0.5 },
        direction: "right",
        update() {
          if (player.state === TEASER) {
            this.playAnimation("jump");
            player.dSize += player.ddSize;
            this.font = `${~~player.size}px serif`;
            this.rotation += this.dRotation;

            if (this.width < width) {
              this.width += 0.1;
              this.height += 0.1;
            } else {
              this.width = width;
              this.height = height;

              if (radToDeg(this.rotation) % 360 < 10) {
                this.rotation = this.dRotation = 0;
                this.dy = 0;
                this.ddy = 0.075;
                player.state = GAME;
              }
            }
          } else {
            player.handleMovement();
            player.checkBounderies();

            if (player.state === JUMP) {
              this.playAnimation("jump");

              if (this.dy >= 0) {
                player.state = GAME;
                pub("player:superjump:stop");
              }
            } else if (player.state === GAME) {
              this.playAnimation("walk");
            }
          }

          this.advance();
        },
      });

    return [this.sprite];
  }

  jump(pad) {
    this.state = JUMP;
    this.sprite.dy = pad.type === "trampoline" ? -4 : -2;

    if (pad.type === "trampoline") {
      pub("player:superjump:start");
    }
  }

  leaveRocket(rocket) {
    this.ddSize = 0.0025;
    this.dSize = 0;

    this.x = rocket.sprite.x;
    this.y = rocket.sprite.y;
  }
}
