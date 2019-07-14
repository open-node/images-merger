/**
 * config 结构
 * {
 *   canvas: element or canvas // canvas dom 对象或者 node 下 canvas 对象
 *   Image: Function, // 实例化图片的构造函数
 * }
 */
// 利用canvas
class Merger {
  constructor(canvas, Image) {
    this.canvas = canvas;
    this.Image = Image;
    this.ctx = this.canvas.getContext("2d");
  }

  async merge(urls) {
    const imgs = await this.loadImages(urls);
    const map = [];
    const gap = 10; // 图像之间的缝隙

    const maxWidth = imgs.reduce((m, x) => Math.max(m, x.width), 0);
    const maxHeight = imgs.reduce((m, x) => m + x.height + gap, 0);

    this.canvas.width = maxWidth;
    this.canvas.height = maxHeight;

    let y = 0;
    const x = 0;
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      let name = "";
      if (typeof File === "function" && url instanceof File) {
        name = url.name.split(".").shift();
      } else {
        name = url
          .split("/")
          .pop()
          .split(".")
          .shift();
      }
      const { width, height } = imgs[i];
      this.ctx.drawImage(imgs[i], x, y);
      map.push([name, x, y, width, height]);
      y += height + gap;
    }

    return [this.getData(), map];
  }

  /** 获取数据，用于保存图片 */
  getData() {
    if (this.canvas.toBuffer) return this.canvas.toBuffer();
    return this.canvas.toDataURL();
  }

  /** 加载图片所有的图片，准备开始拼接 */
  loadImages(urls) {
    const imgs = [];
    let count = 0;
    const { length } = urls;
    return new Promise((resolve, reject) => {
      for (let i = 0; i < urls.length; i += 1) {
        const img = new this.Image();
        const url = urls[i];
        img.onerror = reject;
        img.onload = () => {
          imgs[i] = img;
          count += 1;
          if (count === length) resolve(imgs);
        };
        if (typeof File === "function" && url instanceof File) {
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => {
              img.src = reader.result;
            },
            false
          );

          reader.readAsDataURL(url);
        } else {
          img.src = url;
        }
      }
    });
  }
}

module.exports = Merger;
