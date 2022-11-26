import "./App.scss";
import { Fragment, useState, MouseEvent, useRef, useCallback } from "react";
import Camera from "./Camera";
import PixelModal from "./PixelModal";
import PixelCanvas, { PixelCanvasRef } from "./PixelCanvas";
import { Colour, PixelColour, PixelCoord } from "coin-canvas-lib";
import Palette from "./Palette";
import useCanvas from "../hooks/useCanvas";
import TermsModal from "./TermsModal";
import InfoModal from "./InfoModal";
import { isIOS, isSafari, isDesktop, browserVersion } from "react-device-detect";
import BuyModal from "./BuyModal";

/* eslint-disable max-lines-per-function */
export default function App() {

  const [termsOpen, setTermsOpen] = useState<boolean>(false);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [buyOpen, setBuyOpen] = useState<boolean>(false);
  const [gridMode, setGridMode] = useState<boolean>(false);
  const [clickable, setClickable] = useState<boolean>(false);

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
      y: clickCoord.y,
    });
  }, []);

  const handleMove = useCallback((nowClickable: boolean) => {
    canvasRef.current?.notifyMove();
    setClickable(nowClickable);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalPixel(null);
  }, []);

  const confirmedPixel = useCallback(
    (pixelColour: PixelColour) => {
      handleModalClose();
      dispatchCanvas(pixelColour);
    },
    [handleModalClose, dispatchCanvas]
  );

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

  const errorReason = error === null || error === "" ? "" : `: ${error}`;

  if (imgData === null)
    return (
      <div className="load-screen">
        {error === null ? "Loading..." : `Connection Error${errorReason}`}
      </div>
    );

  function padCoord(n: number) {
    return n.toString().padStart(3, "0");
  }

  // Scale canvas on Safari to avoid blurring.
  let canvasScale = 1;
  if (isSafari) {
    if (!isIOS)
      canvasScale = 30;
    else if (Number.parseInt(browserVersion, 10) >= 16)
      // 10x scale adjustment looks crisp on iPhone and works without crashing
      // on Safari 16 or higher
      canvasScale = 10;
  }

  return (
    <Fragment>
      <Camera
        onClick={handleCanvasClick}
        onMoved={handleMove}
        scaleAdjustment={1 / canvasScale}
      >
        <PixelCanvas
          imgData={imgData}
          ref={canvasRef}
          // Only show hover colour when on desktop using a cursor
          hoverColour={isDesktop ? colourDrop : null}
          onPixelHover={setPixelCoord}
          activePixel={modalPixel}
          scale={canvasScale}
          showGrid={gridMode && clickable}
        />
      </Camera>
      {error === null ? null : (
        <div className="canvas-error">
          Lost connection{errorReason}
          <div>
            <small>Updates will not be shown</small>
          </div>
        </div>
      )}
      {pixelCoord === null || !isDesktop ? null : (
        <div className="coordinates-container">
          <div className="coordinates">
            ({padCoord(pixelCoord.x)}, {padCoord(pixelCoord.y)})
          </div>
        </div>
      )}
      <Palette selectedColour={colourDrop} onSelection={setColourDrop} />
      <div className="options-buttons">
        <button onClick={() => saveCanvasAsImage()}>
          <img src="save.svg" />
        </button>
        <button onClick={() => setInfoOpen(true)}>?</button>
        <button
          onClick={() => setGridMode(!gridMode)}
          className={ gridMode ? "active" : ""}
        >
          <img src="gridmode.svg" />
        </button>
      </div>
      <PixelModal
        pixel={modalPixel}
        imgData={imgData}
        client={client}
        onCancel={handleModalClose}
        onConfirm={confirmedPixel}
        dropColour={
          colourDrop === null || modalPixel === null ? null : colourDrop
        }
        onTerms={() => setTermsOpen(true)}
        onBuy={() => setBuyOpen(true)}
      />
      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        onTerms={() => setTermsOpen(true)}
      />
      <BuyModal open={buyOpen} onClose={() => setBuyOpen(false)} />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </Fragment>
  );
}
/* eslint-enable */
