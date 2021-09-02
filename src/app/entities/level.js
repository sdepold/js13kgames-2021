import { getCanvas, getContext, Sprite } from "kontra";
import { pub } from "../pubsub";

export const EASY = "easy";
export const MEDIUM = "medium";
export const HARD = "hard";

export default class Level {
  constructor({ difficulty = EASY } = {}) {
    this.difficulty = difficulty;
  }

  get padCount() {
    return { [EASY]: 8, [MEDIUM]: 6, [HARD]: 4 }[this.difficulty];
  }

  getSprites() {
    if (!this.sprites) {
      const width = getCanvas().width;
      const height = getCanvas().height;
      const sprites = [];

      for (let i = 0; i < this.padCount; i++) {
        sprites.push(
          Sprite({
            x: ~~(Math.random() * (width / 2)),
            y: ~~(i * ((height / 2) / this.padCount)),
            dy: 0.5,
            width: ~~(width / 6),
            height: 2,
            color: "#999",
            update() {
              if (this.y + this.height > height / 2) {
                pub("pad:disappear", this);
                this.y = -10;
                this.x = ~~(Math.random() * (width / 2));
              }
              this.advance();
            },
          })
        );
      }

      this.sprites = sprites;
    }

    return this.sprites;
  }
}
