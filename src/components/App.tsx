import {Fragment, useState, MouseEvent} from "react";
import Camera from "./Camera";
import PixelModal, {PixelModalData} from "./PixelModal";
import PixelCanvas from "./PixelCanvas";
import {Colour} from "coin-canvas-lib";

export default function App() {

  const [pixel, setPixel] = useState<PixelModalData>(null);

  function handleCanvasClick(e: MouseEvent) {
    // TODO: Obtain actual pixel
    setPixel({
      x: 999,
      y: 432,
      colours: [...Array(16).keys()].map(i => ({
        balance: BigInt(i),
        address: "placeholder",
        colour: Colour.fromId(i)
      }))
    });
  }

  return (
    <Fragment>
      <Camera onClick={handleCanvasClick}>
        <PixelCanvas></PixelCanvas>
      </Camera>
      <PixelModal pixel={pixel} onClose={() => setPixel(null)}></PixelModal>
    </Fragment>
  );

}
