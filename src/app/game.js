export default class Game {
  constructor() {
    this.layers = {};
  }

  add(entities, layerId = 10) {
    this.layers[layerId] = (this.layers[layerId] || []).concat(entities);
  }

  remove(entity, layerId = 10) {
    this.layers[layerId] = (this.layers[layerId] || []).filter(
      (e) => e != entity
    );
  }

  getSprites() {
    const layerIds = Object.keys(this.layers).sort()
    const sprites = layerIds
      .sort((a, b) => parseInt(a) - parseInt(b))
      .flatMap((layerId) => {
        const layer = this.layers[layerId];

        return layer.flatMap((o) => o.getSprites());
      });

    return sprites.flat().filter((s) => s.isAlive());
  }
}
