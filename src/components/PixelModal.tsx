import "./PixelModal.scss";
import Modal from "./Modal";
import {Colour, PixelData, PixelColourData, PixelCoord, PixelColour} from "coin-canvas-lib";
import {useEffect, useRef, useState} from "react";
import PixelColourSelection from "./PixelColourSelection";
import PixelColourPayment from "./PixelColourPayment";

// Number of pixels to show around centre pixel
const PREVIEW_RADIUS = 3;
const PREVIEW_WIDTH = PREVIEW_RADIUS*2+1;
const PREVIEW_PIXEL_N = PREVIEW_WIDTH**2;

export interface PixelModalData extends PixelCoord {
  colours: PixelData
}

/* eslint-disable max-lines-per-function */
export default function PixelModal(
  {
    pixel = null,
    imgData,
    selectColourData = null,
    onCancel = () => undefined,
    onConfirm = () => undefined
  }: {
    pixel?: PixelModalData | null,
    imgData: ImageData,
    selectColourData?: PixelColourData | null,
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
  const [selectedColourData, setSelectedColourData] = useState<PixelColourData | null>(null);
  const [hoverColour, setHoverColour] = useState<Colour | null>(null);

  function getSelectedColourData() {
    return selectColourData ?? selectedColourData;
  }

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

    const showColour = getSelectedColourData()?.colour ?? hoverColour;

    if (showColour !== null) {
      const midOff = Math.floor(PREVIEW_PIXEL_N / 2)*4;
      previewData[midOff] = showColour.red;
      previewData[midOff+1] = showColour.green;
      previewData[midOff+2] = showColour.blue;
    }

    ctx.putImageData(new ImageData(previewData, PREVIEW_WIDTH, PREVIEW_WIDTH), 0, 0);

  });

  // Render if there is a pixel

  if (pixel === null) return null;

  const colourData = getSelectedColourData();

  // Infer active colour from RGB value
  const activeOffset = (pixel.x + pixel.y*imgData.width)*4;
  const activeColour = pixel.colours.find(
    cd => cd.colour.red == imgData.data[activeOffset]
    && cd.colour.green == imgData.data[activeOffset+1]
    && cd.colour.blue == imgData.data[activeOffset+2]
  );

  if (activeColour === undefined) return null;

  function cleanup() {
    // Ensure the next time the modal is opened, there is no slected colour
    setSelectedColourData(null);
    setHoverColour(null);
  }

  function cancel() {
    cleanup();
    onCancel();
  }

  return (
    <Modal
      title={`Pixel (${pixel.x}, ${pixel.y})`}
      topLeftElement={preview}
      open={true}
      onClose={cancel}
    >
      {
        colourData === null
          ? <PixelColourSelection
            colours={pixel.colours}
            onHoverColour={setHoverColour}
            onSelectColourData={setSelectedColourData}
          />
          : <PixelColourPayment
            pixel={pixel}
            colourData={colourData}
            activeColour={activeColour}
            onCancel={cancel}
            onConfirm={() => {
              cleanup();
              onConfirm(new PixelColour(pixel, colourData.colour.id));
            }}
          />
      }
    </Modal>
  );

}
/* eslint-enable */

