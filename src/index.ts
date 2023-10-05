import { sound } from "@pixi/sound";
import "./style.css";
import {
  Assets,
  Sprite,
  Application,
  Container,
  AnimatedSprite,
} from "pixi.js";

const gameWidth = 1136;
const gameHeight = 640;

const app = new Application({
  backgroundColor: 0xd3d3d3,
  width: gameWidth,
  height: gameHeight,
  antialias: true,
});

const stage = app.stage;

window.onload = async (): Promise<void> => {
  let selectedNumbers: number[] = [];

  const textures = await loadGameAssets();

  document.body.appendChild(app.view as any);

  resizeCanvas();

  const backgroundSprite = Sprite.from(textures.background);
  stage.addChild(backgroundSprite);

  const resultContainer = new Container();
  stage.addChild(resultContainer);

  const numberContainer = new Container();
  stage.addChild(numberContainer);

  const resultDefault = Sprite.from(textures.blank);
  const mysterySprite = Sprite.from(textures.mystery);
  const buttonSprite = Sprite.from(textures.button);

  const displayResult = (): void => {
    resultContainer.x = 500;
    resultContainer.y = 100;
    mysterySprite.height = 100;
    resultDefault.width = 150;
    resultDefault.height = 150;
    mysterySprite.anchor.set(0.5);
    mysterySprite.x = 80;
    mysterySprite.y = 75;
    resultContainer.addChild(resultDefault, mysterySprite);
  };

  const numbersSelection = (): void => {
    numberContainer.y = 200;
    numberContainer.sortableChildren = true;

    for (let i = 0; i < 9; i++) {
      let numberSprite = Sprite.from(textures[`sym${i + 1}`]);
      numberSprite.width = 100;
      numberSprite.height = 100;
      numberSprite.x = 100 + i * 110;
      numberSprite.y = 100;
      numberSprite.alpha = 0.5;
      numberSprite.interactive = true;
      numberSprite.cursor = "pointer";
      numberSprite.onclick = () => {
        if (selectedNumbers.length < 5) {
          stage.addChild(buttonSprite);
          selectedNumbers.push(i + 1);
          numberSprite.alpha = 1;
          sound.play("select");
        } else return;
      };
      numberContainer.addChild(numberSprite);
    }
  };

  const button = (): void => {
    buttonSprite.x = 500;
    buttonSprite.y = 450;
    buttonSprite.width = 175;
    buttonSprite.height = 150;
    buttonSprite.interactive = true;
    buttonSprite.cursor = "pointer";

    buttonSprite.onclick = () => {
      const numberTextures = [];
      for (let i = 1; i < 13; i++) {
        const randomOrder = Math.floor(Math.random() * (9 - 1) + 1);
        const texture = textures[`sym${randomOrder}`];
        numberTextures.push(texture);
      }

      const animatedSprite = new AnimatedSprite(numberTextures);
      animatedSprite.x = 0;
      animatedSprite.y = 0;
      animatedSprite.width = 150;
      animatedSprite.height = 150;
      animatedSprite.animationSpeed = 0.2;
      animatedSprite.play();
      resultContainer.removeChildren();
      resultContainer.addChild(animatedSprite);

      setTimeout(() => {
        showResult();
      }, 2000);

      const showResult = () => {
        const result = Math.floor(Math.random() * (9 - 1) + 1);
        const resultSprite = Sprite.from(textures[`sym${result}`]);
        resultSprite.width = 150;
        resultSprite.height = 150;
        resultContainer.removeChildren();
        resultContainer.addChild(resultSprite);

        if (selectedNumbers.includes(result)) {
          const winSprite = Sprite.from(textures.win);
          winSprite.x = 0;
          winSprite.y = 0;
          winSprite.interactive = true;
          winSprite.cursor = "pointer";
          winSprite.onclick = () => {
            selectedNumbers = [];
            numberContainer.children.forEach((child) => {
              child.alpha = 0.5;
            });
            resultContainer.removeChildren();
            resultContainer.addChild(resultDefault, mysterySprite);
            stage.removeChild(winSprite, buttonSprite);
          };

          stage.addChild(winSprite);
          sound.play("win_sound");
        } else {
          const loseSprite = Sprite.from(textures.lose);
          loseSprite.x = gameWidth / 2 - 100;
          loseSprite.y = 270;
          loseSprite.interactive = true;
          loseSprite.cursor = "pointer";
          stage.removeChild(buttonSprite);

          numberContainer.children.forEach((child) => {
            child.interactive = false;
          });

          loseSprite.onclick = () => {
            selectedNumbers = [];
            numberContainer.children.forEach((child) => {
              child.alpha = 0.5;
              child.interactive = true;
            });
            resultContainer.removeChildren();
            resultContainer.addChild(resultDefault, mysterySprite);
            stage.removeChild(loseSprite);
          };

          stage.addChild(loseSprite);
          sound.play("lose_sound");
        }
      };
    };
  };

  displayResult();
  numbersSelection();
  button();
};

async function loadGameAssets() {
  Assets.add("background", "assets/Background.png");
  Assets.add("button", "assets/button.png");
  Assets.add("blank", "assets/blank.png");
  Assets.add("lose", "assets/lose.png");
  Assets.add("win", "assets/win.png");
  Assets.add("mystery", "assets/mystery.png");
  Assets.add("sym1", "assets/sym1.png");
  Assets.add("sym2", "assets/sym2.png");
  Assets.add("sym3", "assets/sym3.png");
  Assets.add("sym4", "assets/sym4.png");
  Assets.add("sym5", "assets/sym5.png");
  Assets.add("sym6", "assets/sym6.png");
  Assets.add("sym7", "assets/sym7.png");
  Assets.add("sym8", "assets/sym8.png");
  Assets.add("sym9", "assets/sym9.png");
  Assets.add("spritesheet", "assets/spritesheet.json");
  sound.add("win_sound", "assets/win_sound.wav");
  sound.add("lose_sound", "assets/lose_sound.wav");
  sound.add("select", "assets/select.wav");

  return Assets.load([
    "background",
    "button",
    "blank",
    "lose",
    "win",
    "mystery",
    "sym1",
    "sym2",
    "sym3",
    "sym4",
    "sym5",
    "sym6",
    "sym7",
    "sym8",
    "sym9",
    "spritesheet",
  ]);
}

function resizeCanvas(): void {
  const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.scale.x = window.innerWidth / gameWidth;
    app.stage.scale.y = window.innerHeight / gameHeight;
  };

  resize();

  window.addEventListener("resize", resize);
}
