import Phaser from 'phaser';
// import { PlayableCharacter } from './PlayableCharacter';

import { GAME_SCALE } from '../../config';

// const SPEED = 100;
// const SPEED = 150;
const SPEED = 800;

const DEBUG = false;

// These are placeholders for keyboard
// keys until Phaser control of them and
// sets MOVEMENT_KEYS.W.isDown
const MOVEMENT_KEYS = {
  W: null,
  A: null,
  S: null,
  D: null,
};

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
// Idle animations for looping through to load
const idleAnimations = ['idle-down', 'idle-up'];

class Bunny {
  scene = null;
  sprite = null;
  keys = {
    W: null,
    A: null,
    S: null,
    D: null,
  };
  animationName = null;
  latestKeyPressed = null;
  keysDown = 0;
  direction = 'up';

  constructor(scene) {
    this.scene = scene;

    this.preload();
  }

  preload() {
    const { scene } = this;

    // Load all the walking animations
    walkingAnimations.forEach(({ direction }) => {
      DEBUG &&
        console.log('loaded animation bunny-' + direction);
      scene.load.atlas(
        `bunny-${direction}`,
        `public/sprites/bunny/walk/${direction}.png`,
        `public/sprites/bunny/walk/${direction}.json`
      );
    });
    // Load the idle animations
    idleAnimations.forEach(direction => {
      DEBUG &&
        console.log('loaded animation bunny-' + direction);
      scene.load.atlas(
        `bunny-${direction}`,
        `public/sprites/bunny/walk/${direction}.png`,
        `public/sprites/bunny/walk/${direction}.json`
      );
    });

    // Ask Phaser to change MOVEMENT_KEYS.W.onDown (and so on) for us!
    Object.keys(MOVEMENT_KEYS).map(
      key =>
        (MOVEMENT_KEYS[key] = scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes[key]
        ))
    );
  }

  create(x, y) {
    const { scene } = this;

    // Link up Phaser to the animations in the sprite
    // JSON files for walking animations
    walkingAnimations.forEach(({ direction }) => {
      DEBUG &&
        console.log('created animation bunny-' + direction);

      scene.anims.create({
        key: `bunny-${direction}`,
        frames: scene.anims.generateFrameNames(
          `bunny-${direction}`
        ),
        frameRate: 5,
        repeat: -1,
      });
    });
    // Link up Phaser to the animations in the sprite
    // JSON files for walking animations
    idleAnimations.forEach(name => {
      DEBUG &&
        console.log('created animation bunny-' + name);

      scene.anims.create({
        key: `bunny-${name}`,
        frames: scene.anims.generateFrameNames(
          `bunny-${name}`
        ),
        frameRate: 5,
        repeat: -1,
      });
    });

    // Add Bunny to the world, allowing him
    // to have physics so he can move with "velocity"
    this.sprite = scene.physics.add
      .sprite(x, y, 'bunny')
      .setScale(GAME_SCALE);
    // Set bounding box size
    this.sprite.body
      .setSize(16, 8, false)
      // Set bounding box offset
      .setOffset(8, 22);
    this
      // Start playing his idle animation to start off
      .play('bunny-idle-down');

    this.sprite.setCollideWorldBounds(true);

    walkingAnimations.forEach(({ key }) => {
      scene.input.keyboard.addKey(key).on('down', () => {
        const { W, A, S, D } = MOVEMENT_KEYS;

        this.latestKeyPressed = key;
        this.keysDown = [
          W.isDown,
          A.isDown,
          S.isDown,
          D.isDown,
        ].filter(keep => keep).length;
      });
      scene.input.keyboard.addKey(key).on('up', () => {
        const { W, A, S, D } = MOVEMENT_KEYS;
        this.keysDown = [
          W.isDown,
          A.isDown,
          S.isDown,
          D.isDown,
        ].filter(keep => keep).length;
        // None of them are down - return to idle animation
        if (
          !W.isDown &&
          !A.isDown &&
          !S.isDown &&
          !D.isDown
        ) {
          if (key === 'W') {
            this.setIdle('up');
            return;
          }
          this.setIdle('down');
        }
      });
    });
  }

  update() {
    // Reset the rabbit's velocity to stop him from
    // scating away in the direction he was heading...
    this.sprite.setVelocity(0);

    // For each of the rabbits movements, check if
    // a key is being pressed...
    walkingAnimations.forEach(({ direction, key }) => {
      // Check if this key is down
      if (MOVEMENT_KEYS[key].isDown) {
        // Multiple keys down, use latest key pressed
        if (
          this.keysDown > 1 &&
          this.latestKeyPressed === key
        ) {
          this.setDirection(direction);
        }
        // One key down, use that key
        if (this.keysDown === 1) {
          this.setDirection(direction);
        }
        this.move(direction);
      }
    });
  }

  move(direction) {
    switch (direction) {
      case 'up':
        {
          this.sprite.setVelocityY(-SPEED);
        }
        break;
      case 'down':
        {
          this.sprite.setVelocityY(SPEED);
        }
        break;
      case 'left':
        {
          this.sprite.setVelocityX(-SPEED);
        }
        break;
      case 'right':
        {
          this.sprite.setVelocityX(SPEED);
        }
        break;
    }
  }

  goTo(x, y) {
    this.scene.physics.moveTo(this.sprite, x, y, SPEED);

    let direction = null;
    // Get x velocity independent of negative value
    const velocityX =
      this.sprite.body.velocity.x < 0
        ? -this.sprite.body.velocity.x
        : this.sprite.body.velocity.x;
    const velocityY =
      this.sprite.body.velocity.y < 0
        ? -this.sprite.body.velocity.y
        : this.sprite.body.velocity.y;

    // Wherever the most velocity is, that's the direction
    const horizontal = velocityX > velocityY;
    // We know it's horizontal, now is it up or down?
    if (horizontal) {
      direction =
        this.sprite.body.velocity.x < 0 ? 'left' : 'right';
    } else {
      direction =
        this.sprite.body.velocity.y < 0 ? 'up' : 'down';
    }

    this.setDirection(direction);
  }

  setDirection(direction) {
    this.direction = direction;
    this.play('bunny-' + direction);
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

  setIdle(direction) {
    this.play('bunny-idle-' + direction);
  }
}
export { Bunny };
