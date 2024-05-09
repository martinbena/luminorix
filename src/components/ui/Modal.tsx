import {
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import ButtonIcon from "./ButtonIcon";
import { PiXThin } from "react-icons/pi";


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
  children: ReactElement;
  name: string;
}

function Content({ children, name }: ContentProps) {
  const { openName, close } = useContext(ModalContext);

  if (name !== openName) return null;

  return (
    <div className="min-w-96 pb-8 px-12 pt-10 bg-white shadow-form rounded-md text-zinc-800 relative [&>*:nth-child(1)]:absolute [&>*:nth-child(1)]:top-4 [&>*:nth-child(1)]:right-4">
      <ButtonIcon variant="small" onClick={close}>
        <PiXThin />
      </ButtonIcon>
      <div>{cloneElement(children, { onCloseModal: close })}</div>
    </div>
  );
}

Modal.Open = Open;
Modal.Content = Content;

export default Modal;
