import { getCanvas, getContext, Sprite, SpriteSheet } from "kontra";
import { pub, sub } from "../pubsub";

export const EASY = "easy";
export const MEDIUM = "medium";
export const HARD = "hard";

export default class Pad {
  constructor({ y, config }) {
    const image = document.querySelector("#pads");

    this.animate = true;
    this.initialY = y;
    this.speed = 0.5;
    this.config = config;
    this.spriteSheet = SpriteSheet({
      image,
      frameWidth: 48,
      frameHeight: 5,
      animations: {
        breakable: {
          frames: [0],
        },
        breaking: {
          frames: [1],
        },
        solid: {
          frames: [2],
        },
      },
    });
    this.type = Math.random() > 0.1 ? "solid" : "breakable";

    sub("player:death", () => {
      this.animate = false;
    });
    sub("player:superjump:start", () => {
      this.speed = 5 * 0.5;
    });
    sub("player:superjump:stop", () => {
      this.speed = 0.5;
    });
    sub("collision", (args) => {
      const pad = args.with;

      if (this.sprites[0] === pad) {
        if (this.type === "breakable") {
          this.type = "breaking";
        } else if (this.type === "breaking") {
          this.clearExtra();
          pad.ttl = 0;
        }
      }
    });
  }

  getSprites() {
    const pad = this;
    const width = getCanvas().width;
    const height = getCanvas().height;

    if (!this.sprites) {
      this.sprites = [
        Sprite({
          type: "pad",
          x: ~~(Math.random() * (width / 2)),
          y: pad.initialY,
          dy: pad.speed,
          width: 48,
          height: 5,
          animations: this.spriteSheet.animations,
          anchor: { x: 0.5, y: 0.5 },
          update() {
            this.playAnimation(pad.type);

            if (pad.animate) {
              if (this.y + this.height > height / 2) {
                if (this.deleteOnDisappear) {
                  pad.clearExtra();
                  this.ttl = 0;
                } else {
                  pub("pad:disappear", pad);
                  this.y = -10;
                  this.x = ~~(Math.random() * (width / 2));
                  pad.clearExtra();
                  pad.addExtra();
                }
              }

              this.dy = pad.speed;
              this.advance();
            }
          },
        }),
      ];

      this.addExtra();
    }

    return this.sprites;
  }

  clearExtra() {
    if (this.sprites.length > 1) {
      this.sprites = [this.sprites[0]];
    }
  }

  addExtra() {
    if (Math.random() < this.config.trampolineChance) {
      this.addTrampoline();
    }
  }

  addTrampoline() {
    const pad = this;
    const parent = this.sprites[0];
    const width = 20;

    this.sprites.push(
      Sprite({
        x: parent.x + parent.width / 2 - width / 2,
        y: parent.y,
        width,
        height: 10,
        color: "yellow",
        type: "trampoline",
        update() {
          if (pad.animate) {
            this.x = parent.x + parent.width / 2 - width / 2;
            this.y = parent.y - 10;

            this.advance();
          }
        },
      })
    );
  }
}
