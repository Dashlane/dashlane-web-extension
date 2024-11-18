import * as React from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import styles from "./styles.css";
const useEscapeHandler = (onKeyPressed: () => void) => {
  React.useEffect(() => {
    const onEscapeHandler = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        event.preventDefault();
        onKeyPressed();
      }
    };
    document.addEventListener("keydown", onEscapeHandler);
    return () => {
      document.removeEventListener("keydown", onEscapeHandler);
    };
  }, [onKeyPressed]);
};
interface Props {
  visible: boolean;
  onClose: () => void;
  className?: string;
}
const Modal: React.FunctionComponent<Props> = ({
  visible,
  children,
  onClose,
  className,
}) => {
  useEscapeHandler(onClose);
  const modalRoot = document.getElementById("modal");
  if (!modalRoot || !visible) {
    return null;
  }
  return createPortal(
    <aside className={classNames(styles.modal, className)}>{children}</aside>,
    modalRoot
  );
};
export default Modal;
