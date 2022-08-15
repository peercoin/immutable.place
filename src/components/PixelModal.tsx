import "./PixelModal.scss";
import Modal from "./Modal";
import {
  Colour, PixelCoord, PixelColour, CoinCanvasClient
} from "coin-canvas-lib";
import {useState} from "react";
import PixelColourSelection from "./PixelColourSelection";
import PixelColourPayment from "./PixelColourPayment";
import CanvasPreview from "./CanvasPreview";
import usePixelData from "../hooks/usePixelData";

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

  // This state only tracks colours selected by the button. The colour can also
  // be passed as the selectColour prop
  const [selectedColour, setSelectedColour] = useState<Colour | null>(null);
  const [hoverColour, setHoverColour] = useState<Colour | null>(null);

  function getSelectedColour() {
    return dropColour ?? selectedColour;
  }

  // Load pixel data and update when image data changes
  const {
    pixelData, requestError, clearPixelData
  } = usePixelData(client, pixel, [imgData]);

  // Render if there is a pixel
  if (pixel === null) return null;

  // Infer active colour from RGB value
  const activeOffset = (pixel.x + pixel.y*imgData.width)*4;
  const activeColour = Colour.palette.find(
    c => c.red == imgData.data[activeOffset]
    && c.green == imgData.data[activeOffset+1]
    && c.blue == imgData.data[activeOffset+2]
  );

  function cleanup() {
    // Ensure the next time the modal is opened, there is no slected colour
    setSelectedColour(null);
    setHoverColour(null);
    clearPixelData();
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
      topLeftElement={
        <CanvasPreview
          pixel={pixel}
          showColour={getSelectedColour() ?? hoverColour}
          imgData={imgData}
        />
      }
      open={true}
      onClose={cancel}
    >
      {getContent()}
    </Modal>
  );

}
/* eslint-enable */

