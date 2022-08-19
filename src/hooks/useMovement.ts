import {useEffect, useRef} from "react";

const KEY_LEFT = "ArrowLeft";
const KEY_UP = "ArrowUp";
const KEY_RIGHT = "ArrowRight";
const KEY_DOWN = "ArrowDown";

const MOVE_LEFT = 0b1000;
const MOVE_UP = 0b0100;
const MOVE_RIGHT = 0b0010;
const MOVE_DOWN = 0b0001;

const MOVE_LEFT_UP = 0b1100;
const MOVE_UP_RIGHT = 0b0110;
const MOVE_RIGHT_DOWN = 0b0011;
const MOVE_DOWN_LEFT = 0b1001;

/* eslint-disable max-lines-per-function */
/**
 * Provides arrow key movement in the x and y direction to the onMove callback.
 * The movment amounts are equal to the number of seconds between frames.
 */
export default function useMovement(onMove: (x: number, y:number) => void) {

  const moveRef = useRef(0);
  const tsRef = useRef<DOMHighResTimeStamp | null>(null);

  useEffect(() => {

    function movePos(ts: DOMHighResTimeStamp) {

      const move = moveRef.current;
      const prevTs = tsRef.current;
      if (prevTs === null) return;

      // Make movement equal to seconds passed
      const moveAmt = (ts - prevTs) / 1000;
      const diagMoveAmt = moveAmt / Math.SQRT2; // Pythagoras

      let moveX = 0;
      let moveY = 0;

      // Possibly a simpler way to do this?
      if (move == MOVE_LEFT) {
        moveX = -moveAmt;
      } else if (move == MOVE_UP) {
        moveY = -moveAmt;
      } else if (move == MOVE_RIGHT) {
        moveX = moveAmt;
      } else if (move == MOVE_DOWN) {
        moveY = moveAmt;
      } else if (move == MOVE_LEFT_UP) {
        moveY = -diagMoveAmt;
        moveX = -diagMoveAmt;
      } else if (move == MOVE_UP_RIGHT) {
        moveY = -diagMoveAmt;
        moveX = diagMoveAmt;
      } else if (move == MOVE_RIGHT_DOWN) {
        moveY = diagMoveAmt;
        moveX = diagMoveAmt;
      } else if (move == MOVE_DOWN_LEFT) {
        moveY = diagMoveAmt;
        moveX = -diagMoveAmt;
      } else {
        // No valid movement, so quit animation
        tsRef.current = null;
        return;
      }

      onMove(moveX, moveY);

      // Animate movement over time
      tsRef.current = ts;
      requestAnimationFrame(movePos);

    }

    function adjustKeys(e: KeyboardEvent, setTo: boolean) {

      // Do nothing if this is a key repeat
      if (e.repeat) return;

      function set(bit: number) {
        if (setTo) moveRef.current |= bit;
        else moveRef.current &= ~bit;
      }

      if (e.key == KEY_LEFT) {
        set(MOVE_LEFT);
      } else if (e.key == KEY_UP) {
        set(MOVE_UP);
      } else if (e.key == KEY_RIGHT) {
        set(MOVE_RIGHT);
      } else if (e.key == KEY_DOWN) {
        set(MOVE_DOWN);
      } else return;

      // Request animation frame if there is no current animation
      if (tsRef.current === null) {
        // Start animation
        tsRef.current = performance.now();
        requestAnimationFrame(movePos);
      }

    }

    function onKeyDown(e: KeyboardEvent) {
      return adjustKeys(e, true);
    }
    function onKeyUp(e: KeyboardEvent) {
      return adjustKeys(e, false);
    }

    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);

    return () => {
      removeEventListener("keydown", onKeyDown);
      removeEventListener("keyup", onKeyUp);
    };

  }, [onMove]);

}
/* eslint-enable */

