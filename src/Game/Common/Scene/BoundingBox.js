class BoundingBox {
  x = null;
  y = null;
  w = null;
  h = null;

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  create(scene, collideWith) {
    const { x, y, w, h } = this;

    const rect = scene.add
      .rectangle(x, y, w, h)
      .setDisplayOrigin(0, 0);
    scene.physics.add.existing(rect);
    rect.body.setImmovable(true);

    scene.physics.add.collider(rect, collideWith);
  }
}

export { BoundingBox };
