import Phaser from 'phaser';
// import { PlayableCharacter } from './PlayableCharacter';

import { GAME_SCALE } from '../../config';

const SPEED = 100;

const walkingAnimations = [
  {
    /**
     * @param name the name of the animation
     */
    direction: 'up',
    /**
     * @param key the keyboard key associated with the animation
     */
    key: 'W',
  },
  {
    direction: 'right',
    key: 'D',
  },
  {
    direction: 'down',
    key: 'S',
  },
  {
    direction: 'left',
    key: 'A',
  },
];

class Washout {
  scene = null;
  sprite = null;
  keys = {
    W: null,
    A: null,
    S: null,
    D: null,
  };
  animationName = null;

  constructor(scene) {
    this.scene = scene;

    this.preload();
  }

  preload() {
    const { scene } = this;

    scene.load.atlas(
      `walk`,
      `public/sprites/Washout/walking.png`,
      `public/sprites/Washout/walking.json`
    );
    scene.load.atlas(
      `idle`,
      `public/sprites/Washout/idle.png`,
      `public/sprites/Washout/idle.json`
    );
  }

  create(x, y) {
    const { scene } = this;

    scene.anims.create({
      key: `walk`,
      frames: scene.anims.generateFrameNames(`walk`),
      frameRate: 3,
      repeat: -1,
    });
    scene.anims.create({
      key: `idle`,
      frames: scene.anims.generateFrameNames(`idle`),
      frameRate: 3,
      repeat: -1,
    });

    // Add Washout to the world, allowing him
    // to have physics so he can move with "velocity"
    this.sprite = scene.physics.add
      .sprite(x, y, 'washout')
      .setScale(2 * GAME_SCALE);
    this
      // Start playing his idle animation to start off
      .play('idle');

    this.keys = scene.input.keyboard.addKeys('W,S,A,D');

    this.setupMovementKeys();
  }

  setupMovementKeys() {
    const { scene } = this;

    // Add movement keys event listeners
    walkingAnimations.forEach(({ key, direction }) => {
      scene.input.keyboard.addKey(key).on(
        'down',
        function () {
          this.move(direction);
        },
        this
      );
      scene.input.keyboard.addKey(key).on(
        'up',
        function () {
          switch (key) {
            case 'W':
            case 'S':
              this.sprite.setVelocityY(0);
              break;
            case 'A':
            case 'D':
              this.sprite.setVelocityX(0);
              break;
          }
          const keys = Object.keys(this.keys);
          const anyKeyDown = keys.some(
            key => this.keys[key].isDown
          );
          console.log(this.keys);
          console.log(anyKeyDown);
          !anyKeyDown && this.idle();

          // if(key === "W" || key === "S"){
          // }
          // if(key === "W" || key === "S"){
          //   this.sprite.setVelocityY(0);
          // }
        },
        this
      );
    });
  }

  update() {
    // this.sprite.setVelocity(0);
  }

  setAnimationName = animationName => {
    this.animationName = animationName;
    this.sprite.play(animationName);
    return this.sprite;
  };

  play = animationName => {
    return animationName === this.animationName
      ? this.sprite
      : this.setAnimationName(animationName);
  };

  move(direction) {
    switch (direction) {
      case 'right': {
        this.play('walk')
          .setVelocityX(SPEED)
          .setFlipX(true);
        break;
      }
      case 'left': {
        this.play('walk')
          .setVelocityX(-SPEED)
          .setFlipX(false);
        break;
      }
      case 'up': {
        this.play('walk').setVelocityY(-SPEED);
        break;
      }
      case 'down': {
        this.play('walk').setVelocityY(SPEED);
        break;
      }
    }
  }

  idle() {
    this.play('idle');
  }
}
export { Washout };
