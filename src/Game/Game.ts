import Phaser from 'phaser';

import { Archway } from './Scenes/Archway';
import { Beach } from './Scenes/Beach';

import { GAME_WIDTH, GAME_HEIGHT, DEBUG } from './config';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'lonely-city',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: 'lonely-city',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  // scene: {
  //   preload: preload,
  //   create: create,
  //   update,
  // },
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
    },
  },
  pixelArt: true,
  fps: {
    target: 16,
    forceSetTimeOut: true,
  },
  scene: [
    Beach,
    Archway,
    // , TitleScene, GameScene
  ],
};
// Disabled because this might be useful in future
// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
