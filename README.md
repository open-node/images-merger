# images-merger

用来将多个小图片自动合成一个大图(透明背景 png 类型), 一般为了减少站点小图片的请求次数, 加速网站或游戏的加载

<pre>
npm install images-merger --save
<pre>

```js
// In browser
// <input type="file" id="select-imgs" multiple accept="image/*">

const merger = new Merger(document.getElementById('mycanvas'), Image);
const input = document.getElementById('select-imgs');
input.onchange = async () => {
  const [data, map] = await merger.merge(input.files);
  console.log(data); // 合并后的图片数据，base64
  console.log(map); // 合并后的图片名字、定位、宽高信息
};
```

```js
// In node.js
// npm install canvas --save
const { createCanvas, Image } = require("canvas");
const fs = require("fs");
const Merger = require("./src/merger");

(async () => {
  const dir = process.argv[2];
  const files = fs.readdirSync(dir).map(x => `${dir}/${x}`);

  const canvas = createCanvas();
  const merger = new Merger(canvas, Image);
  const [data, map] = await merger.merge(files);
  fs.writeFileSync("./test.png", data);
  fs.writeFileSync("./test.map", map.map(x => x.join(" ")).join("\n"));
})();
```
