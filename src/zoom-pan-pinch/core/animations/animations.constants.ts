/**
 * Functions should return denominator of the target value, which is the next animation step.
 * t is a value from 0 to 1, reflecting the percentage of animation status.
 */

/* eslint-disable no-param-reassign */

function easeOut(t: number): number {
  return -Math.cos(t * Math.PI) / 2 + 0.5;
}
// linear
function linear(t: number): number {
  return t;
}
// accelerating from zero velocity
function easeInQuad(t: number): number {
  return t * t;
}
// decelerating to zero velocity
function easeOutQuad(t: number): number {
  return t * (2 - t);
}
// acceleration until halfway, then deceleration
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
// accelerating from zero velocity
function easeInCubic(t: number): number {
  return t * t * t;
}
// decelerating to zero velocity
function easeOutCubic(t: number): number {
  return --t * t * t + 1;
}
// acceleration until halfway, then deceleration
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
// accelerating from zero velocity
function easeInQuart(t: number): number {
  return t * t * t * t;
}
// decelerating to zero velocity
function easeOutQuart(t: number): number {
  return 1 - --t * t * t * t;
}
// acceleration until halfway, then deceleration
function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}
// accelerating from zero velocity
function easeInQuint(t: number): number {
  return t * t * t * t * t;
}
// decelerating to zero velocity
function easeOutQuint(t: number): number {
  return 1 + --t * t * t * t * t;
}
// acceleration until halfway, then deceleration
function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export const animations = {
  easeOut,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint
};
