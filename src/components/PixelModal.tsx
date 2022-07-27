import Modal from "./Modal";

export type Pixel = { x: number, y: number } | null;

export default function PixelModal(
  {
    pixel = null,
    onClose = () => undefined
  }: {
    pixel?: Pixel,
    onClose?: () => void
  }
) {

  if (pixel === null) return null;

  return (
    <Modal title={`Pixel (${pixel.x}, ${pixel.y})`} open={true} onClose={onClose}>
      Select a colour that you would like to paint this pixel with. The colours
      are ordered by total amounts received. The colour with the highest
      amount is selected.
    </Modal>
  );

}
