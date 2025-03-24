// Live2DClient.js
import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import live2D_CSS from "./live2d.module.css";
const { Live2DModel } = require('pixi-live2d-display/lib/cubism4');

declare global {
  interface Window {
    PIXI: typeof PIXI;
  }
}

if (typeof window !== 'undefined') {
  window.PIXI = PIXI;
  Live2DModel.registerTicker(PIXI.Ticker);
}

export default function Live2DClient() {
  useEffect(() => {
    const app = new PIXI.Application({
      view: document.getElementById('canvas') as HTMLCanvasElement,
      autoStart: true,
      resizeTo: window,
      transparent: true, // 设置透明背景
    });

    Live2DModel.from('./Hiyori/Hiyori.model3.json').then((model) => {
      app.stage.addChild(model);

      model.anchor.set(0.5, 1);  // 底部对齐
      model.position.set(window.innerWidth / 2, window.innerHeight);  // 居中并对齐底部
      model.scale.set(0.65, 0.17);

      model.on('hit', () => {
        model.motion('Tap@Body');
      });
    });
  }, []);

  return <canvas className={live2D_CSS.Live2D} id="canvas"/>;
}
