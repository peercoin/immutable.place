import {Colour, PixelCoord} from "coin-canvas-lib";
import {
  ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, MouseEvent
} from "react";
import "./PixelCanvas.css";

export interface PixelCanvasRef {
  getPixelOfMouseEvent: (e: MouseEvent) => { x: number, y: number } | null;
}

/* eslint-disable max-lines-per-function */
function PixelCanvas(
  {
    imgData,
    onHoverColour
  }: {
    imgData: ImageData
    onHoverColour: Colour | null
  },
  ref: ForwardedRef<PixelCanvasRef>
) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredPixelRef = useRef<PixelCoord | null>(null);

  const pixelCanvasRefObj = {
    getPixelOfMouseEvent: (e: MouseEvent) => {

      if (canvasRef.current === null) return null;
      const canvas = canvasRef.current;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
      const y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

      if (x < 0 || y < 0 || x >= imgData.width || y >= imgData.height) return null;

      return {
        x: Math.floor(x),
        y: Math.floor(y)
      };

    }
  };

  useImperativeHandle(ref, () => pixelCanvasRefObj);

  function getCanvasContext() {

    const canvas = canvasRef.current;
    if (canvas === null) return null;

    return canvas.getContext("2d");

  }

  useEffect(() => {

    const ctx = getCanvasContext();
    if (ctx === null) return;

    ctx.putImageData(imgData, 0, 0);

  });

  // Handle on hover visualisation of pixel colour selection
  function onMouseMove(e: MouseEvent) {

    if (onHoverColour === null) return;

    const pixel = pixelCanvasRefObj.getPixelOfMouseEvent(e);
    if (
      pixel?.x == hoveredPixelRef.current?.x
      && pixel?.y == hoveredPixelRef.current?.y
    ) return;

    hoveredPixelRef.current = pixel;

    if (pixel === null) return;

    const pixData = new Uint8ClampedArray(4);
    pixData[0] = onHoverColour.red;
    pixData[1] = onHoverColour.green;
    pixData[2] = onHoverColour.blue;
    pixData[3] = 0xff;

    const ctx = getCanvasContext();
    if (ctx === null) return;

    // Place canvas data and then overlay with single pixel of selected colour
    ctx.putImageData(imgData, 0, 0);
    ctx.putImageData(new ImageData(pixData, 1, 1), pixel.x, pixel.y);

  }

  return (
    <canvas
      className="pixel-canvas card"
      ref={canvasRef}
      width={imgData.width}
      height={imgData.height}
      onMouseMove={onHoverColour === null ? () => undefined : onMouseMove}
    />
  );

}
/* eslint-enable */

export default forwardRef(PixelCanvas);
