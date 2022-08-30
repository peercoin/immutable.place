import Modal from "./Modal";

/* eslint-disable max-lines-per-function */
export default function InfoModal(
  {
    open, onClose, onTerms
  }: {
    open: boolean,
    onClose?: () => void,
    onTerms: () => void
  }
) {

  return (
    <Modal
      title="Information"
      open={open}
      onClose={onClose}
    >
      <p>
        Information to be presented here...
      </p>
      <p>
        <small>
          Use of this website is subject to the <a onClick={onTerms}>Terms of Use</a>.
        </small>
      </p>
    </Modal>
  );

}
/* eslint-enable */

