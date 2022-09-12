import Modal from "./Modal";
import packageJson from "../../package.json";
import "./InfoModal.scss";

/* eslint-disable max-lines-per-function */
export default function InfoModal({
  open,
  onClose,
  onTerms,
}: {
  open: boolean;
  onClose?: () => void;
  onTerms: () => void;
}) {
  return (
    <Modal title="Info" open={open} onClose={onClose}>
      <p>
        <small>
          Immutable.place is a collaborative pixel art project hosted on the
          Peercoin blockchain. Anyone can produce artworks on a 1000x1000 pixel
          canvas by spending coins to a burn address. Each pixel has 16
          addresses that represent 16 colours. Colours that receive the greatest
          amount to their address are filled in. The resulting artworks are
          independently reproducible from the blockchain by querying the balance
          of addresses.
        </small>
      </p>
      <h3>About Peercoin</h3>
      <p>
        <small>
          Peercoin is one of the original, pioneering public blockchains.
          Peercoin is primarily famous for being the first Proof-Of-Stake
          blockchain.
        </small>
      </p>
      <div className="info-modal-fndtn-box">
        <div>
          <h3>Peercoin Foundation</h3>
          <p>
            <small>
              This project has been sponsored by Stichting Peercoin Foundation.
              A non-profit organization established with a simple mission of
              promoting and supporting the continued education, development, and
              overall progression of the Peercoin project.
            </small>
          </p>
        </div>
        <div className="info-modal-qr-box">
          <img className="info-modal-qr-code" src="qr.svg" alt="qr-code" />
          <div className="info-modal-scan-me-btn"> SCAN ME </div>
        </div>
      </div>
      <div className="modal-footer">
        <span>Version: {packageJson.version}</span>
        <span className="info-modal-tos-link">
          <a onClick={onTerms}>Terms of Use</a>
        </span>
      </div>
    </Modal>
  );
}
/* eslint-enable */
