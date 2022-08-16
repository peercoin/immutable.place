import {Colour, PixelCoord} from "coin-canvas-lib";
import {
  ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, MouseEvent, useState
} from "react";
import useCursorRef, {CursorPos} from "../hooks/useCursorRef";
import "./PixelCanvas.scss";

export interface PixelCanvasRef {
  notifyMove: () => void;
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

  // Update hovered pixel when mouse moves and ensure cursor position is updated

  function pixelOfCursorPosition(cursor: CursorPos | null): PixelCoord | null {

    const canvas = canvasRef.current;
    if (canvas === null || cursor === null) return null;

    const rect = canvas.getBoundingClientRect();
    const x = (cursor.x - rect.left) / (rect.right - rect.left) * canvas.width;
    const y = (cursor.y - rect.top) / (rect.bottom - rect.top) * canvas.height;

    if (x < 0 || y < 0 || x >= imgData.width || y >= imgData.height) return null;

    return {
      x: Math.floor(x),
      y: Math.floor(y)
    };

  }

  function handleNewCursorPos(cursor: CursorPos | null) {

    const pixel = pixelOfCursorPosition(cursor);

    if (
      pixel?.x == hoveredPixel?.x
    && pixel?.y == hoveredPixel?.y
    ) return;

    setHoveredPixel(pixel);
    onPixelHover(pixel);

  }

  const cursorRef = useCursorRef(handleNewCursorPos);

  const pixelCanvasRefObj = {

    // Called whenever the pixel being hovered over may change.
    // Updates the hovered pixel
    notifyMove: () => handleNewCursorPos(cursorRef.current),

    // This could be different from the hovered pixel in the event of a tap
    getPixelOfMouseEvent: (e: MouseEvent) => pixelOfCursorPosition({
      x: e.clientX,
      y: e.clientY
    })

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

  return (
    <canvas
      className="pixel-canvas card"
      ref={canvasRef}
      width={imgData.width}
      height={imgData.height}
    />
  );

}
/* eslint-enable */

export default forwardRef(PixelCanvas);
