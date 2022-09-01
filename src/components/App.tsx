import "./App.scss";
import {Fragment, useState, MouseEvent, useRef, useCallback} from "react";
import Camera from "./Camera";
import PixelModal from "./PixelModal";
import PixelCanvas, {PixelCanvasRef} from "./PixelCanvas";
import {Colour, PixelColour, PixelCoord} from "coin-canvas-lib";
import Palette from "./Palette";
import useCanvas from "../hooks/useCanvas";
import TermsModal from "./TermsModal";
import InfoModal from "./InfoModal";
import {isIOS, isSafari} from "react-device-detect";

/* eslint-disable max-lines-per-function */
export default function App() {

  const [termsOpen, setTermsOpen] = useState<boolean>(false);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);

  const [canvasData, dispatchCanvas, client] = useCanvas();
  const [modalPixel, setModalPixel] = useState<PixelCoord | null>(null);
  const [colourDrop, setColourDrop] = useState<Colour | null>(null);
  const [pixelCoord, setPixelCoord] = useState<PixelCoord | null>(null);
  const canvasRef = useRef<PixelCanvasRef>(null);

  const { imgData, error } = canvasData;

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

  const saveCanvasAsImage = useCallback(() => {

    if (imgData === null) return;

    const tempCanvas = document.createElement("canvas") as HTMLCanvasElement;
    tempCanvas.width = imgData.width;
    tempCanvas.height = imgData.height;

    const ctx = tempCanvas.getContext("2d", { alpha: false });
    if (ctx === null) return;

    ctx.putImageData(imgData, 0, 0);

    const image = tempCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "canvas.png";
    link.click();

  }, [imgData]);

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

  // Scale canvas on Safari desktop to avoid blurring, but do not do this on
  // iOS as it breaks. Not needed on other browsers.
  let canvasScale = 1;
  if (isSafari && !isIOS)
    canvasScale = 30;

  return (
    <Fragment>
      <Camera
        onClick={handleCanvasClick}
        onMoved={handleMove}
        scaleAdjustment={1/canvasScale}
      >
        <PixelCanvas
          imgData={imgData}
          ref={canvasRef}
          hoverColour={colourDrop}
          onPixelHover={setPixelCoord}
          activePixel={modalPixel}
          scale={canvasScale}
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
      <div className="options-buttons">
        <button onClick={() => saveCanvasAsImage()}>
          <img src="save.svg" />
        </button>
        <button onClick={() => setInfoOpen(true)}>?</button>
      </div>
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
        onTerms={() => setTermsOpen(true)}
      />
      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        onTerms={() => setTermsOpen(true)}
      />
      <TermsModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
      />
    </Fragment>
  );

}
/* eslint-enable */

