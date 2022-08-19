import { useCallback, useEffect, useRef } from "react";

export interface CursorPos {
  x: number,
  y: number
}

/**
 * Provide a callback for when the cursor position on the client site changes,
 * and provides a ref for the current position. When the mouse leaves the site,
 * the position becomes null.
 */
export default function useCursorRef(onMove: (cursor: CursorPos | null) => void) {

  const cursorRef = useRef<CursorPos | null>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {

    cursorRef.current = {
      x: e.clientX,
      y: e.clientY
    };

    onMove(cursorRef.current);

  }, [onMove]);

  const onMouseLeave = useCallback(() => {
    cursorRef.current = null;
    onMove(null);
  }, [onMove]);

  useEffect(() => {

    addEventListener("mousemove", onMouseMove);
    addEventListener("mouseleave", onMouseLeave);

    return () => {
      removeEventListener("mousemove", onMouseMove);
      removeEventListener("mouseleave", onMouseLeave);
    };

  }, [onMouseMove, onMouseLeave]);

  return cursorRef;

}

