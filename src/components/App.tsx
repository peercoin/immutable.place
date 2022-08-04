import "./App.scss";
import {Fragment, useState, MouseEvent, useRef} from "react";
import Camera from "./Camera";
import PixelModal, {PixelModalData} from "./PixelModal";
import PixelCanvas, {PixelCanvasRef} from "./PixelCanvas";
import {Colour, PixelColour} from "coin-canvas-lib";
import Palette from "./Palette";
import useCanvas from "../hooks/useCanvas";

/* eslint-disable max-lines-per-function */
export default function App() {

  const [canvasData, dispatchCanvas] = useCanvas();
  const [pixel, setPixel] = useState<PixelModalData | null>(null);
  const [colourDrop, setColourDrop] = useState<Colour | null>(null);
  const canvasRef = useRef<PixelCanvasRef>(null);

  const { imgData, error } = canvasData;
  const errorReason = error === null || error === ""
    ? ""
    : `: ${error}`;

  if (imgData === null)
    return (
      <div className="load-screen">
        {
          error === null
            ? "Loading..."
            : `Connection Error${errorReason}`
        }
      </div>
    );

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

  function clearPixel() {
    setPixel(null);
    // Remove colour selection when modal closes
    setColourDrop(null);
  }

  function confirmedPixel(pixelColour: PixelColour) {
    clearPixel();
    dispatchCanvas(pixelColour);
  }

  return (
    <Fragment>
      <Camera onClick={handleCanvasClick}>
        <PixelCanvas
          imgData={imgData}
          ref={canvasRef}
          onHoverColour={colourDrop}
        />
      </Camera>
      {
        error === null
          ? null
          : (
            <div className="canvas-error">
              Lost connection{errorReason}
              <div><small>Updates will not be shown</small></div>
            </div>
          )
      }
      <Palette
        selectedColour={colourDrop}
        onSelection={setColourDrop}
      />
      <PixelModal
        pixel={pixel}
        imgData={imgData}
        onCancel={clearPixel}
        onConfirm={confirmedPixel}
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

