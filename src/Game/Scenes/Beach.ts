import Phaser from 'phaser';

import { Sprite } from 'types';

import { Background } from '../Common/Background';
import { Bunny } from '../Common/Character/Bunny';
import { Cursor } from '../Common/Scene/Cursor';
import { BoundingBox } from '../Common/Scene/BoundingBox';
import { Debugger } from 'Common/Debug/Debugger';

import {
  startSceneOnWorldBounds,
  setupCamera,
} from './Common/Transition';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GAME_SCALE,
  ENABLE_AUDIO,
} from '../config';

const SCENE_WIDTH = GAME_WIDTH * 4;
// const SCENE_HEIGHT = GAME_HEIGHT;

// A list of our assets so we can load them in using
// fewer lines of code
const layers = [
  {
    name: '01walkway',
    parallaxFactor: 1,
  },
  {
    name: '02clouds',
    parallaxFactor: 0.08,
    passiveX: 0.08,
  },
  {
    name: '03mountains',
    parallaxFactor: 0.16,
  },
];

class Beach extends Phaser.Scene {
  /**
   * @param backgrounds A place to store our background sprites
   */
  backgrounds = {};
  sprites: {
    cursor: Sprite;
    bunny: Sprite;
  } = {
    cursor: null,
    bunny: null,
  };
  debugger;
  music: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'Beach' });
  }

  /**
   * This stuff loads before the game starts; stuff like scenes and whatnot.
   */
  preload() {
    ENABLE_AUDIO &&
      this.load.audio('beach', [
        'public/audio/soundtrack/beach.mp3',
      ]);

    layers.forEach(
      ({ name, parallaxFactor, passiveX }) =>
        (this.backgrounds[name] = new Background({
          sceneName: 'Beach',
          assetName: name,
          parallaxFactor,
          context: this,
          passiveX,
        }))
    );

    this.sprites.bunny = new Bunny(this);
    this.sprites.cursor = new Cursor(this);
  }

  create({ bunnyStartX = 101, bunnyStartY = 596 }) {
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

    this.sprites.bunny.create(bunnyStartX, bunnyStartY);
    this.sprites.cursor.create();

    this.createBoundingBoxes();

    startSceneOnWorldBounds('right', 'Archway', this);
    setupCamera(this, SCENE_WIDTH);

    if (ENABLE_AUDIO && !this.music) {
      this.music = this.sound.add('beach');

      this.music.play('', { loop: true });
    }

    this.debugger = new Debugger(this);
  }

  update() {
    this.sprites.bunny.update();
    this.sprites.cursor.update();
    this.debugger.update();

    this.backgrounds['02clouds'].update();
  }

  createBoundingBoxes() {
    const { bunny } = this.sprites;

    // Walkway bottom
    new BoundingBox(
      372,
      630,
      3800,
      17,
      'walkwaybottom'
    ).create(this, bunny.sprite);
    // Walkway top
    new BoundingBox(
      345,
      362,
      997,
      112,
      'walkwaytop'
    ).create(this, bunny.sprite);
    //beach top 1
    new BoundingBox(10, 379, 332, 74, 'beachtop').create(
      this,
      bunny.sprite
    );
    //beach bottom (water) 1
    new BoundingBox(
      705,
      647,
      273,
      118,
      'beachbottomwater'
    ).create(this, bunny.sprite);
    //beach bottom (water) 2
    new BoundingBox(
      602,
      650,
      101,
      53,
      'beachbottomwater2'
    ).create(this, bunny.sprite);
    //walkway top 2
    new BoundingBox(
      480,
      521,
      3600,
      20,
      'walkwaytop2'
    ).create(this, bunny.sprite);
    //walkway top 3
    new BoundingBox(449, 475, 27, 61, 'walkwaytop3').create(
      this,
      bunny.sprite
    );
  }
}

export { Beach };
