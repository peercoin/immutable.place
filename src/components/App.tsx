import "./App.scss";
import {Fragment, useState, MouseEvent, useRef} from "react";
import Camera from "./Camera";
import PixelModal from "./PixelModal";
import PixelCanvas, {PixelCanvasRef} from "./PixelCanvas";
import {Colour, PixelColour, PixelCoord} from "coin-canvas-lib";
import Palette from "./Palette";
import useCanvas from "../hooks/useCanvas";

/* eslint-disable max-lines-per-function */
export default function App() {

  const [canvasData, dispatchCanvas, client] = useCanvas();
  const [pixel, setPixel] = useState<PixelCoord | null>(null);
  const [colourDrop, setColourDrop] = useState<Colour | null>(null);
  const [pixelCoord, setPixelCoord] = useState<PixelCoord | null>(null);
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

    const clickCoord = canvasRef.current.getPixelOfMouseEvent(e);
    if (clickCoord === null) return;

    setPixel({
      x: clickCoord.x,
      y: clickCoord.y
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

  function padCoord(n: number) {
    return n.toString().padStart(3, "0");
  }

  return (
    <Fragment>
      <Camera onClick={handleCanvasClick}>
        <PixelCanvas
          imgData={imgData}
          ref={canvasRef}
          hoverColour={colourDrop}
          onPixelHover={setPixelCoord}
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
      {
        pixelCoord === null
          ? null
          : (
            <div className="coordinates-container">
              <div className="coordinates">
                ({padCoord(pixelCoord.x)}, {padCoord(pixelCoord.y)})
              </div>
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
        client={client}
        onCancel={clearPixel}
        onConfirm={confirmedPixel}
        dropColour={
          (colourDrop === null || pixel === null)
            ? null
            : colourDrop
        }
      />
    </Fragment>
  );

}
/* eslint-enable */

