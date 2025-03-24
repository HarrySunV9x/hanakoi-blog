---
title: window 变量的使用
date: 2025-03-24
---

## 一、JavaScript 中的 `window`

### 1. **基本概念**

- **全局对象**：在浏览器中，`window` 是全局作用域的顶层对象，所有全局变量和函数（如 `document`、`console`、`setTimeout`）都是 `window` 的属性和方法。
- **窗口表示**：`window` 还代表当前浏览器窗口或标签页，提供操作窗口的能力（如打开新窗口、调整尺寸）。

### 2. **常见属性和方法**

|         属性/方法         |                             说明                             |
| :-----------------------: | :----------------------------------------------------------: |
|     `window.document`     |             返回当前窗口的文档对象（DOM 树入口）             |
|     `window.location`     | 控制 URL（如跳转页面 `window.location.href = 'https://example.com'`） |
|   `window.localStorage`   |                持久化存储键值对（跨会话保存）                |
|  `window.sessionStorage`  |              临时存储键值对（关闭标签页后失效）              |
|    `window.setTimeout`    |                         延迟执行函数                         |
| `window.addEventListener` |            监听窗口事件（如 `resize`、`scroll`）             |

### 3. **操作全局变量**

```javascript
// 定义全局变量（等同于直接赋值给 window）
var globalVar = "Hello";
console.log(window.globalVar); // "Hello"

// 注意：let/const 声明的变量不属于 window（属于块级作用域）
let localVar = "Secret";
console.log(window.localVar); // undefined
```

### 4. **跨窗口通信**

```javascript
// 打开新窗口
const newWindow = window.open("https://example.com");

// 向父窗口发送消息（需同源）
window.opener.postMessage("Hello from child", "https://parent-origin.com");

// 接收消息
window.addEventListener("message", (event) => {
  if (event.origin === "https://trusted-origin.com") {
    console.log(event.data); // 安全处理消息
  }
});
```

------

## 二、TypeScript 中的 `window`

### 1. **类型定义**

- **内置接口**：TypeScript 通过 `lib.dom.d.ts` 定义了 `Window` 接口，包含标准属性和方法。
- **扩展全局属性**：若需添加自定义属性（如 `FB`），需通过 **声明合并** 扩展全局 `Window` 接口。

### 2. **扩展全局类型**

#### 方法一：全局声明文件 (`*.d.ts`)

```typescript
// global.d.ts
declare interface Window {
  FB: any; // 更推荐具体类型（如 FB SDK 的类型）
}
```

#### 方法二：模块内扩展（需在模块中）

```typescript
// 在模块文件中（有 import/export）
declare global {
  interface Window {
    FB: any;
  }
}

// 使用
const FB = window.FB; // 类型安全
```

### 3. **避免 `any` 陷阱**

```typescript
// ❌ 危险：禁用类型检查
declare const window: any;

// ✅ 安全：精确类型
declare global {
  interface Window {
    FB: typeof import('facebook-js-sdk').FB;
  }
}
```