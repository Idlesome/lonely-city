import { DEBUG } from 'config';
import { copyToClipboard } from 'Common/Debug/copy-to-clipboard';

class Debugger {
  scene = null;
  debugText = null;
  relativeX = 0;
  relativeY = 0;

  shape = null;
  shapeType = 'rectangle';
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  selecting = false;
  points = [];

  constructor(scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    const { scene } = this;

    scene.input.on(
      'pointermove',
      function (pointer) {
        this.relativeX = pointer.x;
        this.relativeY = pointer.y;
      },
      this
    );

    this.createDebug();
  }

  update() {
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
        'type: ' + this.shapeType,
        'x: ' + this.relativeX,
        'y: ' + this.relativeY,
        'camX: ' + scene.cameras.main._scrollX,
        'camY: ' + scene.cameras.main._scrollY,
        'chX: ' + scene.sprites.bunny.sprite.x,
        'chY: ' + scene.sprites.bunny.sprite.y,
      ])
      .setPosition(
        scene.cameras.main._scrollX + 10,
        scene.cameras.main._scrollY + 10
      );
    if (this.shape) {
      switch (this.shapeType) {
        case 'rectangle':
          this.shape.setPosition(startX, startY);
          this.shape.setSize(
            relativeX +
              scene.cameras.main._scrollX -
              startX,
            relativeY + scene.cameras.main._scrollY - startY
          );
          break;
      }
    }
  }

  createDebug() {
    const { scene } = this;

    if (DEBUG) {
      this.debugText = scene.add.text(10, 10, '', {
        fill: '#00ff00',
      });

      scene.input.keyboard.on(
        'keydown-SPACE',
        function () {
          this.shapeType =
            this.shapeType === 'rectangle'
              ? 'polygon'
              : 'rectangle';
        },
        this
      );

      scene.input.on(
        'pointerdown',
        function () {
          const {
            startX,
            startY,
            relativeX,
            relativeY,
          } = this;

          switch (this.shapeType) {
            case 'rectangle':
              if (!this.selecting) {
                this.shape = scene.add
                  .rectangle(0, 0, 0, 0, 0xcccccc)
                  .setAlpha(0.25);

                this.startX =
                  this.relativeX +
                  scene.cameras.main._scrollX;
                this.startY =
                  this.relativeY +
                  scene.cameras.main._scrollY;
              } else {
                let [x, y, w, h]: number[] = [
                  Math.trunc(startX),
                  Math.trunc(startY),
                  Math.trunc(
                    relativeX +
                      scene.cameras.main._scrollX -
                      startX
                  ),
                  Math.trunc(
                    relativeY +
                      scene.cameras.main._scrollY -
                      startY
                  ),
                ];

                this.shape.destroy();
                this.shape = null;
                copyToClipboard(`${x}, ${y}, ${w}, ${h}`);
              }
              this.selecting = !this.selecting;
              break;
          }

          console.log(this.startX, this.startY);
        },
        this
      );
    }
  }
}

export { Debugger };
