import {useEffect, useRef} from "react";
import "./PixelCanvas.css";

// Temporary random pixels
const data = new Uint8ClampedArray(1000*1000*4);
for (let i = 0; i < 1000000; i++) {
  data[i*4] = Math.random()*255;
  data[i*4+1] = Math.random()*255;
  data[i*4+2] = Math.random()*255;
  data[i*4+3] = 255;
}

export default function PixelCanvas(
  {
    width = 1000,
    height = 1000
  }: {
    width?: number,
    height?: number
  }
) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    const imgData = new ImageData(data, 1000, 1000);

    ctx.putImageData(imgData, 0, 0);

  });

  return (
    <canvas
      className="pixel-canvas card"
      ref={canvasRef}
      width={width}
      height={height}
    />
  );

}
