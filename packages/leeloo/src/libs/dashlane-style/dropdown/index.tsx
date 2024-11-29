import { createRef, ReactNode, useEffect, useState } from "react";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";
import styles from "./styles.css";
import backdropAnimation from "./backdrop-animation.css";
import { enumToClassName, getDOMNode, getParents } from "./helpers";
export enum DropdownPosition {
  Top,
  Bottom,
  Right,
  Left,
}
export enum DropdownAlignment {
  Start,
  Middle,
  End,
}
export interface Props {
  children?: React.ReactNode;
  renderRoot: (toggle: () => void) => ReactNode;
  position: DropdownPosition;
  alignment: DropdownAlignment;
  withBackdrop: boolean;
  onToggle?: (isOpen: boolean) => void;
  anchor?: JSX.Element;
}
export const Dropdown = ({
  children,
  renderRoot,
  position,
  alignment,
  withBackdrop,
  onToggle,
  anchor,
}: Props) => {
  const dropdownRef = createRef<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    onToggle?.(!isOpen);
    setIsOpen(!isOpen);
  };
  const closeDropdown = () => {
    onToggle?.(false);
    setIsOpen(false);
  };
  const handleClick = (e: MouseEvent) => {
    if (!isOpen) {
      return;
    }
    if (!(e.target instanceof Element)) {
      throw new Error(`invalid target: ${e.target}`);
    }
    const forceNoClose = e.target.getAttribute("data-no-close-dropdown");
    if (forceNoClose) {
      return;
    }
    const dropdown = dropdownRef.current;
    const insideDropdown = !dropdown || dropdown.contains(e.target);
    if (!insideDropdown) {
      closeDropdown();
    }
    const target = getDOMNode(e.target);
    const parents = getParents(dropdown, target, [target]);
    const forceClose = parents.some((p) =>
      p?.getAttribute("data-close-dropdown")
    );
    if (forceClose) {
      closeDropdown();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeDropdown();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
  const positionClass = enumToClassName(DropdownPosition[position]);
  const alignmentClass = enumToClassName(DropdownAlignment[alignment]);
  const dropdownWrapperClassName = classnames(
    styles.dropdownWrapper,
    styles[alignmentClass],
    styles[positionClass]
  );
  return (
    <div onKeyDown={handleKeyDown}>
      <CSSTransition
        key="CSSTransition"
        classNames={{ ...backdropAnimation }}
        timeout={150}
        in={withBackdrop && isOpen}
        unmountOnExit
      >
        <div className={styles.backdrop} />
      </CSSTransition>
      <div key="dropdown" className={styles.dropdown} ref={dropdownRef}>
        {renderRoot(toggleOpen)}
        {anchor}
        <CSSTransition
          classNames={{ ...styles }}
          timeout={150}
          in={isOpen}
          unmountOnExit
        >
          <div className={dropdownWrapperClassName}>
            <div className={styles.dropdownContent}>
              <div />
              {children}
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};
