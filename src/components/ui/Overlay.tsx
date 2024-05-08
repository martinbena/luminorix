import { createPortal } from "react-dom";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  zIndex: string;
}

export default function Overlay({ isOpen, onClose, zIndex }: OverlayProps) {
  if (!isOpen) return null;

  const overlayContainer = document.getElementById("overlay");

  return overlayContainer
    ? createPortal(
        <div
          onClick={onClose}
          className={`bg-zinc-800 opacity-50 h-full w-full fixed top-0 left-0 ${zIndex}`}
        >
          &nbsp;
        </div>,
        overlayContainer
      )
    : null;
}
