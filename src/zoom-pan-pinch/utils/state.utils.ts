import { initialSetup, initialState } from "../constants/state.constants";
import {
  LibrarySetup,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState
} from "../models/context.model";

export function createState(
  props: ReactZoomPanPinchProps
): ReactZoomPanPinchState {
  return {
    previousScale: props.initialScale ?? initialState.scale,
    scale: props.initialScale ?? initialState.scale,
    positionX: props.initialPositionX ?? initialState.positionX,
    positionY: props.initialPositionY ?? initialState.positionY
  };
}

export function createSetup(props: ReactZoomPanPinchProps): LibrarySetup {
  const newSetup: LibrarySetup = { ...initialSetup };

  Object.keys(props).forEach((key) => {

    const setupKey = key as keyof LibrarySetup;

    const propValue = props[key as keyof ReactZoomPanPinchProps];
    const initialValue = initialSetup[setupKey];

    const validValue = typeof propValue !== "undefined";
    const validParameter = typeof initialValue !== "undefined";

    if (validParameter && validValue) {

      const dataType = Object.prototype.toString.call(initialValue);
      const isObject = dataType === "[object Object]";
      const isArray = dataType === "[object Array]";

      // Cast so that the types are unknown so they can be assigned a value
      const setupAssigner = newSetup as Record<keyof LibrarySetup, unknown>;

      if (isObject) {
        setupAssigner[setupKey] = {
          ...initialValue as object,
          ...propValue as object
        };
      } else if (isArray) {
        setupAssigner[setupKey] = [
          ...initialValue as unknown as unknown[],
          ...propValue as unknown as unknown[]
        ];
      } else {
        setupAssigner[setupKey] = propValue;
      }

    }

  });

  return newSetup;
}
