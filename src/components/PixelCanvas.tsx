import {Colour, PixelCoord} from "coin-canvas-lib";
import {
  ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, MouseEvent, useState
} from "react";
import "./PixelCanvas.scss";

export interface PixelCanvasRef {
  getPixelOfMouseEvent: (e: MouseEvent) => PixelCoord | null;
}

/* eslint-disable max-lines-per-function */
function PixelCanvas(
  {
    imgData,
    hoverColour,
    onPixelHover
  }: {
    imgData: ImageData
    hoverColour: Colour | null
    onPixelHover: (pixel: PixelCoord | null) => void
  },
  ref: ForwardedRef<PixelCanvasRef>
) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPixel, setHoveredPixel] = useState<PixelCoord | null>(null);

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

  useEffect(() => {

    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    ctx.putImageData(imgData, 0, 0);

    if (hoverColour === null || hoveredPixel === null) return;

    // With a hover colour and pixel, show this to the user

    const pixData = new Uint8ClampedArray(4);
    pixData[0] = hoverColour.red;
    pixData[1] = hoverColour.green;
    pixData[2] = hoverColour.blue;
    pixData[3] = 0xff;

    ctx.putImageData(
      new ImageData(pixData, 1, 1), hoveredPixel.x, hoveredPixel.y
    );

  });

  // Handle on hover visualisation of pixel colour selection and callback for
  // hovered pixel
  function onMouseMove(e: MouseEvent) {

    const pixel = pixelCanvasRefObj.getPixelOfMouseEvent(e);

    if (
      pixel?.x == hoveredPixel?.x
      && pixel?.y == hoveredPixel?.y
    ) return;

    setHoveredPixel(pixel);
    onPixelHover(pixel);

  }

  return (
    <canvas
      className="pixel-canvas card"
      ref={canvasRef}
      width={imgData.width}
      height={imgData.height}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseMove}
    />
  );

}
/* eslint-enable */

export default forwardRef(PixelCanvas);
