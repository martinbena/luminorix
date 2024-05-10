import { RefObject, useEffect } from "react";

export default function useKeyboardInteractions<T>(
  isVisible: boolean,
  onSetVisibility: (value: T) => void,
  containerRef: RefObject<HTMLElement>,
  customQuerySelector?: string
) {
  useEffect(() => {
    if (isVisible) {
      const handleTabKey = (e: KeyboardEvent): void => {
        const focusableElements = containerRef.current?.querySelectorAll(
          customQuerySelector ?? "a, button"
        );

        if (!focusableElements) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (
          e.key === "Tab" &&
          e.shiftKey &&
          document.activeElement === firstElement
        ) {
          e.preventDefault();
          (lastElement as HTMLElement).focus();
        }

        if (
          e.key === "Tab" &&
          !e.shiftKey &&
          document.activeElement === lastElement
        ) {
          e.preventDefault();
          (firstElement as HTMLElement).focus();
        }
      };

      const handleEscapeKey = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          onSetVisibility({} as T);
        }
      };

      document.addEventListener("keydown", handleTabKey);
      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isVisible, onSetVisibility, customQuerySelector, containerRef]);
}
