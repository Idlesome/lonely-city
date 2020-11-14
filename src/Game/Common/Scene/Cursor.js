import Phaser from 'phaser';

import { DEBUG } from '../../config';
import { copyToClipboard } from '../../Common/Debug/copy-to-clipboard';

class Cursor {
  scene = null;
  sprite = null;
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

    this.createDebug();
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
        'type: ' + this.shapeType,
        'x: ' + this.relativeX,
        'y: ' + this.relativeY,
        'cx: ' + scene.cameras.main._scrollX,
        'cy: ' + scene.cameras.main._scrollY,
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
        case 'polygon':
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

                this.shape.destroy();
                this.shape = null;
                copyToClipboard(`${x}, ${y}, ${w}, ${h}`);
              }
              this.selecting = !this.selecting;
              break;
            case 'polygon':
              // if(!this.selecting){
              //   this.points.push(this.relativeX +
              //     scene.cameras.main._scrollX);
              //   this.points.push(this.relativeY +
              //     scene.cameras.main._scrollY);

              //   this.shape = new Phaser.Polygon(this.points);
              //   this.selecting = true;
              // }
              break;
          }

          console.log(this.startX, this.startY);
        },
        this
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
