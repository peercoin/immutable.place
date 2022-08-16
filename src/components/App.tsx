import "./App.scss";
import {Fragment, useState, MouseEvent, useRef, useCallback} from "react";
import Camera from "./Camera";
import PixelModal from "./PixelModal";
import PixelCanvas, {PixelCanvasRef} from "./PixelCanvas";
import {Colour, PixelColour, PixelCoord} from "coin-canvas-lib";
import Palette from "./Palette";
import useCanvas from "../hooks/useCanvas";

/* eslint-disable max-lines-per-function */
export default function App() {

  const [canvasData, dispatchCanvas, client] = useCanvas();
  const [modalPixel, setModalPixel] = useState<PixelCoord | null>(null);
  const [colourDrop, setColourDrop] = useState<Colour | null>(null);
  const [pixelCoord, setPixelCoord] = useState<PixelCoord | null>(null);
  const canvasRef = useRef<PixelCanvasRef>(null);

  const handleCanvasClick = useCallback((e: MouseEvent) => {

    if (canvasRef.current === null) return;

    const clickCoord = canvasRef.current.getPixelOfMouseEvent(e);
    if (clickCoord === null) return;

    setModalPixel({
      x: clickCoord.x,
      y: clickCoord.y
    });

  }, []);

  const handleMove = useCallback(() => {
    canvasRef.current?.notifyMove();
  }, []);

  const handleModalClose = useCallback(() => {
    setModalPixel(null);
  }, []);

  const confirmedPixel = useCallback((pixelColour: PixelColour) => {
    handleModalClose();
    dispatchCanvas(pixelColour);
  }, [handleModalClose, dispatchCanvas]);

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

  function padCoord(n: number) {
    return n.toString().padStart(3, "0");
  }

  return (
    <Fragment>
      <Camera onClick={handleCanvasClick} onMoved={handleMove}>
        <PixelCanvas
          imgData={imgData}
          ref={canvasRef}
          hoverColour={colourDrop}
          onPixelHover={setPixelCoord}
          activePixel={modalPixel}
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
        pixel={modalPixel}
        imgData={imgData}
        client={client}
        onCancel={handleModalClose}
        onConfirm={confirmedPixel}
        dropColour={
          (colourDrop === null || modalPixel === null)
            ? null
            : colourDrop
        }
      />
    </Fragment>
  );

}
/* eslint-enable */

