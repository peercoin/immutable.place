import {MutableRefObject, useCallback, useRef} from "react";

/**
 * Returns a {useRef} ref followed by a {useCallback} callback. The callback
 * argument is called once when the ref is set.
 */
export default function useRefInitialCallback<T>(
  callback: (value: T) => void
): [MutableRefObject<T | null>, (value: T) => void] {

  const didSet = useRef(false);
  const ref = useRef<T | null>(null);
  const refCallback = useCallback((value: T | null) => {

    ref.current = value;

    // Do not continue if we have already set or if the value is null
    if (value === null || didSet.current) return;
    didSet.current = true;

    callback(value);

  }, [callback]);

  return [ref, refCallback];

}

