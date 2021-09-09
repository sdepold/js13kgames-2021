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

const playerHeight = 31;
const playerWidth = 28;

export default class Player {
  constructor() {
    const image = document.querySelector("#char");

    this.size = 1;
    this.state = TEASER;
    this.score = 0;
    this.acceleration;
    this.dead = false;
    this.spriteSheet = SpriteSheet({
      image,
      frameWidth: playerWidth,
      frameHeight: playerHeight,
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

    sub("collision", (args) => {
      const pad = args.with;
      this.jump(pad);
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
            this.font = `${~~player.size}px serif`;
            this.rotation += this.dRotation;

            if (this.width < playerWidth) {
              this.width += 0.2;
              this.height += 0.2;
            } else {
              this.width = playerWidth;
              this.height = playerHeight;

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
    const isTrampoline = pad.animationName === "trampoline";

    this.state = JUMP;
    this.sprite.dy = isTrampoline ? -4 : -2;

    if (isTrampoline) {
      pub("player:superjump:start");
    }
  }

  leaveRocket(rocket) {
    this.x = rocket.sprite.x;
    this.y = rocket.sprite.y;
  }
}
