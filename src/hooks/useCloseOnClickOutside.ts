import { useEffect } from "react";

export default function useCloseOnClickOutside<T>(
  isVisible: boolean,
  onSetVisibility: (value: T) => void,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        isVisible &&
        containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        onSetVisibility({} as T);
      }
    }

    if (isVisible) {
      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isVisible, onSetVisibility, containerRef]);
}
