import Phaser from 'phaser';

import { Archway } from './Scenes/Archway';

import { GAME_WIDTH, GAME_HEIGHT } from './config';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'mindcops',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: 'mindcops',
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
      debug: false,
    },
  },
  pixelArt: true,
  fps: {
    target: 16,
    forceSetTimeOut: true,
  },
  scene: [
    Archway,
    // , TitleScene, GameScene
  ],
};
const game = new Phaser.Game(config);
