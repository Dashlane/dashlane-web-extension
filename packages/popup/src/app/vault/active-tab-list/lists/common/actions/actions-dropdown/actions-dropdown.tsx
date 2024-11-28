import React, { useEffect, useRef } from "react";
import { Dropdown, DropdownProps } from "./dropdown";
export const ActionsDropdown = ({
  isOpen,
  setIsOpen,
  onKeyDown,
  ...rest
}: DropdownProps) => {
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const enterKeyUsedToToggle = useRef(false);
  const firstRender = useRef(true);
  const focusDropdownButton = () => {
    const dropdownButton = dropdownMenuRef.current?.querySelector("button");
    dropdownButton?.focus();
  };
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (isOpen || enterKeyUsedToToggle.current) {
      enterKeyUsedToToggle.current = false;
      focusDropdownButton();
    }
  }, [isOpen]);
  const handleDropdownMenuBlur = (event: React.FocusEvent) => {
    const currentTarget = event.currentTarget;
    window.setTimeout(() => {
      const focused = document.activeElement;
      if (!currentTarget.contains(focused)) {
        setIsOpen(false);
      }
    }, 100);
  };
  const handleContentKeyboardNavigation = (e: React.KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown"].includes(e.key)) {
      return;
    }
    const dropdownElements = contentRef.current?.querySelectorAll(
      "button:not([disabled])"
    );
    if (!dropdownElements?.length) {
      return;
    }
    const currentFocusedElementIndex = Array.from(dropdownElements).findIndex(
      (dropdownElement) => dropdownElement.isSameNode(document.activeElement)
    );
    if (currentFocusedElementIndex === -1 && e.key === "ArrowUp") {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    if (currentFocusedElementIndex === 0 && e.key === "ArrowUp") {
      focusDropdownButton();
      return;
    }
    const nextElementIndex =
      currentFocusedElementIndex + (e.key === "ArrowDown" ? 1 : -1);
    if (nextElementIndex < dropdownElements.length) {
      (dropdownElements[nextElementIndex] as HTMLElement).focus();
    }
  };
  return (
    <div
      ref={dropdownMenuRef}
      onBlur={handleDropdownMenuBlur}
      onKeyDown={handleContentKeyboardNavigation}
    >
      <Dropdown
        ref={contentRef}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            enterKeyUsedToToggle.current = true;
          }
          onKeyDown?.(event);
        }}
        {...rest}
      />
    </div>
  );
};
