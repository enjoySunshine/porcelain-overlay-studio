import { expect, test, describe } from "vitest";
import { createJimp } from "@jimp/core";
import jpeg from "@jimp/js-jpeg";
import png from "@jimp/js-png";
import { makeTestImage } from "@jimp/test-utils";

import * as blit from "./index.js";

const Jimp = createJimp({ formats: [jpeg, png], plugins: [blit.methods] });

describe("Blit over image", function () {
  const targetImg = Jimp.fromBitmap(
    makeTestImage(
      "▴▴▴▴▸▸▸▸",
      "▴▴▴▴▸▸▸▸",
      "▴▴▴▴▸▸▸▸",
      "▴▴▴▴▸▸▸▸",
      "▾▾▾▾◆◆◆◆",
      "▾▾▾▾◆◆◆◆",
      "▾▾▾▾◆◆◆◆",
      "▾▾▾▾◆◆◆◆",
    ),
  );
  // stores the Jimp instances of the JGD images above.
  // prettier-ignore
  const srcImg = Jimp.fromBitmap(makeTestImage(
    "□□□□□□",
    "□▥▥▥▥□",
    "□▥■■▥□",
    "□▥■■▥□",
    "□▥▥▥▥□",
    "□□□□□□"
  ));

  test("blit on top, with no crop", () => {
    expect(targetImg.clone().blit(srcImg)).toMatchSnapshot();
  });

  test("blit on middle, with no crop", () => {
    expect(
      targetImg.clone().blit({ src: srcImg, x: 1, y: 1 }),
    ).toMatchSnapshot();
  });

  test("blit on middle, with x,y crop", () => {
    expect(
      targetImg
        .clone()
        .blit({ src: srcImg, x: 2, y: 2, srcX: 1, srcY: 1, srcW: 5, srcH: 5 }),
    ).toMatchSnapshot();
  });

  test("blit on middle, with x,y,w,h crop", () => {
    expect(
      targetImg
        .clone()
        .blit({ src: srcImg, x: 2, y: 2, srcX: 1, srcY: 1, srcW: 4, srcH: 4 }),
    ).toMatchSnapshot();
  });

  test("blit partially out, on top-left", () => {
    expect(
      targetImg.clone().blit({ src: srcImg, x: -1, y: -1 }),
    ).toMatchSnapshot();
  });

  test("blit partially out, on bottom-right", () => {
    expect(
      targetImg.clone().blit({ src: srcImg, x: 3, y: 3 }),
    ).toMatchSnapshot();
  });
});

describe("Blit alpha compositing", function () {
  test("keeps source color when blitting semi-transparent white over transparent", () => {
    const src = new Jimp({ width: 2, height: 2, color: 0xffffff80 });
    const target = new Jimp({ width: 4, height: 4, color: 0x00000000 });

    target.blit({ src, x: 1, y: 1 });

    expect(target.getPixelColor(1, 1)).toBe(0xffffff80);
    expect(target.getPixelColor(2, 2)).toBe(0xffffff80);
    // pixels not covered by the source stay fully transparent
    expect(target.getPixelColor(0, 0)).toBe(0x00000000);
    expect(target.getPixelColor(3, 3)).toBe(0x00000000);
  });

  test("blits semi-transparent white over opaque black", () => {
    const src = new Jimp({ width: 1, height: 1, color: 0xffffff80 });
    const target = new Jimp({ width: 1, height: 1, color: 0x000000ff });

    target.blit({ src });

    expect(target.getPixelColor(0, 0)).toBe(0x808080ff);
  });

  test("blits semi-transparent white over opaque blue", () => {
    const src = new Jimp({ width: 1, height: 1, color: 0xffffff80 });
    const target = new Jimp({ width: 1, height: 1, color: 0x0000ffff });

    target.blit({ src });

    expect(target.getPixelColor(0, 0)).toBe(0x8080ffff);
  });

  test("blits opaque red over transparent", () => {
    const src = new Jimp({ width: 1, height: 1, color: 0xff0000ff });
    const target = new Jimp({ width: 1, height: 1, color: 0x00000000 });

    target.blit({ src });

    expect(target.getPixelColor(0, 0)).toBe(0xff0000ff);
  });

  test("accumulates alpha with the over operator when blitting twice", () => {
    const src = new Jimp({ width: 1, height: 1, color: 0xffffff80 });
    const target = new Jimp({ width: 1, height: 1, color: 0x00000000 });

    target.blit({ src });
    expect(target.getPixelColor(0, 0)).toBe(0xffffff80);

    target.blit({ src });
    expect(target.getPixelColor(0, 0)).toBe(0xffffffbf);
  });

  test("leaves destination untouched by fully transparent source pixels", () => {
    const src = new Jimp({ width: 1, height: 1, color: 0xffffff00 });
    const target = new Jimp({ width: 1, height: 1, color: 0x12345678 });

    target.blit({ src });

    expect(target.getPixelColor(0, 0)).toBe(0x12345678);
  });
});
