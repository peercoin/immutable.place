import {Fragment, useState, MouseEvent} from "react";
import Camera from "./Camera";
import PixelModal, {Pixel} from "./PixelModal";
import PixelCanvas from "./PixelCanvas";

export default function App() {

  const [pixel, setPixel] = useState<Pixel>(null);

  function handleCanvasClick(e: MouseEvent) {
    // TODO: Obtain actual pixel
    setPixel({
      x: 999,
      y: 432
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
