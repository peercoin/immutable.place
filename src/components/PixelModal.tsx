import "./PixelModal.scss";
import Modal from "./Modal";
import {Colour, PixelData, PixelColourData} from "coin-canvas-lib";
import {useEffect, useRef, useState} from "react";
import PixelColourSelection from "./PixelColourSelection";
import PixelColourPayment from "./PixelColourPayment";

export type PixelModalData = { x: number, y: number, colours: PixelData };

/* eslint-disable max-lines-per-function */
export default function PixelModal(
  {
    pixel = null,
    imgData,
    onClose = () => undefined,
    selectColourData = null
  }: {
    pixel?: PixelModalData | null,
    imgData: ImageData,
    onClose?: () => void,
    selectColourData?: PixelColourData | null
  }
) {

  const previewRef = useRef<HTMLCanvasElement>(null);
  const preview = <canvas
    ref={previewRef}
    className="pixel-preview"
    width="5"
    height="5"
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
    const previewData = new Uint8ClampedArray(5*5*4);

    for (let i = 0; i < 5*5; i++) {

      const srcX = pixel.x + (i % 5) - 2;
      const srcY = pixel.y + Math.floor(i / 5) - 2;

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
      previewData[12*4] = showColour.red;
      previewData[12*4+1] = showColour.green;
      previewData[12*4+2] = showColour.blue;
    }

    ctx.putImageData(new ImageData(previewData, 5, 5), 0, 0);

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

  return (
    <Modal
      title={`Pixel (${pixel.x}, ${pixel.y})`}
      topLeftElement={preview}
      open={true}
      onClose={() => {
        // Ensure the next time the modal is opened, there is no slected colour
        setSelectedColourData(null);
        setHoverColour(null);
        onClose();
      }}
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
          />
      }
    </Modal>
  );

}
/* eslint-enable */

