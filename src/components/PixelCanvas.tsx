import {
  ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, MouseEvent
} from "react";
import "./PixelCanvas.css";

export interface PixelCanvasRef {
  getPixelOfMouseEvent: (e: MouseEvent) => { x: number, y: number } | null;
}

function PixelCanvas(
  { imgData }: { imgData: ImageData },
  ref: ForwardedRef<PixelCanvasRef>
) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getPixelOfMouseEvent: (e: MouseEvent) => {

      if (canvasRef.current === null) return null;
      const canvas = canvasRef.current;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
      const y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

      return {
        x: Math.floor(x),
        y: Math.floor(y)
      };

    }
  }));

  useEffect(() => {

    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    ctx.putImageData(imgData, 0, 0);

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

export default forwardRef(PixelCanvas);
