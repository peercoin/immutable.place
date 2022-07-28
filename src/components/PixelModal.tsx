import "./PixelModal.scss";
import Modal from "./Modal";
import {PixelData} from "coin-canvas-lib";
import {satsToCoinString} from "../utils/coin";
import {useEffect, useRef} from "react";

export type PixelModalData = { x: number, y: number, colours: PixelData } | null;

/* eslint-disable max-lines-per-function */
export default function PixelModal(
  {
    pixel = null,
    imgData,
    onClose = () => undefined
  }: {
    pixel?: PixelModalData,
    imgData: ImageData,
    onClose?: () => void
  }
) {

  function biCmp(a: bigint, b: bigint) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  const previewRef = useRef<HTMLCanvasElement>(null);
  const preview = <canvas
    ref={previewRef}
    className="pixel-preview"
    width="5"
    height="5"
  />;

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

    ctx.putImageData(new ImageData(previewData, 5, 5), 0, 0);

  });

  // Render if there is a pixel

  if (pixel === null) return null;

  const colourRows = pixel.colours.sort(
    (a, b) => -biCmp(a.balance, b.balance)
  ).map(data => (
    <div className="pixel-colour-row" key={data.colour.id.toString()}>
      <div className="pixel-colour" style={{ background: data.colour.cssStr }}></div>
      <div className="pixel-colour-name">{ data.colour.name }</div>
      <div className="pixel-colour-balance">
        { `${satsToCoinString(data.balance)} PPC` }
      </div>
    </div>
  ));

  return (
    <Modal
      title={`Pixel (${pixel.x}, ${pixel.y})`}
      topLeftElement={preview}
      open={true}
      onClose={onClose}
    >
      <p>
        Select a colour that you would like to paint this pixel with. The
        colours are ordered by total amounts received. The colour with the
        highest amount is selected.
      </p>
      {colourRows}
    </Modal>
  );

}
/* eslint-enable */

