import Phaser from 'phaser';

import { Background } from '../Common/Background';
import { Bunny } from '../Common/Character/Bunny';
import { Cursor } from '../Common/Scene/Cursor';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GAME_SCALE,
} from '../config';

const SCENE_WIDTH = GAME_WIDTH;
// const SCENE_HEIGHT = GAME_HEIGHT;

// A list of our assets so we can load them in using
// fewer lines of code
const backgroundLayers = [
  {
    name: '03archwaysky',
    pallaxFactor: 0.16,
  },
  {
    name: '02archwayclouds',
    pallaxFactor: 0.08,
    passiveX: 0.08,
  },
  {
    name: '01archwaywalkway',
    pallaxFactor: 1,
  },
];
// A list of our assets so we can load them in using
// fewer lines of code
const foregroundLayers = [
  {
    name: '04awfrontbricks',
    pallaxFactor: 1,
  },
];
const allLayers = [
  ...backgroundLayers,
  ...foregroundLayers,
];

class Archway extends Phaser.Scene {
  /**
   * @param backgrounds A place to store our background sprites
   */
  backgrounds = {};
  sprites = {
    cursor: null,
    bunny: null,
  };
  lastClickX = null;
  lastClickY = null;

  constructor() {
    super({ key: 'Archway' });
  }

  /**
   * This stuff loads before the game starts; stuff like scenes and whatnot.
   */
  preload() {
    allLayers.forEach(
      ({ name, pallaxFactor, passiveX }) =>
        (this.backgrounds[name] = new Background({
          sceneName: 'Archway',
          assetName: name,
          pallaxFactor,
          context: this,
          passiveX,
        }))
    );

    this.sprites.bunny = new Bunny(this);
    this.sprites.cursor = new Cursor(this);
  }

  create() {
    const backgroundContainer = this.add
      .container(0, 0)
      .setName('backgrounds-container')
      .setSize(GAME_WIDTH, GAME_HEIGHT)
      .setScale(GAME_SCALE);

    // For each of our assets...
    backgroundLayers.forEach(({ name }) => {
      // Create a background and add it to container
      this.backgrounds[name].create(
        backgroundContainer,
        SCENE_WIDTH
      );
    });

    this.sprites.bunny.create(100, 300);

    const foregroundContainer = this.add
      .container(0, 0)
      .setName('foregrounds-container')
      .setSize(GAME_WIDTH, GAME_HEIGHT)
      .setScale(GAME_SCALE);
    // For each of our assets...
    foregroundLayers.forEach(({ name }) => {
      // Create a background and add it to container
      this.backgrounds[name].create(
        foregroundContainer,
        SCENE_WIDTH
      );
    });

    this.sprites.cursor.create();

    this.cameras.main.setBounds(
      0,
      0,
      SCENE_WIDTH,
      GAME_HEIGHT
    );
    this.cameras.main.startFollow(
      this.sprites.bunny.sprite,
      true
    );

    this.setupFullscreenHandler();

    const scene = this;

    scene.input.on(
      'pointerup',
      function (pointer) {
        this.lastClickX =
          pointer.x + scene.cameras.main._scrollX;
        this.lastClickY =
          pointer.y + scene.cameras.main._scrollY;
      },
      this
    );
  }

  update() {
    this.sprites.bunny.update();
    this.sprites.cursor.update();

    this.backgrounds['02archwayclouds'].update();
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
}

export { Archway };
