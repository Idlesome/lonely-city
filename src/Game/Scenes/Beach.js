import Phaser from 'phaser';

import { Background } from '../Common/Background';
import { Bunny } from '../Common/Character/Bunny';
import { Cursor } from '../Common/Scene/Cursor';
import { BoundingBox } from '../Common/Scene/BoundingBox';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GAME_SCALE,
  SCENE_FADE_DURATION,
} from '../config';

const SCENE_WIDTH = GAME_WIDTH * 4;
// const SCENE_HEIGHT = GAME_HEIGHT;

// A list of our assets so we can load them in using
// fewer lines of code
const layers = [
  {
    name: '01walkway',
    pallaxFactor: 1,
  },
  {
    name: '02clouds',
    pallaxFactor: 0.08,
    passiveX: 0.08,
  },
  {
    name: '03mountains',
    pallaxFactor: 0.16,
  },
];

class Beach extends Phaser.Scene {
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
    super({ key: 'Beach' });
  }

  /**
   * This stuff loads before the game starts; stuff like scenes and whatnot.
   */
  preload() {
    layers.forEach(
      ({ name, pallaxFactor, passiveX }) =>
        (this.backgrounds[name] = new Background({
          sceneName: 'Beach',
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

    this.sprites.bunny.create(101, 596);
    this.sprites.cursor.create();

    this.createBoundingBoxes();

    this.cameras.main.fadeIn(SCENE_FADE_DURATION, 0, 0, 0);

    this.cameras.main.setBounds(
      0,
      0,
      SCENE_WIDTH,
      GAME_HEIGHT
    );
    this.physics.world.setBounds(
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
        this.endScene();

        this.lastClickX =
          pointer.x + scene.cameras.main._scrollX;
        this.lastClickY =
          pointer.y + scene.cameras.main._scrollY;
      },
      this
    );
  }

  endScene() {
    this.cameras.main.fade(SCENE_FADE_DURATION, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start('Archway');
      }
    );
  }

  update() {
    this.sprites.bunny.update();
    this.sprites.cursor.update();

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

export { Beach };
