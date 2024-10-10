"use client"
import React, { useRef, useEffect, useState } from 'react';
import live2D_CSS from "./live2d.module.css";

export default function Live2D({live2Dclick}) {
    const canvasRef = useRef(null);

    // 绘制2D小人
    const drawPerson = (ctx, canvas) => {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 画头部
        ctx.beginPath();
        ctx.arc(100, 50, 30, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();

        // 画身体
        ctx.fillStyle = 'blue';
        ctx.fillRect(85, 80, 30, 70);

        // 画左手
        ctx.fillStyle = 'blue';
        ctx.fillRect(55, 80, 30, 10);

        // 画右手
        ctx.fillStyle = 'blue';
        ctx.fillRect(115, 80, 30, 10);

        // 画左脚
        ctx.fillStyle = 'blue';
        ctx.fillRect(90, 150, 10, 30);

        // 画右脚
        ctx.fillStyle = 'blue';
        ctx.fillRect(105, 150, 10, 30);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        drawPerson(ctx, canvas);

        // 处理点击事件
        const handleClick = live2Dclick;

        canvas.addEventListener('click', handleClick);

        // 清除事件监听器
        return () => {
            canvas.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <canvas className={live2D_CSS.Live2D} ref={canvasRef} width={150} height={200}></canvas>
    );
}