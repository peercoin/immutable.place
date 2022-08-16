import {
  BoundsType,
  PositionType,
  ReactZoomPanPinchContext
} from "../../models";
import { roundNumber } from "../../utils";
import { BoundsMode, ComponentsSizesType } from "./bounds.types";

/* eslint-disable max-params */

export function getComponentsSizes(
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
  newScale: number
): ComponentsSizesType {
  return {
    wrapperWidth: wrapperComponent.offsetWidth,
    wrapperHeight: wrapperComponent.offsetHeight,
    newContentWidth: contentComponent.offsetWidth * newScale,
    newContentHeight: contentComponent.offsetHeight * newScale
  };
}

function getDimenBounds(
  wrapperLen: number,
  contentLen: number,
  boundsMode: BoundsMode
) {

  if (boundsMode == BoundsMode.CENTER_BOUND_EDGES) {
    return {
      min: wrapperLen*0.5 - contentLen,
      max: wrapperLen*0.5
    };
  }

  const diff = wrapperLen - contentLen;
  const diffMultiplier = boundsMode === BoundsMode.CENTER_ZOOMED_OUT ? 1 : 0.5;
  const adjustment = diff > 0 ? diff * diffMultiplier : 0;

  return {
    min: wrapperLen - contentLen - adjustment,
    max: adjustment
  };

}

export function getBounds(
  wrapperWidth: number,
  newContentWidth: number,
  wrapperHeight: number,
  newContentHeight: number,
  boundsMode: BoundsMode
): BoundsType {

  const { min: minPositionX, max: maxPositionX } = getDimenBounds(
    wrapperWidth, newContentWidth, boundsMode
  );

  const { min: minPositionY, max: maxPositionY } = getDimenBounds(
    wrapperHeight, newContentHeight, boundsMode
  );

  return {
    minPositionX,
    maxPositionX,
    minPositionY,
    maxPositionY
  };

}

export function calculateBounds(
  contextInstance: ReactZoomPanPinchContext,
  newScale: number
): BoundsType {

  const { wrapperComponent, contentComponent } = contextInstance;
  const { boundsMode } = contextInstance.setup;

  if (wrapperComponent === null || contentComponent === null) {
    throw new Error("Components are not mounted");
  }

  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newContentHeight
  } = getComponentsSizes(wrapperComponent, contentComponent, newScale);

  const bounds = getBounds(
    wrapperWidth,
    newContentWidth,
    wrapperHeight,
    newContentHeight,
    boundsMode
  );

  return bounds;

}

export function handleCalculateBounds(
  contextInstance: ReactZoomPanPinchContext,
  newScale: number
): BoundsType {
  const bounds = calculateBounds(contextInstance, newScale);

  // Save bounds
  contextInstance.bounds = bounds;
  return bounds;
}

/**
 * Keeps value between given bounds, used for limiting view to given boundaries
 * 1# eg. boundLimiter(2, 0, 3, true) => 2
 * 2# eg. boundLimiter(4, 0, 3, true) => 3
 * 3# eg. boundLimiter(-2, 0, 3, true) => 0
 * 4# eg. boundLimiter(10, 0, 3, false) => 10
 */
export function boundLimiter(
  value: number,
  minBound: number,
  maxBound: number,
  isActive: boolean
): number {
  if (!isActive) {
    return roundNumber(value, 2);
  }
  if (value < minBound) {
    return roundNumber(minBound, 2);
  }
  if (value > maxBound) {
    return roundNumber(maxBound, 2);
  }
  return roundNumber(value, 2);
}

export function getMouseBoundedPosition(
  positionX: number,
  positionY: number,
  bounds: BoundsType,
  limitToBounds: boolean,
  paddingValueX: number,
  paddingValueY: number,
  wrapperComponent: HTMLDivElement | null
): PositionType {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds;

  let paddingX = 0;
  let paddingY = 0;

  if (wrapperComponent !== null) {
    paddingX = paddingValueX;
    paddingY = paddingValueY;
  }

  const x = boundLimiter(
    positionX,
    minPositionX - paddingX,
    maxPositionX + paddingX,
    limitToBounds
  );

  const y = boundLimiter(
    positionY,
    minPositionY - paddingY,
    maxPositionY + paddingY,
    limitToBounds
  );
  return {
    x,
    y
  };
}

