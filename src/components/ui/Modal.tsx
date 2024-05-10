import {
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ButtonIcon from "./ButtonIcon";
import { PiXThin } from "react-icons/pi";
import useCloseOnClickOutside from "@/hooks/useCloseOnClickOutside";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";
import { createPortal } from "react-dom";

interface ModalContextProps {
  openName: string;
  close: React.Dispatch<React.SetStateAction<string>>;
  open: React.Dispatch<React.SetStateAction<string>>;
}

const ModalContext = createContext({} as ModalContextProps);

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  children: ReactElement;
  opens: string;
}

function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useContext(ModalContext);

  const handleOpenModal = (event: React.MouseEvent<HTMLElement>) => {
    if (children.props.onClick) {
      children.props.onClick(event);
    }
    open(opensWindowName);
  };

  return cloneElement(children, { onClick: handleOpenModal });
}

interface ContentProps {
  children?: ReactElement;
  onCloseOutsideContent?: () => void;
  isOpenFromOutside?: boolean;
  name: string;
  zIndex?: string;
}

function Content({
  children,
  onCloseOutsideContent,
  isOpenFromOutside,
  name,
  zIndex = "z-40",
}: ContentProps) {
  const { openName, close } = useContext(ModalContext);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useCloseOnClickOutside(name === openName, close, modalRef);
  useKeyboardInteractions(name === openName, close, modalRef);

  useEffect(() => {
    if (name === openName || isOpenFromOutside) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [name, openName, isOpenFromOutside]);

  if (children && name !== openName) return null;
  if (!children && !isOpenFromOutside) return null;

  function handleCloseOnClick(event: React.MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
    onCloseOutsideContent?.();
    close("");
  }

  const overlayContainer = document.getElementById("overlay");

  return overlayContainer
    ? createPortal(
        <div
          onClick={children ? undefined : handleCloseOnClick}
          className={`bg-zinc-800/50 h-full w-full fixed top-0 left-0 flex justify-center items-center ${zIndex}`}
        >
          {children ? (
            <div
              ref={modalRef}
              className="min-w-96 pb-8 px-12 pt-10 bg-white shadow-form rounded-md text-zinc-800 relative [&>*:nth-child(1)]:absolute [&>*:nth-child(1)]:top-4 [&>*:nth-child(1)]:right-4"
            >
              <ButtonIcon variant="small" onClick={close}>
                <PiXThin />
              </ButtonIcon>
              <div>{cloneElement(children, { onCloseModal: close })}</div>
            </div>
          ) : null}
        </div>,
        overlayContainer
      )
    : null;
}

Modal.Open = Open;
Modal.Content = Content;

export default Modal;
