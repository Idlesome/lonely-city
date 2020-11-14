/**
 * Not really working yet but a good idea
 */
import Phaser from 'phaser';

const SPRITE_FOLDER = 'public/sprites/';

const animations = ['left', 'right', 'idle'];

class PlayableCharacter extends Phaser.GameObjects.Sprite {
  name = null;
  /**
   * A character controlled by a player
   *
   * @param {*} name Character name
   * @param {*} config Sprite config
   */
  constructor(name, config) {
    super(config.scene, config.x, config.y, config.key);

    this.name = name;
  }

  preload() {
    // Load all the animations
    animations.forEach(animationName => {
      this.load.atlas(
        `${name}-walk-${animationName}`,
        `public/sprites/${name}/walk/${animationName}.png`,
        `public/sprites/${name}/walk/${animationName}.json`
      );
    });
  }

  create() {
    animations.forEach(animationName =>
      this.anims.create({
        key: `${this.name}-${animationName}`,
        frames: this.anims.generateFrameNames(
          `${this.name}-${animationName}`
        ),
        frameRate: 5,
        repeat: -1,
      })
    );
  }
}

export { PlayableCharacter };
