import { expect, test, describe } from "vitest";

import { makeTestImage } from "@jimp/test-utils";
import { createJimp } from "@jimp/core";

import { methods } from "./index.js";

const Jimp = createJimp({ plugins: [methods] });

describe("Circle", () => {
  test("makes a circle based on image height and width", () => {
    const imgSrc = Jimp.fromBitmap(
      makeTestImage(
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
      ),
    );

    expect(imgSrc.circle()).toMatchSnapshot();
  });

  test("makes a circle using provided radius", () => {
    const imgSrc = Jimp.fromBitmap(
      makeTestImage(
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
      ),
    );

    expect(imgSrc.circle({ radius: 3 })).toMatchSnapshot();
  });

  test("should ", () => {
    const imgSrc = Jimp.fromBitmap(
      makeTestImage(
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
        "▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦",
      ),
    );

    expect(imgSrc.circle({ radius: 5, x: 5, y: 5 })).toMatchSnapshot();
  });

  test("keeps source alpha when anti-aliasing the edge", () => {
    const imgSrc = new Jimp({ width: 64, height: 64, color: 0xffffff80 });

    imgSrc.circle();

    // dimensions are untouched
    expect(imgSrc.bitmap.width).toBe(64);
    expect(imgSrc.bitmap.height).toBe(64);
    // the center keeps the source alpha
    expect(imgSrc.getPixelColor(32, 32)).toBe(0xffffff80);
    // corners outside the circle are fully transparent
    expect(imgSrc.getPixelColor(0, 0)).toBe(0xffffff00);
    expect(imgSrc.getPixelColor(63, 63)).toBe(0xffffff00);
    // the anti-aliased edge may only ever reduce the source alpha
    imgSrc.scan((_, __, idx) => {
      expect(imgSrc.bitmap.data[idx + 3]).toBeLessThanOrEqual(0x80);
    });
    // this pixel used to be boosted to 250 by the edge anti-aliasing
    expect(imgSrc.bitmap.data[imgSrc.getPixelIndex(31, 1) + 3]).toBeLessThan(
      0x80,
    );
  });
});
