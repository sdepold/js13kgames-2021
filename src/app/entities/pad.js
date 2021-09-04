import { getCanvas, getContext, Sprite } from "kontra";
import { pub, sub } from "../pubsub";

export const EASY = "easy";
export const MEDIUM = "medium";
export const HARD = "hard";

export default class Pad {
  constructor({ y }) {
    this.animate = true;
    this.initialY = y;
    this.speed = 0.5;

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
                pub("pad:disappear", this);
                this.y = -10;
                this.x = ~~(Math.random() * (width / 2));
              }

              this.dy = pad.speed;
              this.advance();
            }
          },
        }),
      ];

      if (Math.random() < 0.3) {
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

    return this.sprites;
  }
}
