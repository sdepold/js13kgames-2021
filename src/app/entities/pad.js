import { getCanvas, getContext, Sprite } from "kontra";
import { pub, sub } from "../pubsub";

export const EASY = "easy";
export const MEDIUM = "medium";
export const HARD = "hard";

export default class Pad {
  constructor({ y, config }) {
    this.animate = true;
    this.initialY = y;
    this.speed = 0.5;
    this.config = config;

    sub("player:death", () => {
      this.animate = false;
    });
    sub("player:superjump:start", () => {
      this.speed = 5 * 0.5;
    });

    sub("player:superjump:stop", () => {
      this.speed = 0.5;
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
          width: ~~(width / 6),
          height: 2,
          color: "#999",
          update() {
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
