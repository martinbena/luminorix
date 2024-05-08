import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  zIndex: string;
  children?: ReactNode;
}

export default function Overlay({
  isOpen,
  onClose,
  zIndex,
  children,
}: OverlayProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        onClose
      )
        onClose();
    }

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayContainer = document.getElementById("overlay");

  return overlayContainer
    ? createPortal(
        <div
          onClick={children ? undefined : onClose}
          className={`bg-zinc-800/50 h-full w-full fixed top-0 left-0 flex justify-center items-center ${zIndex}`}
        >
          {children ? (
            <div ref={modalRef}>
              <Modal>{children}</Modal>
            </div>
          ) : (
            "&nbsp;"
          )}
        </div>,
        overlayContainer
      )
    : null;
}
