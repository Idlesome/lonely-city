import * as Phaser from 'phaser';

/**
 * Our own generic sprite type
 */
type Sprite = {
  sprite: Phaser.GameObjects.Sprite;
  create: (x?: number, y?: number) => void;
  update: () => void;
};
export { Sprite };
