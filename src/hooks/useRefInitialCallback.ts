import {MutableRefObject, useCallback, useRef} from "react";

/**
 * Returns a {useRef} ref followed by a {useCallback} callback. The callback
 * argument is called once when the ref is set.
 */
export default function useRefInitialCallback<T>(
  callback: (value: T) => void,
  alwaysCallback?: (value: T) => void
): [MutableRefObject<T | null>, (value: T) => void] {

  const didSet = useRef(false);
  const ref = useRef<T | null>(null);

  const refCallback = useCallback((value: T | null) => {

    ref.current = value;

    // Call alwaysCallback if the value isn't null
    if (value === null) return;
    if (alwaysCallback) alwaysCallback(value);

    // Continue and call the initial callback if we haven't set before
    if (didSet.current) return;
    didSet.current = true;

    callback(value);

  }, [callback, alwaysCallback]);

  return [ref, refCallback];

}

