import {Fragment, useState, MouseEvent, useRef} from "react";
import Camera from "./Camera";
import PixelModal, {PixelModalData} from "./PixelModal";
import PixelCanvas, {PixelCanvasRef} from "./PixelCanvas";
import {Colour} from "coin-canvas-lib";

// Temporary random pixels
const data = new Uint8ClampedArray(1000*1000*4);
for (let i = 0; i < 1000000; i++) {
  data[i*4] = Math.random()*255;
  data[i*4+1] = Math.random()*255;
  data[i*4+2] = Math.random()*255;
  data[i*4+3] = 255;
}

export default function App() {

  const [pixel, setPixel] = useState<PixelModalData>(null);
  const canvasRef = useRef<PixelCanvasRef>(null);

  function handleCanvasClick(e: MouseEvent) {

    if (canvasRef.current === null) return;

    const pixelCoord = canvasRef.current.getPixelOfMouseEvent(e);
    if (pixelCoord === null) return;

    setPixel({
      x: pixelCoord.x,
      y: pixelCoord.y,
      // TODO: Obtain actual pixel data
      colours: [...Array(16).keys()].map(i => ({
        balance: BigInt(i),
        address: "placeholder",
        colour: Colour.fromId(i)
      }))
    });

  }

  const imgData = new ImageData(data, 1000, 1000);

  return (
    <Fragment>
      <Camera onClick={handleCanvasClick}>
        <PixelCanvas imgData={imgData} ref={canvasRef}></PixelCanvas>
      </Camera>
      <PixelModal pixel={pixel} onClose={() => setPixel(null)}></PixelModal>
    </Fragment>
  );

}
