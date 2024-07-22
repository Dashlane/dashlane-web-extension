import React from "react";
import { DispatcherMessages } from "@dashlane/autofill-engine/dist/autofill-engine/src/dispatcher";
import { useCommunication } from "../../../context/communication";
import { KEYBOARD_EVENTS } from "../../../constants";
export const KEYBOARD_ACCESSIBLE_ATTRIBUTE = "data-keyboard-accessible";
const ACTIVE_ELEMENT_CLASSNAME = "active";
const getKeyboardAccessibleElementDescription = (el: Element) =>
  el.getAttribute(KEYBOARD_ACCESSIBLE_ATTRIBUTE);
const isElementKeyboardAccessible = (el: Element) =>
  Boolean(getKeyboardAccessibleElementDescription(el)) &&
  getKeyboardAccessibleElementDescription(el) !== "false";
export const useKeyboardNavigation = (args: {
  container: React.MutableRefObject<HTMLElement | null>;
  srcElement?: {
    elementId: string;
    frameId: string;
  };
  webcardId?: string;
}) => {
  const { container, srcElement, webcardId } = args;
  const { autofillEngineDispatcher } = useCommunication();
  const rootElement = React.useRef<HTMLElement | null>(null);
  const activeElement = React.useRef<HTMLElement | null>(null);
  const [activeElementDescription, setActiveElementDescription] =
    React.useState<string>();
  const setActiveElement = (newActiveElement: Element | null) => {
    if (newActiveElement) {
      activeElement.current?.classList.remove(ACTIVE_ELEMENT_CLASSNAME);
      activeElement.current = newActiveElement as HTMLElement;
      activeElement.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      activeElement.current.classList.add(ACTIVE_ELEMENT_CLASSNAME);
      const description = getKeyboardAccessibleElementDescription(
        activeElement.current
      );
      if (description && description !== "true") {
        setActiveElementDescription(description);
      }
    }
  };
  const getFirstKeyboardAccessibleDescendant = React.useCallback(
    (refElement: Element, reverse = false): Element | null => {
      for (let i = 0; i < refElement.children.length; i++) {
        const child =
          refElement.children[reverse ? refElement.children.length - 1 - i : i];
        if (isElementKeyboardAccessible(child)) {
          return child;
        }
        const nextElement = getFirstKeyboardAccessibleDescendant(
          child,
          reverse
        );
        if (nextElement) {
          return nextElement;
        }
      }
      return null;
    },
    []
  );
  const getNextKeyboardAccessibleElement = React.useCallback(
    (refElement: Element, reverse = false): Element | null => {
      let current: Element | null = refElement;
      if (!reverse) {
        const firstKeyboardAccessibleDescendant =
          getFirstKeyboardAccessibleDescendant(current);
        if (firstKeyboardAccessibleDescendant) {
          return firstKeyboardAccessibleDescendant;
        }
      }
      while (current && current !== rootElement.current) {
        const sibling = reverse
          ? current.previousElementSibling
          : current.nextElementSibling;
        if (!sibling) {
          if (
            reverse &&
            current.parentElement &&
            isElementKeyboardAccessible(current.parentElement)
          ) {
            return current.parentElement;
          }
          current = current.parentElement;
          continue;
        }
        const isSiblingKeyboardAccessible =
          isElementKeyboardAccessible(sibling);
        const keyboardAccessibleDescendant =
          getFirstKeyboardAccessibleDescendant(sibling, reverse);
        if (isSiblingKeyboardAccessible && keyboardAccessibleDescendant) {
          return reverse ? keyboardAccessibleDescendant : sibling;
        }
        if (isSiblingKeyboardAccessible || keyboardAccessibleDescendant) {
          return keyboardAccessibleDescendant ?? sibling;
        }
        current = sibling;
      }
      return null;
    },
    [getFirstKeyboardAccessibleDescendant]
  );
  const goToNextItem = React.useCallback(
    (key: KEYBOARD_EVENTS) => {
      if (!rootElement.current) {
        return;
      }
      if (
        !activeElement.current ||
        !rootElement.current.contains(activeElement.current)
      ) {
        setActiveElement(
          getFirstKeyboardAccessibleDescendant(rootElement.current)
        );
        return;
      }
      let nextElement: Element | null = null;
      switch (key) {
        case KEYBOARD_EVENTS.ARROW_DOWN:
        case KEYBOARD_EVENTS.ARROW_UP:
          nextElement = getNextKeyboardAccessibleElement(
            activeElement.current,
            key === KEYBOARD_EVENTS.ARROW_UP
          );
          break;
      }
      setActiveElement(nextElement);
    },
    [getFirstKeyboardAccessibleDescendant, getNextKeyboardAccessibleElement]
  );
  const handleKeyNavigation = React.useCallback(
    (key: string) => {
      switch (key) {
        case KEYBOARD_EVENTS.ARROW_UP:
        case KEYBOARD_EVENTS.ARROW_DOWN:
          goToNextItem(key);
          break;
        case KEYBOARD_EVENTS.ENTER:
          if (activeElement?.current) {
            activeElement.current.click();
            const description = getKeyboardAccessibleElementDescription(
              activeElement.current
            );
            if (description && description !== "true") {
              setActiveElementDescription(description);
            }
          }
          break;
      }
    },
    [goToNextItem, setActiveElementDescription]
  );
  React.useEffect(() => {
    if (container) {
      rootElement.current = container.current;
      activeElement.current = null;
      setActiveElementDescription(undefined);
    }
  }, [container]);
  React.useEffect(() => {
    const handleKeydownEvent = (event: KeyboardEvent) => {
      handleKeyNavigation(event.key);
    };
    window.document.addEventListener("keydown", handleKeydownEvent);
    return () =>
      window.document.removeEventListener("keydown", handleKeydownEvent);
  }, [container, handleKeyNavigation]);
  React.useEffect(() => {
    if (webcardId && srcElement) {
      autofillEngineDispatcher?.sendMessage(
        {
          message: DispatcherMessages.SubscribeKeyboardNavigationEvents,
          targetFrameId: Number(srcElement.frameId),
        },
        webcardId,
        srcElement.elementId
      );
      autofillEngineDispatcher?.addListener(
        DispatcherMessages.KeyboardNavigationEvent,
        (_options, targetWebcardId: string, key: string) => {
          if (targetWebcardId !== webcardId) {
            return;
          }
          handleKeyNavigation(key);
        }
      );
    }
    return () => {
      if (webcardId && srcElement) {
        autofillEngineDispatcher?.removeListener(
          DispatcherMessages.KeyboardNavigationEvent
        );
      }
    };
  }, [autofillEngineDispatcher, handleKeyNavigation, srcElement, webcardId]);
  return activeElementDescription;
};
