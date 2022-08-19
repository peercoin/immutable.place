/* eslint-disable max-classes-per-file */

import {Colour, PixelCoord} from "coin-canvas-lib";
import {useEffect, useRef} from "react";

// Number of pixels to show around centre pixel
const PREVIEW_RADIUS = 3;
const PREVIEW_WIDTH = PREVIEW_RADIUS*2+1;
const PREVIEW_PIXEL_N = PREVIEW_WIDTH**2;

/* eslint-disable max-lines-per-function */
export default function CanvasPreview(
  {
    pixel,
    showColour,
    imgData
  } : {
    pixel: PixelCoord,
    showColour: Colour | null,
    imgData: ImageData
  }
) {

  const previewRef = useRef<HTMLCanvasElement>(null);

  // Show previous canvas
  useEffect(() => {

    const canvas = previewRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    // Get 5x5 preview ImageData
    const fullData = imgData.data;

    const previewData = new Uint8ClampedArray(PREVIEW_PIXEL_N*4);

    for (let i = 0; i < PREVIEW_PIXEL_N; i++) {

      const srcX = pixel.x + (i % PREVIEW_WIDTH) - PREVIEW_RADIUS;
      const srcY = pixel.y + Math.floor(i / PREVIEW_WIDTH) - PREVIEW_RADIUS;

      // If within canvas, set to colour or else white.
      if (srcX >= 0 && srcX < imgData.width && srcY >= 0 && srcY < imgData.height) {
        const srcOff = (srcX + srcY*imgData.width)*4;
        previewData.set(fullData.subarray(srcOff, srcOff+4), i*4);
      } else {
        previewData.fill(255, i*4, i*4+4);
      }

    }

    if (showColour !== null) {
      const midOff = Math.floor(PREVIEW_PIXEL_N / 2)*4;
      previewData[midOff] = showColour.red;
      previewData[midOff+1] = showColour.green;
      previewData[midOff+2] = showColour.blue;
    }

    ctx.putImageData(new ImageData(previewData, PREVIEW_WIDTH, PREVIEW_WIDTH), 0, 0);

  }, [imgData, pixel, showColour]);

  return <canvas
    ref={previewRef}
    className="pixel-preview"
    width={PREVIEW_WIDTH}
    height={PREVIEW_WIDTH}
  />;

}

