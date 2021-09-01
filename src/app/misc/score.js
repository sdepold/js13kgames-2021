import { Text } from "kontra";

export default class Score {
  constructor(player) {
    this.player = player;
  }

  get score() {
    return this.player && this.player.score;
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
        text: `Score: ${entity.score || 0}`,
        update() {
          this.text = `Score: ${entity.score || 0}`;
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
