import {
  GAME_CENTER_X,
  GAME_CENTER_Y,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '../config';

/**
 * Background generator class
 *
 * TODO: refactor this to use better context/this
 */
class Background {
  assetName = null;
  sceneName = null;
  tileSprite = null;
  context = null;
  passiveX = null;

  /**
   * A background tile sprite
   *
   * @param {*} sceneName the name of the scene
   * @param {*} assetName the name of the asset
   */
  constructor({
    sceneName,
    assetName,
    pallaxFactor,
    context,
    passiveX = null,
  }) {
    this.sceneName = sceneName;
    this.assetName = assetName;
    this.pallaxFactor = pallaxFactor;
    this.context = context;
    this.passiveX = passiveX;

    // Automatically preload asset
    this.preload();
  }

  preload() {
    const { assetName, sceneName, context } = this;

    context.load.image(
      assetName,
      `public/scenes/${sceneName}/${assetName}.png`
    );
  }

  /**
   *
   * @param {*} container The phaser container to add sprite into
   * @param backgroundWidth The width of the background
   *
   * backgroundWidth can be as big as you want and it will
   * continue to repeat
   */
  create(container, backgroundWidth) {
    const { assetName, context } = this;
    // Create a new tileSprite!
    this.tileSprite = context.add
      // The numbers are the dimensions; x,y,w,h
      // name here is what tells it which background to use
      // we actually set that up in preload
      .tileSprite(
        0,
        GAME_CENTER_Y,
        backgroundWidth,
        GAME_HEIGHT,
        assetName
      )
      // Give it a name... we don't really need to do this
      // but it might be useful one day
      .setName(`${assetName}-tile`);

    container.add(this.tileSprite);

    this.tileSprite.setScrollFactor(this.pallaxFactor, 1);
  }

  update() {
    // Clouds breeze passive movement
    if (this.passiveX)
      this.tileSprite.tilePositionX += this.passiveX;
  }
}

export { Background };
