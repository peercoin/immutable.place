import Modal from "./Modal";
import "./BuyModal.scss";

/* eslint-disable max-lines-per-function */
export default function BuyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  return (
    <Modal title="How to buy Peercoin" open={open} onClose={onClose}>
      <div className="buy-modal-container">
        <h3>Credit card purchases</h3>
        <p>
          <small>
            Peercoin can be purchased using a credit card by using one of the
            following services:
            <br />
            <a
              href="https://anycoindirect.eu/en/buy-peercoin"
              target="_blank"
              rel="noopener norefferer"
            >
              - Anycoindirect
            </a>
            <br />
            <a
              href="https://buy.peercoin.net"
              target="_blank"
              rel="noopener norefferer"
            >
              - buy.peercoin.net
            </a>
          </small>
        </p>
        <h3>Cryptocurrency Exchanges</h3>
        <p>
          <small>
            If you already own cryptocurrency, below is a list of exchanges
            which support Peercoin and where it can be traded actively. Send
            your coins there and you will be able to purchase Peercoin.
            <br />
            <a
              href="https://www.therocktrading.com/en/offers/PPCBTC"
              target="_blank"
              rel="noopener norefferer"
            >
              - The Rock Trading
            </a>
            <br />
            <a
              href="https://global.bittrex.com/trade/ppc-btc"
              target="_blank"
              rel="noopener norefferer"
            >
              - Bittrex
            </a>
            <br />
            <a
              href="https://main.southxchange.com/Market/Book/PPC/BTC"
              target="_blank"
              rel="noopener norefferer"
            >
              - Southxchange
            </a>
            <br />
            <a
              href="https://changelly.com"
              target="_blank"
              rel="noopener norefferer"
            >
              - Changelly
            </a>
            <br />
            <a href="https://flyp.me" target="_blank" rel="noopener norefferer">
              - Flyp.me
            </a>
            <br />
          </small>
        </p>
        <h3>DeFi</h3>
        <p>
          <small>
            Wrapped Peercoin is available on both Ethereum and Polygon networks.
            <br />
            <a
              href="https://info.quickswap.exchange/#/token/0x91e7e32c710661c44ae44d10aa86135d91c3ed65"
              target="_blank"
              rel="noopener norefferer"
            >
              - Quickswap
            </a>
            <br />
            <a
              href="https://info.uniswap.org/#/tokens/0x044d078f1c86508e13328842cc75ac021b272958Please"
              target="_blank"
              rel="noopener norefferer"
            >
              - Uniswap
            </a>
            <br />
            <br />
            Mind, that after obtaining wrapped Peercoin, you must unwrap it to
            your Peercoin wallet.
            <br />
            For more information, see
            <br />
            <a
              href="https://www.peercoin.net/resources#exchanges"
              target="_blank"
              rel="noopener norefferer"
            >
              peercoin.net/resources#exchanges
            </a>
          </small>
        </p>
        <div className="buy-modal-go-back-wrapper">
          <div className="buy-modal-go-back-button" onClick={onClose}>
            Go Back
          </div>
        </div>
      </div>
    </Modal>
  );
}
