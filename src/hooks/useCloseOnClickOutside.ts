import { useEffect } from "react";

export default function useCloseOnClickOutside(
  isVisible: boolean,
  onSetVisibility: (isVisible: boolean) => void,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        isVisible &&
        containerRef.current &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        onSetVisibility(false);
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
