import {useEffect} from "react";

const listeners: Array<() => void> = [];

window.addEventListener(
  "keydown",
  (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      const listenerCopy = listeners.slice();
      listenerCopy.forEach(cb => cb());
    }
  }
);

/**
 * Calls a callback when the escape key has been pressed, ensuring that all
 * callbacks are called even if other listeners cause a callback to be removed.
 */
export default function useEscape(onEscape: () => void) {

  useEffect(() => {

    listeners.push(onEscape);

    return () => {
      listeners.splice(listeners.indexOf(onEscape), 1);
    };

  }, [onEscape]);

}

