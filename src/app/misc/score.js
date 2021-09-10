import { Text } from "kontra";
import { pub, sub } from "../pubsub";

export default class Score {
  constructor() {
    this.score = 0;

    sub("score:increase", (pad) => {
      this.score += pad.config.padScore;

      if (this.score === 50 || this.score === 200) {
        pub("level:increase");
      }
    });
  }

  getSprites() {
    const entity = this;

    this.sprite =
      this.sprite ||
      Text({
        x: 10,
        y: 10,
        font: "12px Marker Felt",
        color: "white",
        text: `Score: ${entity.score}`,
        update() {
          this.text = `Score: ${entity.score}`;
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
