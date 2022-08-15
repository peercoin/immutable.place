import {CoinCanvasClient, PixelCoord, PixelData} from "coin-canvas-lib";
import {DependencyList, useEffect, useState} from "react";

export default function usePixelData(
  client: CoinCanvasClient | null, pixel: PixelCoord | null, deps: DependencyList
) : {
  pixelData: PixelData | null,
  requestError: string | null,
  clearPixelData: () => void
} {

  const [pixelData, setPixelData] = useState<PixelData | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(
    () => {
      if (pixel === null) return;
      client?.pixel(pixel)
        .then(setPixelData)
        .catch(e => setRequestError(e instanceof Error ? e.message : e.toString()));
    },
    [
      ...deps, // eslint-disable-line
      pixel, client
    ]
  );

  return {
    pixelData,
    requestError,
    clearPixelData: () => {
      setRequestError(null);
      setPixelData(null);
    }
  };

}

