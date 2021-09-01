import { degToRad, getCanvas, Text } from "kontra";

export default class Rocket {
  constructor({ onDestinationReached }) {
    this.onDestinationReached = onDestinationReached;
  }
  getSprites() {
    if (!this.sprite) {
      const canvas = getCanvas();
      const rocket = this;

      this.sprite = Text({
        text: "🚀",
        font: "32px Arial",
        x: 100,
        y: canvas.height / 2 + 50,
        dy: -1,
        ddy: 0.003,
        anchor: { x: 0.5, y: 0.5 },
        textAlign: "center",
        rotation: degToRad(-45),
        update() {
          if (this.y <= (canvas.height / 2) * 0.75) {
            if (!rocket.destinationedReachedTrigger) {
              this.ddy = this.dy = 0;
              rocket.onDestinationReached();
              rocket.destinationedReachedTrigger = true;
              this.dy = 0.1;
              this.dx = -0.2;

              setInterval(() => {
                this.rotation += 0.005;
              }, 10);
            }
          }
          if (!rocket.destinationedReachedTrigger && this.dy >= 0) {
            this.dy = 0.01;
            this.ddy = 0;
          }
          this.advance();
        },
      });
    }

    return [this.sprite];
  }
}
