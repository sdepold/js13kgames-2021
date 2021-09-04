import { getCanvas, getContext, Sprite } from "kontra";
import { pub, sub } from "../pubsub";
import Pad from "./pad";

export const EASY = "easy";
export const MEDIUM = "medium";
export const HARD = "hard";

export default class Level {
  constructor({ difficulty = EASY } = {}) {
    this.difficulty = difficulty;
    this.animate = true;

    sub("player:death", () => {
      this.animate = false;
    });
  }

  get padCount() {
    return { [EASY]: 8, [MEDIUM]: 6, [HARD]: 4 }[this.difficulty];
  }

  getSprites() {
    if (!this.pads) {
      const height = getCanvas().height;
      const pads = [];

      for (let i = 0; i < this.padCount; i++) {
        const y = ~~(i * (height / 2 / this.padCount));
        
        pads.push(new Pad({ y }));
      }

      this.pads = pads;
    }

    return this.pads.flatMap((pad) => pad.getSprites());
  }
}
