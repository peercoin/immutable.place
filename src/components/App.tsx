import {Fragment, useState, MouseEvent, useRef} from "react";
import Camera from "./Camera";
import PixelModal, {PixelModalData} from "./PixelModal";
import PixelCanvas, {PixelCanvasRef} from "./PixelCanvas";
import {Colour} from "coin-canvas-lib";
import Palette from "./Palette";

const CANVAS_HEIGHT = 1000;
const CANVAS_WIDTH = 1000;

// Temporary random pixels
const testData = new Uint8ClampedArray(1000*1000*4);
for (let i = 0; i < 1000000; i++) {
  const c = Colour.fromId(Math.floor(Math.random() * 16));
  testData[i*4] = c.red;
  testData[i*4+1] = c.green;
  testData[i*4+2] = c.blue;
  testData[i*4+3] = 255;
}

/* eslint-disable max-lines-per-function */
export default function App() {

  const [pixel, setPixel] = useState<PixelModalData | null>(null);
  const [colourDrop, setColourDrop] = useState<Colour | null>(null);
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
        address: "tpc1qcanvas0000000000000000000000000000000000000qqqqqqqqq8e09fm",
        colour: Colour.fromId(i)
      }))
    });

  }

  const imgData = new ImageData(testData, CANVAS_WIDTH, CANVAS_HEIGHT);

  return (
    <Fragment>
      <Camera onClick={handleCanvasClick}>
        <PixelCanvas
          imgData={imgData}
          ref={canvasRef}
          onHoverColour={colourDrop}
        />
      </Camera>
      <Palette
        selectedColour={colourDrop}
        onSelection={setColourDrop}
      />
      <PixelModal
        pixel={pixel}
        imgData={imgData}
        onClose={() => {
          setPixel(null);
          // Remove colour selection when modal closes
          setColourDrop(null);
        }}
        selectColourData={
          (colourDrop === null || pixel === null)
            ? null
            : pixel.colours[colourDrop.id]
        }
      />
    </Fragment>
  );

}
/* eslint-enable */

