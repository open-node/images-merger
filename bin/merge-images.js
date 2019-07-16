#!/usr/bin/env node

const { createCanvas, Image } = require("canvas");
const fs = require("fs");
const Merger = require("../src/merger");

(async () => {
  const startAt = Date.now();
  const dir = process.argv[2];
  const file = process.argv[3];
  const scale = process.argv[4];
  if (!dir || !file) {
    console.log("请指定要合并的图片目录");
    console.log("Example: images-merge-cli ./images ./images/atlas 0.5");
    return;
  }
  const files = fs.readdirSync(dir).map(x => `${dir}/${x}`);

  const canvas = createCanvas();
  const merger = new Merger(canvas, Image);
  const [data, map] = await merger.merge(files, +scale);
  fs.writeFileSync(`${file}.png`, data);
  fs.writeFileSync(`${file}.map`, map.map(x => x.join(" ")).join("\n"));

  const endAt = Date.now();
  const ms = endAt - startAt;
  console.log("合并完毕， 总共合并了 %d 张图片, 用时 %s ms", files.length, ms);
  console.log(
    "合并后的图片路径:\n %s, 定位信息:\n %s",
    `${file}.png`,
    `${file}.map`
  );
})();
