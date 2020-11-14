import Phaser from 'phaser';

import { GAME_HEIGHT, SCENE_FADE_DURATION } from 'config';

let sceneTransitioning = false;
export function startSceneOnWorldBounds(
  side:string,
  nextSceneName:string,
  scene:Phaser.Scene
) {
  scene.physics.world.on(
    'worldbounds',
    (body, up, down, left, right) => {
      const sides = { up, down, left, right };
      if (!sceneTransitioning && sides[side]) {
        startScene(nextSceneName, scene);
      }
    }
  );
}

export function startScene(sceneName:string, scene:Phaser.Scene) {
  sceneTransitioning = true;
  scene.cameras.main.fade(SCENE_FADE_DURATION, 0, 0, 0);
  scene.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      scene.scene.start(sceneName);
    }
  );
}

export function setupCamera(
  scene,
  SCENE_WIDTH,
  SCENE_HEIGHT = GAME_HEIGHT
) {
  scene.cameras.main.fadeIn(SCENE_FADE_DURATION, 0, 0, 0);
  scene.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
    () => {
      sceneTransitioning = false;
    }
  );

  scene.cameras.main.setBounds(
    0,
    0,
    SCENE_WIDTH,
    SCENE_HEIGHT
  );
  scene.physics.world.setBounds(
    0,
    0,
    SCENE_WIDTH,
    SCENE_HEIGHT
  );
  scene.cameras.main.startFollow(
    scene.sprites.bunny.sprite,
    true
  );
}

// function setupFullscreenHandler() {
//   var FKey = this.input.keyboard.addKey('F');

//   FKey.on(
//     'down',
//     function () {
//       if (this.scale.isFullscreen) {
//         this.scale.stopFullscreen();
//       } else {
//         this.scale.startFullscreen();
//       }
//     },
//     this
//   );
// }
