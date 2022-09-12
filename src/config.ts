import { P2putPixelAddrGenerator } from "coin-canvas-lib";

export default {
  xLen: 1000,
  yLen: 1000,
  wsURL: "wss://test-ws.immutable.place/",
  httpURL: "https://test-api.immutable.place",
  bitmapURL: "https://test-bmp.immutable.place/",
  httpRateLimit: 300,
  httpTimeout: 10000,
  bitmapTimeout: 10000,
  reconnectMs: 5000,
  addrGen: new P2putPixelAddrGenerator(
    "tpc", // Testnet
    [0xc7, 0x66, 0xce, 0xc1, 0xef] // "canvas00" prefix
  )
};
