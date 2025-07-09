# 环境配置

## 初始化npm：

```bash
npm init
```

也可以手动生成，示例：

```json
{
  "name": "hana-zero-client",
  "version": "0.0.1",
  "description": "Hana Zero Client",
  "license": "ISC",
  "author": "Harry Sun <harrysunv9x@outlook.com>",
  "type": "commonjs",
  "main": "index.js",
  "scripts": {
    "start": "electron .",                  // 这里要手动添加一下
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 引入electorn

使用官网安装会卡主，可以使用cnpm安装：

```bash
npm install -g cnpm
cnpm install electron --save-dev
```
