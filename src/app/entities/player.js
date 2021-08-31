import { radToDeg, Sprite, Text } from "kontra";

export default class Player {
  constructor() {
    this.size = 1;
  }
  getSprites() {
    const player = this;

    this.sprite =
      this.sprite ||
      Text({
        x: this.x,
        y: this.y,
        dy: -0.25,
        text: "👨‍🚀",
        font: "1px serif",
        rotation: 0,
        dRotation: 0.03,
        anchor: { x: 0.5, y: 0.5 },
        update() {
          player.dSize += player.ddSize;
          this.font = `${~~player.size}px serif`;
          this.rotation += this.dRotation;

          if (player.size < 20) {
            player.size += player.dSize;
          } else if (radToDeg(this.rotation) % 360 < 10) {
            this.rotation = this.dRotation = 0;
            this.dy = 0;
          }

          this.advance();
        },
      });

    return [this.sprite];
  }

  leaveRocket(rocket) {
    this.ddSize = 0.0025;
    this.dSize = 0;

    this.x = rocket.sprite.x;
    this.y = rocket.sprite.y;
  }
}
