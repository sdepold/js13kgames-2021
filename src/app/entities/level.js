import { getCanvas, getContext, Sprite } from "kontra";
import { pub, sub } from "../pubsub";
import Pad from "./pad";

export const EASY = "easy";
export const MEDIUM = "medium";
export const HARD = "hard";

export const config = {
  [EASY]: { padCount: 8, trampolineChance: 0.2, padScore: 1 },
  [MEDIUM]: { padCount: 6, trampolineChance: 0.3, padScore: 2 },
  [HARD]: { padCount: 4, trampolineChance: 0.5, padScore: 3 },
};

export default class Level {
  constructor({ difficulty = EASY } = {}) {
    this.difficulty = difficulty;
    this.animate = true;

    sub("player:death", () => {
      this.animate = false;
    });
    sub("level:increase", () => {
      this.getSprites().forEach((sprite) => (sprite.deleteOnDisappear = true));
      this.increaseDifficulty();
    });
  }

  generateLevel() {
    const height = getCanvas().height;
    const pads = [];
    const levelConfig = config[this.difficulty];
    const padCount = levelConfig.padCount;

    for (let i = 0; i < padCount; i++) {
      const y = ~~(i * (height / 2 / padCount));

      pads.push(new Pad({ y, config: levelConfig }));
    }

    return pads;
  }

  getSprites() {
    if (!this.pads) {
      this.pads = this.generateLevel();
    }

    return this.pads
      .flatMap((pad) => pad.getSprites())
      .filter((s) => s.isAlive());
  }

  increaseDifficulty() {
    this.difficulty = {
      [EASY]: MEDIUM,
      [MEDIUM]: HARD,
      [HARD]: HARD,
    }[this.difficulty];

    this.pads = this.pads.concat(this.generateLevel());
  }
}
