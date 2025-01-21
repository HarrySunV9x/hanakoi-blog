"use client"
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from "./live2d.module.css";

// 使用 dynamic 禁用 SSR
const Live2DClient = dynamic(() => import('./Live2DClient'), {
  ssr: false, // 禁用 SSR
});

export default function Live2D() {
  return <Live2DClient />;
}
