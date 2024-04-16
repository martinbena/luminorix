import { useEffect } from "react";

export default function useClickInteraction(
  isVisible: boolean,
  onSetVisibility: (isVisible: boolean) => void,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        isVisible &&
        containerRef.current &&
        containerRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).tagName.toLowerCase() === "a"
      ) {
        onSetVisibility(false);
      }
    };

    if (isVisible) {
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  }, [isVisible, onSetVisibility, containerRef]);
}
