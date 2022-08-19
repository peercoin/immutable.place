import {MouseEvent, ReactNode, useCallback, useRef} from "react";

/* eslint-disable max-lines-per-function */
/**
 * Will call {onShortClick} if the click is under {maxDurationMs} and the cursor
 * did not move more than {maxMovement} in term of reported coordinates by
 * {MouseEvent}
 */
export default function ShortClickable(
  {
    children,
    onShortClick,
    maxDurationMs = 500,
    maxMovement = 2
  } : {
    children: ReactNode
    onShortClick: (event: MouseEvent) => void,
    maxDurationMs?: number,
    maxMovement?: number
  }
) {

  const clickInfoRef = useRef({
    x: NaN,
    y: NaN,
    ts: NaN,
    downEvent: null as MouseEvent | null
  });

  const handleDown = useCallback((e: MouseEvent) => {
    clickInfoRef.current = {
      x: e.screenX,
      y: e.screenY,
      ts: Date.now(),
      downEvent: e
    };
  }, []);

  const handleUp = useCallback((e: MouseEvent) => {

    const { x, y, ts, downEvent } = clickInfoRef.current;
    if (downEvent === null) return;

    const moveX = Math.abs(e.screenX - x);
    const moveY = Math.abs(e.screenY - y);
    const movement = (moveX**2 + moveY**2)**0.5;
    const duration = Date.now() - ts;

    if (movement > maxMovement || duration > maxDurationMs) return;

    onShortClick(downEvent);

  }, [maxDurationMs, maxMovement, onShortClick]);

  return (
    <div onMouseDown={handleDown} onMouseUp={handleUp}>
      {children}
    </div>
  );

}
