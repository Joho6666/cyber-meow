# 赛博喵 CYBER MEOW 🐱

**🐾 在线试玩：<https://joho6666.github.io/cyber-meow/>**（手机浏览器打开体验最佳，可添加到主屏幕离线玩）

一个手机优先的网页养猫小游戏：喂食、洗澡、梳毛、陪玩、换装，还有卧室 / 厨房 / 浴室 / 花园四个场景，可以种菜、烤料理、扑蝴蝶。纯静态页面，无需构建，支持添加到手机主屏幕，离线可玩。

## 目录

- `cyber-meow/` — 游戏本体（部署这个文件夹即可）
  - `cat.js` 程序化毛发小猫模型　`art.js` 帽子与房间美术　`scenes.js` 各场景　`game.js` 游戏逻辑
  - `sw.js` / `manifest.webmanifest` — PWA 离线与桌面图标
  - `lab.html` — 小猫写真棚（查看模型细节）
- `naigao/` — 早期的杂志封面风格小猫原型
- `_fonts/` — 字体裁剪脚本（原始 .ttf 需自行从 Google Fonts 下载 ZCOOL KuaiLe / Silkscreen）

## 本地运行

```bash
python -m http.server 5175 --directory cyber-meow
```

然后打开 http://localhost:5175 。

## 部署

把 `cyber-meow` 文件夹拖到 [Netlify Drop](https://app.netlify.com/drop)，或：

```bash
npx netlify-cli deploy --prod --dir cyber-meow
```

存档保存在浏览器本地（localStorage）。字体：ZCOOL KuaiLe、Silkscreen（SIL OFL）。
