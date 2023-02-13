import './style.css';
import { Assets, Sprite, Application } from 'pixi.js';

const gameWidth = 1136;
const gameHeight = 640;

const app = new Application({
  backgroundColor: 0xd3d3d3,
  width: gameWidth,
  height: gameHeight,
});

const stage = app.stage;

window.onload = async (): Promise<void> => {
  const textures = await loadGameAssets();

  document.body.appendChild(app.view as any);

  resizeCanvas();

  const backgroundSprite = Sprite.from(textures.background);
  stage.addChild(backgroundSprite);
};

async function loadGameAssets() {
  Assets.add('background', 'assets/Background.png');
  Assets.add('button', 'assets/button.png');
  return Assets.load(['background', 'button']);
}

function resizeCanvas(): void {
  const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.scale.x = window.innerWidth / gameWidth;
    app.stage.scale.y = window.innerHeight / gameHeight;
  };

  resize();

  window.addEventListener('resize', resize);
}
