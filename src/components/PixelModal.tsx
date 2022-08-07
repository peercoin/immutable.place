import "./PixelModal.scss";
import Modal from "./Modal";
import {
  Colour, PixelData, PixelCoord, PixelColour, CoinCanvasClient
} from "coin-canvas-lib";
import {Fragment, useEffect, useRef, useState} from "react";
import PixelColourSelection from "./PixelColourSelection";
import PixelColourPayment from "./PixelColourPayment";

// Number of pixels to show around centre pixel
const PREVIEW_RADIUS = 3;
const PREVIEW_WIDTH = PREVIEW_RADIUS*2+1;
const PREVIEW_PIXEL_N = PREVIEW_WIDTH**2;

/* eslint-disable max-lines-per-function */
export default function PixelModal(
  {
    pixel = null,
    imgData,
    client,
    dropColour = null,
    onCancel = () => undefined,
    onConfirm = () => undefined
  }: {
    pixel?: PixelCoord | null,
    imgData: ImageData,
    client: CoinCanvasClient | null,
    dropColour?: Colour | null,
    onCancel?: () => void,
    onConfirm?: (pixelColour: PixelColour) => void,
  }
) {

  const previewRef = useRef<HTMLCanvasElement>(null);
  const preview = <canvas
    ref={previewRef}
    className="pixel-preview"
    width={PREVIEW_WIDTH}
    height={PREVIEW_WIDTH}
  />;

  // This state only tracks colours selected by the button. The colour can also
  // be passed as the selectColour prop
  const [selectedColour, setSelectedColour] = useState<Colour | null>(null);
  const [hoverColour, setHoverColour] = useState<Colour | null>(null);

  function getSelectedColour() {
    return dropColour ?? selectedColour;
  }

  // Show previous canvas
  useEffect(() => {

    if (pixel === null) return;

    const canvas = previewRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    // Get 5x5 preview ImageData
    const fullData = imgData.data;

    const previewData = new Uint8ClampedArray(PREVIEW_PIXEL_N*4);

    for (let i = 0; i < PREVIEW_PIXEL_N; i++) {

      const srcX = pixel.x + (i % PREVIEW_WIDTH) - PREVIEW_RADIUS;
      const srcY = pixel.y + Math.floor(i / PREVIEW_WIDTH) - PREVIEW_RADIUS;

      if (srcX < 0 || srcX >= imgData.width || srcY < 0 || srcY >= imgData.height) {
        previewData[i*4] = 255;
        previewData[i*4+1] = 255;
        previewData[i*4+2] = 255;
        previewData[i*4+3] = 255;
      } else {
        const srcOff = (srcX + srcY*imgData.width)*4;
        previewData[i*4] = fullData[srcOff];
        previewData[i*4+1] = fullData[srcOff+1];
        previewData[i*4+2] = fullData[srcOff+2];
        previewData[i*4+3] = 255;
      }

    }

    const showColour = getSelectedColour() ?? hoverColour;

    if (showColour !== null) {
      const midOff = Math.floor(PREVIEW_PIXEL_N / 2)*4;
      previewData[midOff] = showColour.red;
      previewData[midOff+1] = showColour.green;
      previewData[midOff+2] = showColour.blue;
    }

    ctx.putImageData(new ImageData(previewData, PREVIEW_WIDTH, PREVIEW_WIDTH), 0, 0);

  });

  // Load pixel data and update when image data changes
  const [pixelData, setPixelData] = useState<PixelData | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  useEffect(() => {
    if (pixel === null) return;
    client?.pixel(pixel)
      .then(setPixelData)
      .catch(e => setRequestError(e instanceof Error ? e.message : e.toString()));
  }, [imgData, pixel, client]);

  // Render if there is a pixel
  if (pixel === null) return null;

  // Infer active colour from RGB value
  const activeOffset = (pixel.x + pixel.y*imgData.width)*4;
  const activeColour = Colour.palette().find(
    c => c.red == imgData.data[activeOffset]
    && c.green == imgData.data[activeOffset+1]
    && c.blue == imgData.data[activeOffset+2]
  );

  function cleanup() {
    // Ensure the next time the modal is opened, there is no slected colour
    setSelectedColour(null);
    setHoverColour(null);
    setRequestError(null);
    setPixelData(null);
  }

  function cancel() {
    cleanup();
    onCancel();
  }

  function getPixelColourData(c: Colour | undefined) {
    if (c === undefined) return null;
    const colourData = pixelData?.find(pcd => pcd.colour.id == c.id);
    if (colourData === undefined) return null;
    return colourData;
  }

  function getContent() {

    if (pixel === null) return null;

    if (requestError !== null) {
      return (
        <div className="modal-error">
          <p>Sorry, the pixel data could not be loaded. Please try again later.</p>
          <p>{requestError}</p>
        </div>
      );
    }

    if (pixelData === null) {
      return <div className="modal-loading"><p>Loading...</p></div>;
    }

    const newColour = getSelectedColour();

    if (newColour === null) {
      return <PixelColourSelection
        colours={pixelData}
        onHoverColour={setHoverColour}
        onSelectColour={setSelectedColour}
      />;
    }

    const activeColourData = getPixelColourData(activeColour);
    const newColourData = getPixelColourData(newColour);

    if (activeColourData === null || newColourData === null) return null;

    return <PixelColourPayment
      pixel={pixel}
      colourData={newColourData}
      activeColourData={activeColourData}
      onCancel={cancel}
      onConfirm={() => {
        cleanup();
        onConfirm(new PixelColour(pixel, newColour.id));
      }}
    />;

  }

  return (
    <Modal
      title={`Pixel (${pixel.x}, ${pixel.y})`}
      topLeftElement={preview}
      open={true}
      onClose={cancel}
    >
      {getContent()}
    </Modal>
  );

}
/* eslint-enable */

