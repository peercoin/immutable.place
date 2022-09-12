import { P2putPixelAddrGenerator } from "coin-canvas-lib";
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// eslint-disable-next-line
const env = process.env;
export default {
  xLen: 1000,
  yLen: 1000,
  wsURL: env.REACT_APP_CONF_WS_URL!,
  httpURL: env.REACT_APP_CONF_HTTP_URL!,
  bitmapURL: env.REACT_APP_CONF_BITMAP_URL!,
  httpRateLimit: 300,
  httpTimeout: 10000,
  bitmapTimeout: 10000,
  reconnectMs: 5000,
  addrGen: new P2putPixelAddrGenerator(
    env.REACT_APP_CONF_NET_LETTER_CODE!, // Testnet
    env.REACT_APP_CONF_NET_LETTER_CODE === "tpc"
      ? [0xc7, 0x66, 0xce, 0xc1, 0xef]
      : [0xc7, 0x66, 0xce, 0xc1, 0xef] // "canvas00" prefix
  ),
};
