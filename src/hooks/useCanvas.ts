/* eslint-disable max-classes-per-file */

import {Canvas, CoinCanvasClient, PixelColour} from "coin-canvas-lib";
import {Dispatch, useEffect, useReducer, useState} from "react";
import CONFIG from "../config";

class CanvasData {
  imgData: ImageData | null;
  error: string | null;

  constructor(bytes: Uint8ClampedArray | null, error: string | null) {
    this.imgData = bytes === null
      ? null
      : new ImageData(bytes, CONFIG.xLen, CONFIG.yLen);
    this.error = error;
  }

}

class CanvasError extends Error { }

function addPixelColour(bytes: Uint8ClampedArray | null, pixCol: PixelColour) {

  if (bytes === null) return;

  const offset = (pixCol.coord.x + pixCol.coord.y*CONFIG.xLen)*4;
  bytes[offset] = pixCol.colour.red;
  bytes[offset + 1] = pixCol.colour.green;
  bytes[offset + 2] = pixCol.colour.blue;

}

// Reduce the canvas state using new pixel information
function canvasReducer(
  canvas: CanvasData,
  action: PixelColour | CanvasError | Canvas | PixelColour[]
) {

  let bytes = canvas.imgData?.data ?? null;

  if (action instanceof PixelColour) {
    addPixelColour(bytes, action);
  } else if (action instanceof Array) {
    action.forEach(pixColour => addPixelColour(bytes, pixColour));
  } else if (action instanceof CanvasError) {
    canvas.error = action.message;
  } else if (action instanceof Canvas) {
    bytes = action.getImageData().data;
    canvas.error = null;
  }

  return new CanvasData(bytes, canvas.error);

}

export default function useCanvas()
: [CanvasData, Dispatch<PixelColour>, CoinCanvasClient | null] {

  const [canvasData, dispatchCanvas] = useReducer(
    canvasReducer, new CanvasData(null, null)
  );
  const [client, setClient] = useState<CoinCanvasClient | null>(null);

  useEffect(() => {

    const localClient = new CoinCanvasClient({
      ...CONFIG,
      onFullCanvas: dispatchCanvas,
      onUpdatedPixels: dispatchCanvas,
      onError: (what: string) => {
        dispatchCanvas(new CanvasError(what));
      }
    });
    setClient(localClient);

    return () => localClient?.close();

  }, []);

  return [canvasData, dispatchCanvas, client];

}

