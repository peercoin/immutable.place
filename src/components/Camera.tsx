import {Fragment, ReactNode, MouseEvent, useState, useCallback} from "react";
import "./Camera.scss";
import useMovement from "../hooks/useMovement";
import useRefInitialCallback from "../hooks/useRefInitialCallback";
import ShortClickable from "./ShortClickable";
import TransformWrapper from "../zoom-pan-pinch/components/transform-wrapper";
import TransformComponent from "../zoom-pan-pinch/components/transform-component";
import {BoundsType, ReactZoomPanPinchRef} from "../zoom-pan-pinch/models";
import {BoundsMode} from "../zoom-pan-pinch/core/bounds/bounds.types";

const INITIAL_SCALE = 5;
const CLICK_SCALE_THRESHOLD = 10;
const CLICK_ZOOM_SCALE = 15;

/* eslint-disable max-lines-per-function */
/**
 * Provides navigation of {children} with additional scaling with
 * {scaleAdjustment}.
 * @param onClick Called when zoomed in and clicked on
 */
export default function Camera(
  {
    children, onClick, onMoved, scaleAdjustment
  }: {
    children: ReactNode,
    onClick: (event: MouseEvent) => void,
    onMoved: () => void,
    scaleAdjustment: number
  }
) {

  const [clickable, setClickable] = useState(false);

  const setRandomPosition = useCallback((transformer: ReactZoomPanPinchRef) => {

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

  const handleChange = useCallback((transformer: ReactZoomPanPinchRef) => {
    // When the transformer changes, update if the canvas is clickable and
    // notify parent of potential movement
    setClickable(transformer.state.scale >= CLICK_SCALE_THRESHOLD*scaleAdjustment);
    onMoved();
  }, [onMoved, scaleAdjustment]);

  // Handle setting an initial position and clickable state when the underlying
  // ref changes
  const [
    transformRef,
    transformRefCallback
  ] = useRefInitialCallback<ReactZoomPanPinchRef>(
    // Called initially
    setRandomPosition,
    // Called on every update
    handleChange
  );

  // Code relating to arrow key movement

  const withinBounds = useCallback(
    (newVal: number, minVal: number | undefined, maxVal: number | undefined) => {
      if (minVal === undefined || maxVal === undefined) return newVal;
      return Math.max(minVal, Math.min(maxVal, newVal));
    }, []
  );

  const xyWithinBounds = useCallback(
    (x: number, y: number, bounds: BoundsType | null) : number[] => [
      withinBounds(x, bounds?.minPositionX, bounds?.maxPositionX),
      withinBounds(y, bounds?.minPositionY, bounds?.maxPositionY)
    ],
    [withinBounds]
  );

  const makeMovement = useCallback((x: number, y: number) => {

    const transformer = transformRef.current;
    if (transformer === null) return;

    const moveAmtPerSecond = 800;
    const dX = x*moveAmtPerSecond;
    const dY = y*moveAmtPerSecond;

    // Use subtraction as the positions are in the negative for some reason
    // Also ensure new positions are within bounds
    const { positionX, positionY, scale } = transformer.state;
    const { bounds } = transformer.instance;

    const [newX, newY] = xyWithinBounds(positionX - dX, positionY - dY, bounds);
    transformer.setTransform(newX, newY, scale, 0);

  }, [transformRef, xyWithinBounds]);

  // Provides arrow key handling to the makeMovement callback
  useMovement(makeMovement);

  // Handle clicks on the navigable area

  const handleClick = useCallback((e: MouseEvent) => {
    // Zoom into clickable scale, or call callback otherwise

    const transformer = transformRef.current;
    if (transformer === null) return;

    const { scale } = transformer.state;

    if (scale < CLICK_SCALE_THRESHOLD*scaleAdjustment) {
      transformer.zoomToMouseEvent(
        e, CLICK_ZOOM_SCALE*scaleAdjustment, 500, "easeInOutQuad"
      );
    } else {
      onClick(e);
    }

  }, [onClick, transformRef, scaleAdjustment]);

  return (
    <TransformWrapper
      initialScale={INITIAL_SCALE*scaleAdjustment}
      minScale={scaleAdjustment}
      maxScale={30*scaleAdjustment}
      initialPositionX={-500}
      initialPositionY={-500}
      wheel={{ step: 0.08 }}
      doubleClick={{ disabled: true }}
      ref={transformRefCallback}
      boundsMode={BoundsMode.CENTER_BOUND_EDGES}
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
            <button onClick={() => zoomIn(0.9, 200)}>+</button>
            <button onClick={() => zoomOut(0.9, 200)}>−</button>
          </div>
        </Fragment>
      )}
    </TransformWrapper>
  );

}
/* eslint-enable */

