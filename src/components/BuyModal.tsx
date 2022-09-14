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
      <h3>Credit card purchases</h3>
      <p>
        <small>
          Peercoin can be purchased using a credit card by using one of the
          following services: https://anycoindirect.eu/en/buy-peercoin
          https://buy.peercoin.net
        </small>
      </p>
      <h3>Cryptocurrency Exchanges</h3>
      <p>
        <small>
          If you already own cryptocurrency, below is a list of exchanges which
          support Peercoin and where it can be traded actively. Send your coins
          there and you will be able to purchase Peercoin. The Rock Trading—
          https://www.therocktrading.com/en/offers/PPCBTC Bittrex -
          https://global.bittrex.com/trade/ppc-btc Southxchange -
          https://main.southxchange.com/Market/Book/PPC/BTC Changelly -
          https://changelly.com Flyp.me - https://flyp.me
        </small>
      </p>
      <h3>DeFi</h3>
      <p>
        <small>
          Wrapped Peercoin is avaliable on both Ethereum and Polygon networks.
          https://info.quickswap.exchange/#/token/0x91e7e32c710661c44ae44d10aa86135d91c3ed65
          https://info.uniswap.org/#/tokens/0x044d078f1c86508e13328842cc75ac021b272958Please
          mind, that after obtaining wrapped Peercoin, you must unwrap it to
          your Peercoin wallet. For more information, see
          https://www.peercoin.net/resources#exchanges
        </small>
      </p>
      <div>Go Back</div>
    </Modal>
  );
}
