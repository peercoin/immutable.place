import {
  AnimationType,
  ReactZoomPanPinchContext,
  StateType
} from "../../models";
import { animations } from "./animations.constants";

/* eslint-disable max-params */

function handleCancelAnimationFrame(animation: AnimationType | null) {
  if (typeof animation === "number") {
    cancelAnimationFrame(animation);
  }
}

export function handleCancelAnimation(
  contextInstance: ReactZoomPanPinchContext
): void {
  if (!contextInstance.mounted) {
    return;
  }
  handleCancelAnimationFrame(contextInstance.animation);
  // Clear animation state
  contextInstance.animate = false;
  contextInstance.animation = null;
  contextInstance.velocity = null;
}

export function handleSetupAnimation(
  contextInstance: ReactZoomPanPinchContext,
  animationName: keyof typeof animations,
  animationTime: number,
  callback: (step: number) => void
): void {
  if (!contextInstance.mounted) {
    return;
  }
  const startTime = new Date().getTime();
  const lastStep = 1;

  // if another animation is active
  handleCancelAnimation(contextInstance);

  // new animation
  contextInstance.animation = () => {
    if (!contextInstance.mounted) {
      handleCancelAnimationFrame(contextInstance.animation);
      return;
    }

    const frameTime = new Date().getTime() - startTime;
    const animationProgress = frameTime / animationTime;
    const animationType = animations[animationName];

    const step = animationType(animationProgress);

    if (frameTime >= animationTime) {
      callback(lastStep);
      contextInstance.animation = null;
    } else if (contextInstance.animation !== null) {
      callback(step);
      requestAnimationFrame(contextInstance.animation);
    }
  };

  requestAnimationFrame(contextInstance.animation);
}

function isValidTargetState(targetState: StateType): boolean {
  const { scale, positionX, positionY } = targetState;

  if (isNaN(scale) || isNaN(positionX) || isNaN(positionY)) {
    return false;
  }

  return true;
}

export function animate(
  contextInstance: ReactZoomPanPinchContext,
  targetState: StateType,
  animationTime: number,
  animationName: keyof typeof animations
): void {
  const isValid = isValidTargetState(targetState);
  if (!contextInstance.mounted || !isValid) {
    return;
  }
  const { setTransformState } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.transformState;

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  if (animationTime === 0) {
    setTransformState(
      targetState.scale,
      targetState.positionX,
      targetState.positionY
    );
  } else {
    // animation start timestamp
    handleSetupAnimation(
      contextInstance,
      animationName,
      animationTime,
      (step: number) => {
        const newScale = scale + scaleDiff * step;
        const newPositionX = positionX + positionXDiff * step;
        const newPositionY = positionY + positionYDiff * step;

        setTransformState(newScale, newPositionX, newPositionY);
      }
    );
  }
}

