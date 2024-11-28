import React, { HTMLAttributes, useEffect } from "react";
import { List } from "@dashlane/design-system";
export interface SectionListProps extends HTMLAttributes<HTMLUListElement> {
  headerRef?: React.RefObject<HTMLElement>;
  containerRef?: React.RefObject<HTMLElement>;
}
export const SectionList = ({
  headerRef,
  containerRef,
  ...rest
}: SectionListProps) => {
  const listRef = React.useRef<HTMLUListElement>(null);
  useEffect(() => {
    const listElement = listRef.current;
    const onFocusIn = (e: Event) => {
      const focusedItem = e.target;
      const header = headerRef?.current;
      const container = containerRef?.current;
      if (header && container && focusedItem instanceof Element) {
        const headerBottom = header.getBoundingClientRect().bottom;
        const itemTop = focusedItem.getBoundingClientRect().top;
        if (headerBottom > itemTop) {
          container.scrollBy({
            top: -(headerBottom - itemTop),
          });
        }
      }
    };
    listElement?.addEventListener("focusin", onFocusIn);
    return () => {
      listElement?.removeEventListener("focusin", onFocusIn);
    };
  }, [containerRef, headerRef]);
  return <List {...rest} ref={listRef} data-testid="section-list" />;
};
