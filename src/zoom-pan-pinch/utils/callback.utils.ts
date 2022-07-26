import { ReactZoomPanPinchRef } from "../models";

/* eslint-disable no-shadow */

export function handleCallback<T>(
  context: ReactZoomPanPinchRef,
  event: T,
  callback?: (context: ReactZoomPanPinchRef, event: T) => void
): void {
  if (callback !== undefined && typeof callback === "function") {
    callback(context, event);
  }
}
