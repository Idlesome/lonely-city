import { DEBUG } from 'config';

class BoundingBox {
  x = null;
  y = null;
  w = null;
  h = null;

  name = null;

  debugText = null;

  /**
   * @param name Name of boudning box for debugging
   */
  constructor(x, y, w, h, name = 'unknown') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
  }
  create(scene, collideWith) {
    const { x, y, w, h, name } = this;

    const rect = scene.add
      .rectangle(x, y, w, h)
      .setDisplayOrigin(0, 0);
    scene.physics.add.existing(rect);
    rect.body.setImmovable(true);

    scene.physics.add.collider(rect, collideWith);

    if (DEBUG) {
      // Debug
      this.debugText = scene.add.text(x, y, name, {
        fill: '#00ff00',
      });
    }
  }
}

export { BoundingBox };
