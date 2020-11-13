import { DEBUG } from '../../config';
import { copyToClipboard } from '../../Common/Debug/copy-to-clipboard';

class Cursor {
  scene = null;
  sprite = null;
  debugText = null;
  relativeX = 0;
  relativeY = 0;

  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;

  rect = null;

  constructor(scene) {
    this.scene = scene;

    this.preload();
    // this.scene.events.on('preload', () => {
    // });
    // this.scene.events.on('create', () => {
    //   this.create();
    // });
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

    if (DEBUG) {
      this.debugText = scene.add.text(10, 10, '', {
        fill: '#00ff00',
      });

      scene.input.on(
        'pointerdown',
        function () {
          this.rect = scene.add
            .rectangle(0, 0, 0, 0, 0xcccccc)
            .setAlpha(0.25);

          this.startX =
            this.relativeX + scene.cameras.main._scrollX;
          this.startY =
            this.relativeY + scene.cameras.main._scrollY;
          console.log(this.startX, this.startY);
        },
        this
      );
      scene.input.on(
        'pointerup',
        function () {
          const {
            startX,
            startY,
            relativeX,
            relativeY,
          } = this;

          let [x, y, w, h] = [
            parseInt(startX),
            parseInt(startY),
            parseInt(
              relativeX +
                scene.cameras.main._scrollX -
                startX
            ),
            parseInt(
              relativeY +
                scene.cameras.main._scrollY -
                startY
            ),
          ];

          this.rect.destroy();
          this.rect = null;
          copyToClipboard(`${x}, ${y}, ${w}, ${h}`);
        },
        this
      );
    }
  }

  update() {
    this.updatePosition();

    if (DEBUG) {
      this.updateDebug();
    }
  }

  updateDebug() {
    const {
      startX,
      startY,
      relativeX,
      relativeY,
      scene,
    } = this;

    this.debugText
      .setText([
        'x: ' + this.relativeX,
        'y: ' + this.relativeY,
        'cx: ' + scene.cameras.main._scrollX,
        'cy: ' + scene.cameras.main._scrollY,
      ])
      .setPosition(
        scene.cameras.main._scrollX + 10,
        scene.cameras.main._scrollY + 10
      );
    if (this.rect) {
      this.rect.setPosition(startX, startY);
      this.rect.setSize(
        relativeX + scene.cameras.main._scrollX - startX,
        relativeY + scene.cameras.main._scrollY - startY
      );
    }
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
