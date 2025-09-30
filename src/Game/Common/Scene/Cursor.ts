class Cursor {
  scene = null;
  sprite = null;
  relativeX = 0;
  relativeY = 0;

  constructor(scene) {
    this.scene = scene;

    this.preload();
  }

  preload() {
    const { scene } = this;

    scene.load.image('cursor', 'public/global/cursor.png');
  }

  create() {
    const { scene } = this;

    this.sprite = scene.add
      .image(0, 0, 'cursor')
      .setScale(1)
      .setDisplayOrigin(30, 5)
      .setVisible(false);

    scene.input.on(
      'pointermove',
      function (pointer) {
        this.relativeX = pointer.x;
        this.relativeY = pointer.y;
        this.sprite
          .setVisible(true)
          .setPosition(
            pointer.x + scene.cameras.main._scrollX,
            pointer.y + scene.cameras.main._scrollY
          );
      },
      this
    );
  }

  update() {
    this.updatePosition();
  }

  updatePosition() {
    const { scene } = this;

    this.sprite.setPosition(
      this.relativeX + scene.cameras.main._scrollX,
      this.relativeY + scene.cameras.main._scrollY
    );
  }
}

export { Cursor };
