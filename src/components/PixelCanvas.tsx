import {Colour, PixelCoord} from "coin-canvas-lib";
import {
  ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, MouseEvent,
  useState, useCallback, useMemo
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
    onPixelHover,
    activePixel,
    scale
  }: {
    imgData: ImageData
    hoverColour: Colour | null
    onPixelHover: (pixel: PixelCoord | null) => void,
    activePixel: PixelCoord | null,
    scale: number
  },
  ref: ForwardedRef<PixelCanvasRef>
) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [repaintId, setRepaintId] = useState<number>(0);
  const [hoveredPixel, setHoveredPixel] = useState<PixelCoord | null>(null);

  // Update hovered pixel when mouse moves and ensure cursor position is updated

  const pixelOfCursorPosition = useCallback(
    (cursor: CursorPos | null): PixelCoord | null => {

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

    },
    [canvasRef, imgData.width, imgData.height]
  );

  const handleNewCursorPos = useCallback((cursor: CursorPos | null) => {

    // Do not set hovered pixel, when a pixel is active (open in modal), as the
    // active pixel will be shown instead.
    if (activePixel !== null) return;

    const pixel = pixelOfCursorPosition(cursor);

    if (
      pixel?.x == hoveredPixel?.x
      && pixel?.y == hoveredPixel?.y
    ) return;

    // Repaint when the hovered position changes, unless the colour is null
    // It might be better to set the specific pixel to repaint for efficiency.
    if (hoverColour !== null)
      setRepaintId(repaintId + 1);

    setHoveredPixel(pixel);
    onPixelHover(pixel);

  }, [
    activePixel, pixelOfCursorPosition, hoverColour, hoveredPixel, onPixelHover,
    repaintId
  ]);

  const cursorRef = useCursorRef(handleNewCursorPos);

  // When the canvas is re-rendered, there may not be an active pixel any more
  // and the hovered pixel would therefore need to be set according to the
  // cursor position.
  useEffect(
    () => handleNewCursorPos(cursorRef.current),
    [handleNewCursorPos, activePixel, cursorRef]
  );

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

  const getCanvasCtx = useCallback(
    () => canvasRef.current?.getContext("2d", { alpha: false }) ?? null,
    []
  );

  // Repaint imgData whenever it changes or the canvas needs refreshing with a
  // new repaintId
  // It should be more efficient to replace repaintId with another state
  // variable, perhaps `resetPixel` to reset a particular pixel that was the old
  // hovered pixel.
  useEffect(
    () => getCanvasCtx()?.putImageData(imgData, 0, 0),
    [getCanvasCtx, imgData, hoverColour, repaintId]
  );

  // Scale canvas
  useEffect(
    () => {

      const canvas = canvasRef.current;
      if (canvas === null) return;

      canvas.style.width = `${imgData.width*scale}px`;
      canvas.style.height = `${imgData.height*scale}px`;

    },
    [imgData.height, imgData.width, scale]
  );

  useEffect(() => {

    const ctx = getCanvasCtx();

    if (ctx === null || hoverColour === null || hoveredPixel === null) return;

    // Show the pixel that is currently provided as "active" or else the pixel
    // that is being hovered over
    const pixelToColour = activePixel ?? hoveredPixel;

    // With a hover colour and pixel, show this to the user

    const pixData = new Uint8ClampedArray(4);
    pixData[0] = hoverColour.red;
    pixData[1] = hoverColour.green;
    pixData[2] = hoverColour.blue;
    pixData[3] = 0xff;

    ctx.putImageData(
      new ImageData(pixData, 1, 1), pixelToColour.x, pixelToColour.y
    );

  }, [getCanvasCtx, activePixel, hoveredPixel, hoverColour, imgData]);

  return useMemo(() => <canvas
    className="pixel-canvas"
    ref={canvasRef}
    width={imgData.width}
    height={imgData.height}
  />, [imgData.height, imgData.width]);

}
/* eslint-enable */

export default forwardRef(PixelCanvas);
