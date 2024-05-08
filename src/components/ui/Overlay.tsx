import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import useCloseOnClickOutside from "@/hooks/useCloseOnClickOutside";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
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

  useCloseOnClickOutside(isOpen, onClose, modalRef);
  useKeyboardInteractions(isOpen, onClose, modalRef);

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
