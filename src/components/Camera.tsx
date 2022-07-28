import {Fragment, ReactNode, MouseEvent, useState, useCallback} from "react";
import "./Camera.scss";
import useMovement from "../hooks/useMovement";
import useRefInitialCallback from "../hooks/useRefInitialCallback";
import ShortClickable from "./ShortClickable";
import TransformWrapper from "../zoom-pan-pinch/components/transform-wrapper";
import TransformComponent from "../zoom-pan-pinch/components/transform-component";
import {BoundsType, ReactZoomPanPinchRef} from "../zoom-pan-pinch/models";

const INITIAL_SCALE = 5;
const CLICK_SCALE_THRESHOLD = 10;
const CLICK_ZOOM_SCALE = 15;

/* eslint-disable max-lines-per-function */
/**
 * Provides navigation of {children}
 * @param onClick Called when zoomed in and clicked on
 */
export default function Camera(
  {
    children,
    onClick
  }: {
    children: ReactNode,
    onClick: (event: MouseEvent) => void
  }
) {

  const [clickable, setClickable] = useState(false);

  function handleNewScale(transformer: ReactZoomPanPinchRef) {
    setClickable(transformer.state.scale >= CLICK_SCALE_THRESHOLD);
  }

  const randomPosition = useCallback((transformer: ReactZoomPanPinchRef) => {

    // Set initial position to random
    // Use the bounds object which goes into the negative and doesn't make much
    // sense, but it provides the values required by the transformer

    const { bounds } = transformer.instance;
    if (bounds === null) return;

    const width = bounds.maxPositionX - bounds.minPositionX;
    const height = bounds.maxPositionY - bounds.minPositionY;

    // Obtain random positions within 10-90% so we are not too close to the
    // edges
    const x = bounds.minPositionX + width*(0.1 + Math.random()*0.8);
    const y = bounds.minPositionY + height*(0.1 + Math.random()*0.8);

    transformer.setTransform(x, y, transformer.state.scale, 0);

  }, []);

  const [
    transformRef,
    transformRefCallback
  ] = useRefInitialCallback<ReactZoomPanPinchRef>(
    randomPosition, handleNewScale // handleNewScale is called on every update
  );

  function withinBounds(
    newVal: number, minVal: number | undefined, maxVal: number | undefined
  ) {
    if (minVal === undefined || maxVal === undefined) return newVal;
    return Math.max(minVal, Math.min(maxVal, newVal));
  }

  function xyWithinBounds(x: number, y: number, bounds: BoundsType | null) : number[] {
    return [
      withinBounds(x, bounds?.minPositionX, bounds?.maxPositionX),
      withinBounds(y, bounds?.minPositionY, bounds?.maxPositionY)
    ];
  }

  function makeMovement(x: number, y: number) {

    const transformer = transformRef.current;
    if (transformer === null) return;

    // Use subtraction as the positions are in the negative for some reason
    // Also ensure new positions are within bounds
    const { positionX, positionY, scale } = transformer.state;
    const { bounds } = transformer.instance;

    const [newX, newY] = xyWithinBounds(positionX - x, positionY - y, bounds);
    transformer.setTransform(newX, newY, scale, 0);

  }

  useMovement((x, y) => {
    const moveAmtPerSecond = 600;
    const moveX = x*moveAmtPerSecond;
    const moveY = y*moveAmtPerSecond;
    makeMovement(moveX, moveY);
  });

  function handleClick(e: MouseEvent) {
    // Zoom into clickable scale, or call callback otherwise

    const transformer = transformRef.current;
    if (transformer === null) return;

    const { scale } = transformer.state;

    if (scale < CLICK_SCALE_THRESHOLD) {
      transformer.zoomToMouseEvent(e, CLICK_ZOOM_SCALE, 500, "easeInOutQuad");
    } else {
      onClick(e);
    }

  }

  return (
    <TransformWrapper
      initialScale={INITIAL_SCALE}
      minScale={1}
      maxScale={30}
      initialPositionX={-500}
      initialPositionY={-500}
      wheel={{ step: 0.06 }}
      doubleClick={{ disabled: true }}
      ref={transformRefCallback}
    >
      {({ zoomIn, zoomOut }) => (
        <Fragment>
          <TransformComponent
            wrapperClass={`camera-wrapper ${clickable ? "clickable" : ""}`}
          >
            <ShortClickable onShortClick={handleClick}>
              {children}
            </ShortClickable>
          </TransformComponent>
          <div className="zoom-buttons">
            <button onClick={() => zoomIn(1.2, 200)}>+</button>
            <button onClick={() => zoomOut(1.2, 200)}>−</button>
          </div>
        </Fragment>
      )}
    </TransformWrapper>
  );

}
/* eslint-enable */
