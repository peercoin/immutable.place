import {
  PositionType,
  ReactZoomPanPinchContext,
  ReactZoomPanPinchState
} from "../../models";
import { isExcludedNode } from "../../utils";
import {BoundsMode} from "../bounds/bounds.types";
import { getMouseBoundedPosition } from "../bounds/bounds.utils";
import { handleCalculateZoomPositions } from "../zoom/zoom.utils";

/* eslint-disable object-property-newline */
/* eslint-disable max-params */

export function isPanningStartAllowed(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent
): boolean {
  const { excluded } = contextInstance.setup.panning;
  const { isInitialized, wrapperComponent } = contextInstance;

  const target = event.target as HTMLElement | null;
  const isWrapperChild = wrapperComponent?.contains(target) ?? false;
  const isAllowed = isInitialized && target !== null && isWrapperChild;

  return isAllowed && !isExcludedNode(target, excluded);

}

export function isPanningAllowed(
  contextInstance: ReactZoomPanPinchContext
): boolean {
  const { isInitialized, isPanning, setup } = contextInstance;
  const { disabled } = setup.panning;

  return isInitialized && isPanning && !disabled;
}

export function handlePanningSetup(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent
): void {
  const { positionX, positionY } = contextInstance.transformState;

  contextInstance.isPanning = true;

  // Panning with mouse
  const x = event.clientX;
  const y = event.clientY;

  contextInstance.startCoords = { x: x - positionX, y: y - positionY };
}

export function handleTouchPanningSetup(
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent
): void {
  const {touches} = event;
  const { positionX, positionY } = contextInstance.transformState;

  contextInstance.isPanning = true;

  // Panning with touch
  const oneFingerTouch = touches.length === 1;
  if (oneFingerTouch) {
    const x = touches[0].clientX;
    const y = touches[0].clientY;
    contextInstance.startCoords = { x: x - positionX, y: y - positionY };
  }
}

export function handlePanToBounds(
  contextInstance: ReactZoomPanPinchContext
): Omit<ReactZoomPanPinchState, "previousScale"> | null {
  const { positionX, positionY, scale } = contextInstance.transformState;
  const { disabled, limitToBounds, boundsMode } = contextInstance.setup;
  const { wrapperComponent } = contextInstance;

  if (
    disabled ||
    wrapperComponent === null ||
    contextInstance.bounds === null
  ) {
    return null;
  }

  const { maxPositionX, minPositionX, maxPositionY, minPositionY } =
    contextInstance.bounds;

  const xChanged = positionX > maxPositionX || positionX < minPositionX;
  const yChanged = positionY > maxPositionY || positionY < minPositionY;

  // If within bounds, nothing should be done so return null
  if (!xChanged && !yChanged) return null;

  const mousePosX =
    positionX > maxPositionX
      ? wrapperComponent.offsetWidth
      : contextInstance.setup.minPositionX ?? 0;
  const mousePosY =
    positionY > maxPositionY
      ? wrapperComponent.offsetHeight
      : contextInstance.setup.minPositionY ?? 0;

  const { x, y } = handleCalculateZoomPositions(
    contextInstance,
    mousePosX,
    mousePosY,
    scale,
    contextInstance.bounds,
    limitToBounds || boundsMode == BoundsMode.CENTER_ZOOMED_OUT
  );

  return {
    scale,
    positionX: xChanged ? x : positionX,
    positionY: yChanged ? y : positionY
  };

}

export function handlePaddingAnimation(
  contextInstance: ReactZoomPanPinchContext,
  positionX: number,
  positionY: number
): void {
  const { scale } = contextInstance.transformState;
  const { sizeX, sizeY } = contextInstance.setup.alignmentAnimation;

  if (sizeX === 0 && sizeY === 0) {
    return;
  }

  contextInstance.setTransformState(scale, positionX, positionY);
}

export function handleNewPosition(
  contextInstance: ReactZoomPanPinchContext,
  newPositionX: number,
  newPositionY: number,
  paddingValueX: number,
  paddingValueY: number
): void {
  const { limitToBounds } = contextInstance.setup;
  const { wrapperComponent, bounds } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.transformState;

  const hasPositionXChanged = newPositionX !== positionX;
  const hasPositionYChanged = newPositionY !== positionY;

  const hasNewPosition = !hasPositionXChanged || !hasPositionYChanged;

  if (wrapperComponent === null || hasNewPosition || bounds === null) {
    return;
  }

  const { x, y } = getMouseBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    paddingValueX,
    paddingValueY,
    wrapperComponent
  );

  contextInstance.setTransformState(scale, x, y);
}

export function getPanningClientPosition(
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number
): PositionType {
  const { startCoords, transformState } = contextInstance;
  const { panning } = contextInstance.setup;
  const { lockAxisX, lockAxisY } = panning;
  const { positionX, positionY } = transformState;

  if (startCoords === null) {
    return { x: positionX, y: positionY };
  }

  const mouseX = clientX - startCoords.x;
  const mouseY = clientY - startCoords.y;
  const newPositionX = lockAxisX ? positionX : mouseX;
  const newPositionY = lockAxisY ? positionY : mouseY;

  return { x: newPositionX, y: newPositionY };
}

export function getPaddingValue(
  contextInstance: ReactZoomPanPinchContext,
  size: number
): number {
  const { setup, transformState } = contextInstance;
  const { scale } = transformState;
  const { minScale } = setup;

  if (size > 0 && scale >= minScale) {
    return size;
  }

  return 0;
}

