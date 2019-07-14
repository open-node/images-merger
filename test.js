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
