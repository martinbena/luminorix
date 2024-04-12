import { createPortal } from "react-dom";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Overlay({ isOpen, onClose }: OverlayProps) {
  if (!isOpen) return null;

  const overlayContainer = document.getElementById("overlay");

  return overlayContainer
    ? createPortal(
        <div
          onClick={onClose}
          className="bg-zinc-800 opacity-50 h-full w-full fixed top-0 left-0 z-20"
        >
          &nbsp;
        </div>,
        overlayContainer
      )
    : null;
}
