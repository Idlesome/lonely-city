import Phaser from 'phaser';

import { Background } from '../Common/Background';
import { Washout } from '../Common/Character/Washout';
import { GAME_HEIGHT, GAME_WIDTH, GAME_SCALE } from '../config';

const SCENE_WIDTH = GAME_WIDTH * 20;
// const SCENE_HEIGHT = GAME_HEIGHT;

// A list of our assets so we can load them in using
// fewer lines of code
const layers = [
  {
    name: '01background',
    pallaxFactor: 0.08,
  },
  {
    name: '02buildings_third_layer',
    pallaxFactor: 0.16,
  },
  {
    name: '03buildings_second_layer',
    pallaxFactor: 0.22,
  },
  {
    name: '04buildings_first_layer',
    pallaxFactor: 0.4,
  },
  {
    name: '05platform',
    pallaxFactor: 1,
  },
];

class TestScene extends Phaser.Scene {
  /**
   * @param backgrounds A place to store our background sprites
   */
  backgrounds = {};
  sprites = {
    washout: null,
  };

  constructor() {
    super({ key: 'TestScene' });
  }

  /**
   * This stuff loads before the game starts; stuff like scenes and whatnot.
   */
  preload() {
    layers.forEach(
      ({ name, pallaxFactor }) =>
        (this.backgrounds[name] = new Background({
          sceneName: 'TestScene',
          assetName: name,
          pallaxFactor,
          context: this,
        }))
    );

    this.sprites.washout = new Washout(this);
  }

  create() {
    const container = this.add
      .container(0, 0)
      .setName('backgrounds-container')
      .setSize(GAME_WIDTH, GAME_HEIGHT)
      .setScale(GAME_SCALE);

    // For each of our assets...
    layers.forEach(({ name }) => {
      // Create a background and add it to container
      this.backgrounds[name].create(container, SCENE_WIDTH);
    });

    this.sprites.washout.create(GAME_WIDTH / 2, 340);

    this.cameras.main.setBounds(0, 0, SCENE_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.sprites.washout.sprite, true);

    this.setupFullscreenHandler();
  }

  setupFullscreenHandler() {
    var FKey = this.input.keyboard.addKey('F');

    FKey.on(
      'down',
      function () {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      },
      this
    );
  }

  update() {
    this.sprites.washout.update();
  }
}

export { TestScene };
