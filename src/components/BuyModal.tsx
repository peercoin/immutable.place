import Modal from "./Modal";

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
            <ul>
              <li>
                <a
                  href="https://anycoindirect.eu/en/buy-peercoin"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Anycoindirect
                </a>
              </li>
              <li>
                <a
                  href="https://buy.peercoin.net"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  buy.peercoin.net
                </a>
              </li>
            </ul>
          </small>
        </p>
        <h3>Cryptocurrency Exchanges</h3>
        <p>
          <small>
            If you already own cryptocurrency, below is a list of exchanges
            which support Peercoin and where it can be traded actively. Send
            your coins there and you will be able to purchase Peercoin.
            <ul>
              <li>
                <a
                  href="https://www.therocktrading.com/en/offers/PPCBTC"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  The Rock Trading
                </a>
              </li>
              <li>
                <a
                  href="https://global.bittrex.com/trade/ppc-btc"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Bittrex
                </a>
              </li>
              <li>
                <a
                  href="https://main.southxchange.com/Market/Book/PPC/BTC"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Southxchange
                </a>
              </li>
              <li>
                <a
                  href="https://changelly.com"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Changelly
                </a>
              </li>
              <li>
                <a
                  href="https://flyp.me"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Flyp.me
                </a>
              </li>
            </ul>
          </small>
        </p>
        <h3>DeFi</h3>
        <p>
          <small>
            Wrapped peercoin (wPPC) is available on both Ethereum and Polygon networks. Conversion to PPC can be done at bridge.peercoin.net.
            <ul>
              <li>
                <a
                  href="https://info.quickswap.exchange/#/token/0x91e7e32c710661c44ae44d10aa86135d91c3ed65"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Quickswap
                </a>
              </li>
              <li>
                <a
                  href="https://info.uniswap.org/#/tokens/0x044d078f1c86508e13328842cc75ac021b272958"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Uniswap
                </a>
                
              </li>
            </ul>
          </small>
        </p>
        <h3>Peercoin Wallets</h3>
        <p>
          <small>
            The following peercoin wallets can be used to receive your peercoin and make payments:
            <ul>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.coinerella.peercoin"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Android
                </a>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/app/peercoin-wallet/id1571755170"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  iOS
                </a>
              </li>
              <li>
                <a
                  href="https://wallet.peercoin.net/"
                  target="_blank"
                  rel="noopener norefferer"
                >
                  Web
                </a>
              </li>
            </ul>
          </small>
        </p>
        <div className="modal-button-container">
          <button className="secondary" onClick={onClose}>
            Go Back
          </button>
        </div>
      </div>
    </Modal>
  );
}
