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
      <p>
        <small>
          <a
            href="https://www.peercoin.net/blog/immutableplacetutorial"
            target="blank"
            rel="noopener norefferer"
          >
            Full tutorial here
          </a>
        </small>
      </p>
      <h3>About Peercoin</h3>
      <p>
        <small>
          <a
            href="https://www.peercoin.net/"
            target="blank"
            rel="noopener norefferer"
          >
            Peercoin
          </a>{" "}
          is the original Proof-of-Stake blockchain. It is fairly distributed,
          open-source and community driven. Peercoin is designed around concepts
          of both energy and economical sustainability, both made possible by
          the innovation of Proof-of-Stake consensus.
        </small>
      </p>
      <div className="info-modal-fndtn-box">
        <div>
          <h3>Peercoin Foundation</h3>
          <p>
            <small>
              This project was sponsored by the{" "}
              <a
                href="https://www.peercoin.net/foundation"
                target="blank"
                rel="noopener norefferer"
              >
                Peercoin Foundation
              </a>
              , a non-profit organization established with the mission of
              promoting and supporting the continued development and overall
              progression of the Peercoin project.
              <br />
            </small>
          </p>
        </div>
        <div className="info-modal-qr-box">
          <img className="info-modal-qr-code" src="qr.svg" alt="qr-code" />
          <div className="info-modal-scan-me-btn">
            <a
              href="https://www.peercoin.net/foundation"
              target="_blank"
              rel="noopener norefferer"
            >
              Donate
            </a>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <span>
          <a
            href="https://github.com/peercoin/immutable.place"
            target="blank"
            rel="noopener norefferer"
          >
            Version: {packageJson.version}
          </a>
        </span>
        <span className="info-modal-tos-link">
          <a onClick={onTerms}>Terms of Use</a>
        </span>
      </div>
    </Modal>
  );
}
/* eslint-enable */
