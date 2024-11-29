import {
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CloseOnEscape from "react-close-on-escape";
import { DSStyleObject, mergeSx, ModalContext } from "@dashlane/design-system";
import zIndexVars from "../../../libs/dashlane-style/globals/z-index-variables.css";
import { OutsideClickHandler } from "../../../libs/outside-click-handler/outside-click-handler";
const SX_STYLES: Partial<DSStyleObject> = {
  position: "absolute",
  top: 0,
  right: 0,
  width: "640px",
  maxWidth: "80vw",
  outline: "none",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  color: "ds.text.neutral.standard",
  backgroundColor: "ds.container.agnostic.neutral.quiet",
  zIndex: zIndexVars["--z-index-webapp-panel"],
  "> div ": {
    position: "static",
    border: 0,
  },
};
interface PanelProps {
  ignoreClickOutsideClassName?: string;
  onNavigateOut: (event?: MouseEvent<HTMLElement>) => void;
  ignoreCloseOnEscape?: boolean;
  containerSx?: Partial<DSStyleObject>;
}
const Panel = ({
  children,
  ignoreClickOutsideClassName,
  ignoreCloseOnEscape,
  onNavigateOut,
  containerSx,
}: PropsWithChildren<PanelProps>) => {
  const [disableCloseOnEscape, setDisableCloseOnEscape] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const modalContextValue = useMemo<ModalContext>(
    () => ({
      innerContainer: panelRef.current,
      setDisableCloseOnEscape,
    }),
    [setDisableCloseOnEscape]
  );
  const closeOnEscape = () => {
    if (ignoreCloseOnEscape || disableCloseOnEscape) {
      return;
    }
    onNavigateOut();
  };
  useEffect(() => {
    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          "a[href], button, textarea, input, select"
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[
            focusableElements.length - 1
          ] as HTMLElement;
          if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          } else if (
            event.shiftKey &&
            document.activeElement === firstElement
          ) {
            lastElement.focus();
            event.preventDefault();
          }
        }
      }
    };
    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, []);
  const ANIMATION_DURATION_MS = 200;
  useEffect(() => {
    const postAnimationFocusTimer = setTimeout(() => {
      const asides = document.getElementsByTagName("aside");
      if (asides && asides[0]) {
        asides[0].focus();
      }
    }, ANIMATION_DURATION_MS);
    return () => {
      clearTimeout(postAnimationFocusTimer);
    };
  }, []);
  return (
    <OutsideClickHandler
      onOutsideClick={onNavigateOut}
      ignoredClassName={ignoreClickOutsideClassName}
    >
      <CloseOnEscape onEscape={closeOnEscape}>
        <ModalContext.Provider value={modalContextValue}>
          <aside
            ref={panelRef}
            tabIndex={-1}
            data-testid="aside-panel"
            sx={mergeSx([SX_STYLES, containerSx ?? {}])}
          >
            {children}
          </aside>
        </ModalContext.Provider>
      </CloseOnEscape>
    </OutsideClickHandler>
  );
};
export default Panel;
