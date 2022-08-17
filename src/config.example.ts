import {P2putPixelAddrGenerator} from "coin-canvas-lib";

export default {
  xLen: 1000,
  yLen: 1000,

  wsURL: "ws://localhost:24443/",
  reconnectMs: 5000,

  httpURL: "http://localhost:14443",
  httpRateLimit: 1000,
  httpTimeout: 8000,
  bitmapURL: "http://localhost:25443/",
  bitmapTimeout: 8000,

  addrGen: new P2putPixelAddrGenerator(
    "pcrt", // Regtest
    [0xc7, 0x66, 0xce, 0xc1, 0xef] // "canvas00" prefix
  )
};

