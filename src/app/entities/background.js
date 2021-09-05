import { degToRad, getCanvas, Sprite } from "kontra";
import { sub } from "../pubsub";

function star(ctx, R, cX, cY, N) {
  ctx.beginPath();
  ctx.moveTo(cX + R, cY);
  for (var i = 1; i <= N * 2; i++) {
    if (i % 2 == 0) {
      var theta = (i * (Math.PI * 2)) / (N * 2);
      var x = cX + R * Math.cos(theta);
      var y = cY + R * Math.sin(theta);
    } else {
      var theta = (i * (Math.PI * 2)) / (N * 2);
      var x = cX + (R / 2) * Math.cos(theta);
      var y = cY + (R / 2) * Math.sin(theta);
    }

    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

export default class Background {
  constructor() {
    const originalSpeed = 0.1 + Math.random() * 0.5;
    const height = getCanvas().height / 2;

    this.animate = true;
    this.speed = originalSpeed;
    this.sprites = [];

    for (let i = 0; i < 100; i++) {
      this.sprites.push(this.createStarSprite(~~(Math.random() * height)));
    }

    sub("player:death", () => {
      this.animate = false;
    });

    sub("player:superjump:start", () => {
      this.speed = 5 * originalSpeed;
    });

    sub("player:superjump:stop", () => {
      this.speed = originalSpeed;
    });
  }

  createStarSprite(y = -10) {
    const background = this;
    const size = ~~(Math.random() * 6);
    const color = 111 + ~~(Math.random() * 5) * 111;

    return Sprite({
      x: ~~(Math.random() * (getCanvas().width / 2)),
      y,
      dy: background.speed,
      textAlign: "center",
      rot: degToRad(0),
      dRotation: Math.random(),
      render() {
        this.context.save();
        this.context.fillStyle = `#${color}`;
        this.context.strokeStyle = `#${color + 222}`;
        star(this.context, size, this.x, this.y, 5);
        this.context.restore();
      },
      update() {
        if (background.animate) {
          if (this.y >= canvas.height / 2) {
            this.ttl = 0;
          }
          this.rot += this.dRotation;
          this.dy = background.speed;

          this.advance();
        }
      },
    });
  }

  getSprites() {
    this.sprites = (this.sprites || []).filter((s) => s.isAlive());

    if (Math.random() < 0.1) {
      this.sprites.push(this.createStarSprite());
    }

    return this.sprites;
  }
}
