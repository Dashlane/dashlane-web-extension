import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
export interface Context {
  isSideMenuCollapsed: boolean;
  closeSideMenu: () => void;
  openSideMenu: () => void;
  toggleSideMenu: () => void;
}
interface Provider {
  children: ReactNode;
}
const SideMenuCollapsedContext = createContext<Context>({} as Context);
const MINIMAL_VIEWPORT_WIDTH_FOR_SIDEMENU = 1200;
const isViewportTooSmallForSidemenu = (currentViewportWidth: number) => {
  return currentViewportWidth <= MINIMAL_VIEWPORT_WIDTH_FOR_SIDEMENU;
};
const SideMenuCollapsedProvider = ({ children }: Provider) => {
  const previousViewportWidth = useRef(document.documentElement.clientWidth);
  const [isSideMenuCollapsed, setIsSideMenuCollapsed] = useState(
    isViewportTooSmallForSidemenu(previousViewportWidth.current)
  );
  useEffect(() => {
    const windowResizeListener = () => {
      const currentViewportWidth = document.documentElement.clientWidth;
      const isWindowWidthDecreasing =
        currentViewportWidth < previousViewportWidth.current;
      previousViewportWidth.current = currentViewportWidth;
      if (
        isWindowWidthDecreasing &&
        isViewportTooSmallForSidemenu(currentViewportWidth) &&
        !isSideMenuCollapsed
      ) {
        setIsSideMenuCollapsed(true);
      }
    };
    window.addEventListener("resize", windowResizeListener);
    return () => {
      window.removeEventListener("resize", windowResizeListener);
    };
  }, []);
  const contextValue = {
    toggleSideMenu: () => setIsSideMenuCollapsed((prevValue) => !prevValue),
    closeSideMenu: () => setIsSideMenuCollapsed(true),
    openSideMenu: () => setIsSideMenuCollapsed(false),
    isSideMenuCollapsed,
  };
  return (
    <SideMenuCollapsedContext.Provider value={contextValue}>
      {children}
    </SideMenuCollapsedContext.Provider>
  );
};
const useSideMenuCollapsedContext = () => useContext(SideMenuCollapsedContext);
export { SideMenuCollapsedProvider, useSideMenuCollapsedContext };
