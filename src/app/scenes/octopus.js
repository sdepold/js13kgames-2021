import { getCanvas, Sprite, Text } from "kontra";
import { createPlayerSpriteSheet } from "../entities/player";

export class Mascot {
  constructor({ height = 90, width = 72, origin = "right" } = {}) {
    this.playerSpriteSheet = createPlayerSpriteSheet();
    this.height = height;
    this.width = width;
    this.origin = origin;
  }
  getSprites() {
    if (!this.sprites) {
      const canvas = getCanvas();
      const mascot = this;
      const fromRight = this.origin === "right";
      const threshold = fromRight
        ? canvas.width / 2 - mascot.width
        : mascot.width;

      this.sprites = [
        Sprite({
          width: this.width,
          height: this.height,
          animations: this.playerSpriteSheet.animations,
          y: canvas.height / 2 - this.height,
          x: fromRight ? canvas.width / 2 : -this.width,
          dx: fromRight ? -0.5 : 0.5,
          scaleX: fromRight ? 1 : -1,
          update() {
            if (this.x === threshold) {
              this.dx = 0;
              this.playAnimation("idle");
              if (Math.random() < 0.05) {
                mascot.sprites.push(
                  Text({
                    x:
                      this.x +
                      mascot.width / 7 -
                      (fromRight ? 0 : mascot.width / 2),
                    y: this.y + mascot.height / 3,
                    font: `${mascot.height / 9}px Arial`,
                    text: "❤️",
                    dx: Math.random() * (fromRight ? -1 : 1),
                    dy: -Math.random(),
                    ttl: 200,
                    update() {
                      this.opacity = this.ttl / 100.0;
                      this.advance();
                    },
                  })
                );
              }
            }

            this.advance();
          },
        }),
      ];
    }
    return this.sprites;
  }
}
