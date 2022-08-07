/* eslint-disable max-classes-per-file */

import {Canvas, CoinCanvasClient, PixelColour} from "coin-canvas-lib";
import {Dispatch, useEffect, useReducer, useState} from "react";
import CONFIG from "../config";

class CanvasData {
  bytes: Uint8ClampedArray | null;
  error: string | null;

  constructor(bytes: Uint8ClampedArray | null, error: string | null) {
    this.bytes = bytes;
    this.error = error;
  }

  get imgData() {
    return this.bytes === null
      ? null
      : new ImageData(this.bytes, CONFIG.xLen, CONFIG.yLen);
  }

}

class CanvasError extends Error { }

function addPixelColour(canvas: CanvasData, pixCol: PixelColour) {

  if (canvas.bytes === null) return;

  const offset = (pixCol.coord.x + pixCol.coord.y*CONFIG.xLen)*4;
  canvas.bytes[offset] = pixCol.colour.red;
  canvas.bytes[offset + 1] = pixCol.colour.green;
  canvas.bytes[offset + 2] = pixCol.colour.blue;

}

// Reduce the canvas state using new pixel information
function canvasReducer(
  canvas: CanvasData,
  action: PixelColour | CanvasError | Canvas | PixelColour[]
) {

  if (action instanceof PixelColour) {
    addPixelColour(canvas, action);
  } else if (action instanceof Array) {
    action.forEach(pixColour => addPixelColour(canvas, pixColour));
  } else if (action instanceof CanvasError) {
    canvas.error = action.message;
  } else if (action instanceof Canvas) {
    canvas.bytes = action.getImageData().data;
    canvas.error = null;
  }

  return new CanvasData(canvas.bytes, canvas.error);

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

