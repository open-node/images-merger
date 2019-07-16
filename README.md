# images-merger

用来将多个小图片自动合成一个大图(透明背景 png 类型), 一般为了减少站点小图片的请求次数, 加速网站或游戏的加载

<pre>
npm install images-merger --save
</pre>

## In browser
```js
// <input type="file" id="select-imgs" multiple accept="image/*">

const merger = new Merger(document.getElementById('mycanvas'), Image);
const input = document.getElementById('select-imgs');
input.onchange = async () => {
  const [data, map] = await merger.merge(input.files);
  console.log(data); // 合并后的图片数据，base64
  console.log(map); // 合并后的图片名字、定位、宽高信息
};
```

## In node.js
```js
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

## In cli
<pre>npm install images-merger -g</pre>

```
// 第一个参数为要合并的原始图片目录路径
// 第二参数为要生成的图片路径（不需要后缀）
// scale 可选的等比缩放比例， (0, 1] 默认为 1
images-merger-cli ./sources-images-dir-path ./target-file-name-widthout-ext [scale]
```
