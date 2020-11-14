import Phaser from 'phaser';

import { Background } from '../Common/Background';
import { BoundingBox } from '../Common/Scene/BoundingBox';
import { Bunny } from '../Common/Character/Bunny';
import { Cursor } from '../Common/Scene/Cursor';
import {
  setupCamera,
  startSceneOnWorldBounds,
} from './Common/Transition';
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
    parallaxFactor: 0.16,
  },
  {
    name: '02archwayclouds',
    parallaxFactor: 0.08,
    passiveX: 0.08,
  },
  {
    name: '01archwaywalkway',
    parallaxFactor: 1,
  },
];
// A list of our assets so we can load them in using
// fewer lines of code
const foregroundLayers = [
  {
    name: '04awfrontbricks',
    parallaxFactor: 1,
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

  constructor() {
    super({ key: 'Archway' });
  }

  /**
   * This stuff loads before the game starts; stuff like scenes and whatnot.
   */
  preload() {
    allLayers.forEach(
      ({ name, parallaxFactor, passiveX }: any) =>
        (this.backgrounds[name] = new Background({
          sceneName: 'Archway',
          assetName: name,
          parallaxFactor,
          context: this,
          passiveX,
        }))
    );

    this.sprites.bunny = new Bunny(this);
    this.sprites.cursor = new Cursor(this);
  }

  create() {
    this.createBackgroundLayers();
    this.sprites.bunny.create(43, 589);
    this.createForegroundLayers();
    this.sprites.cursor.create();

    this.createBoundingBoxes();

    startSceneOnWorldBounds('left', 'Beach', this, {
      bunnyStartX: 4056,
      bunnyStartY: 551,
    });
    setupCamera(this, SCENE_WIDTH);
  }

  update() {
    this.sprites.bunny.update();
    this.sprites.cursor.update();

    this.backgrounds['02archwayclouds'].update();
  }

  createBackgroundLayers() {
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
  }

  createForegroundLayers() {
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
  }

  createBoundingBoxes() {
    const { bunny } = this.sprites;

    // Walkway bottom
    new BoundingBox(0, 633, 983, 69).create(
      this,
      bunny.sprite
    );
    // Walkway top
    new BoundingBox(6, 362, 997, 112).create(
      this,
      bunny.sprite
    );
    // Walkway right
    new BoundingBox(984, 216, 31, 486).create(
      this,
      bunny.sprite
    );
    // Walkway right
    new BoundingBox(493, 296, -208, -174).create(
      this,
      bunny.sprite
    );
  }
}

export { Archway };
