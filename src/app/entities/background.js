import {
  degToRad,
  Sprite,
  GameObject,
  getCanvas,
  getContext,
  Text,
} from "kontra";

function strokeStar(ctx, rot, x, y, r, n, inset) {
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0 - r);
  ctx.rotate(degToRad(rot));
  for (var i = 0; i < n; i++) {
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r * inset);
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export default class Background {
  getSprites() {
    this.sprites = (this.sprites || []).filter((s) => s.isAlive());

    if (Math.random() < 0.05) {
      const size = ~~(Math.random() * 6);
      const color = 111 + ~~(Math.random() * 5) * 111;

      this.sprites.push(
        Sprite({
          x: ~~(Math.random() * (getCanvas().width / 2)),
          y: -10,
          dy: 0.1 + Math.random() * 0.5,
          textAlign: "center",
          rot: degToRad(0),
          dRotation: Math.random() ,
          render() {
            this.context.save();
            this.context.fillStyle = `#${color}`;
            this.context.strokeStyle = `#${color + 222}`;
            strokeStar(this.context, this.rot, this.x, this.y, size, 5, 2);
            this.context.restore();
          },
          update() {
            if (this.y >= canvas.height / 2) {
              this.ttl = 0;
            }
            this.rot += this.dRotation;
            this.advance();
          },
        })
      );
    }

    return this.sprites;
  }
}
