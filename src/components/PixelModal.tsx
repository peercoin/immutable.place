import "./PixelModal.scss";
import Modal from "./Modal";
import {PixelData} from "coin-canvas-lib";
import {satsToCoinString} from "../utils/coin";

export type PixelModalData = { x: number, y: number, colours: PixelData } | null;

export default function PixelModal(
  {
    pixel = null,
    onClose = () => undefined
  }: {
    pixel?: PixelModalData,
    onClose?: () => void
  }
) {

  if (pixel === null) return null;

  function biCmp(a: bigint, b: bigint) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

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
    <Modal title={`Pixel (${pixel.x}, ${pixel.y})`} open={true} onClose={onClose}>
      <p>
        Select a colour that you would like to paint this pixel with. The
        colours are ordered by total amounts received. The colour with the
        highest amount is selected.
      </p>
      {colourRows}
    </Modal>
  );

}
