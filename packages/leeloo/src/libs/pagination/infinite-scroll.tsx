import React, { ReactNode } from "react";
import { throttle as _throttle } from "lodash";
import styles from "./styles.css";
export interface InfiniteScrollProps {
  hasNext: boolean;
  hasPrevious: boolean;
  isLoading: boolean;
  loadNext: (canUnload: boolean) => void;
  loadPrevious: (canUnload: boolean) => void;
  threshold?: number;
  throttle?: number;
  children?: ReactNode;
  customContainer?: React.RefObject<HTMLElement>;
}
const DEFAULT_THRESHOLD = 400;
const DEFAULT_THROTTLE = 5;
export const InfiniteScroll = ({
  customContainer,
  throttle = DEFAULT_THROTTLE,
  threshold = DEFAULT_THRESHOLD,
  hasNext,
  hasPrevious,
  loadNext,
  loadPrevious,
  isLoading,
  children,
}: InfiniteScrollProps) => {
  const bottomSentinelRef = React.useRef<HTMLLIElement>(null);
  const topSentinelRef = React.useRef<HTMLLIElement>(null);
  const containerRef = React.useRef<HTMLUListElement>(null);
  const lastScroll = React.useRef(0);
  const container = React.useCallback((): HTMLElement | undefined => {
    if (customContainer?.current) {
      return customContainer.current;
    }
    if (containerRef.current) {
      return containerRef.current;
    }
    console.error("[InfiniteScroll] - container not registered");
    return undefined;
  }, [customContainer]);
  const bottomSentinel = (): HTMLElement | undefined => {
    if (!bottomSentinelRef.current) {
      console.error("[InfiniteScroll] - bottomSentinel not registered");
      return undefined;
    }
    return bottomSentinelRef.current;
  };
  const topSentinel = (): HTMLElement | undefined => {
    if (!topSentinelRef.current) {
      console.error("[InfiniteScroll] - topSentinel not registered");
      return undefined;
    }
    return topSentinelRef.current;
  };
  const fullPage = React.useCallback((): boolean | undefined => {
    const parentBottom = container()?.getBoundingClientRect().bottom;
    const bottomSentinelTop = bottomSentinel()?.getBoundingClientRect().top;
    if (!bottomSentinelTop || !parentBottom) {
      console.error(
        "[InfiniteScroll][fullPage] - Error retrieving bottomSentinel or container elements"
      );
      return;
    }
    return bottomSentinelTop > parentBottom;
  }, [container]);
  const reachingBottom = React.useCallback((): boolean | undefined => {
    const bottomSentinelTop = bottomSentinel()?.getBoundingClientRect().top;
    const parentBottom = container()?.getBoundingClientRect().bottom;
    if (!bottomSentinelTop || !parentBottom) {
      console.error(
        "[InfiniteScroll][reachingBottom] - Error retrieving bottomSentinel or container elements"
      );
      return;
    }
    return bottomSentinelTop - parentBottom < threshold;
  }, [container, threshold]);
  const reachingTop = React.useCallback((): boolean | undefined => {
    const topSentinelBottom = topSentinel()?.getBoundingClientRect().bottom;
    const parentTop = container()?.getBoundingClientRect().top;
    if (!topSentinelBottom || !parentTop) {
      console.error(
        "[InfiniteScroll][reachingTop] - Error retrieving topSentinelBottom or container elements"
      );
      return;
    }
    return topSentinelBottom + threshold > parentTop;
  }, [container, threshold]);
  const checkNext = React.useCallback(() => {
    if (!isLoading && hasNext && reachingBottom()) {
      const canUnload = fullPage();
      if (canUnload === undefined) {
        console.error(
          "[InfiniteScroll][checkNext] - Full page calcluation failed, unable to loadNext"
        );
        return;
      }
      loadNext(canUnload);
    }
  }, [isLoading, hasNext, reachingBottom, loadNext, fullPage]);
  const checkPrevious = React.useCallback(() => {
    if (!isLoading && hasPrevious && reachingTop()) {
      const canUnload = fullPage();
      if (canUnload === undefined) {
        console.error(
          "[InfiniteScroll][checkPrevious] - Full page calcluation failed, unable to loadNext"
        );
        return;
      }
      loadPrevious(canUnload);
    }
  }, [isLoading, hasPrevious, reachingTop, loadPrevious, fullPage]);
  const checkWindowScroll = React.useCallback(() => {
    const bottomSentinelTop = bottomSentinel()?.getBoundingClientRect().top;
    if (!bottomSentinelTop) {
      console.error(
        "[InfiniteScroll][checkWindowScroll] - BottomSentinelTop calculation failed, returning."
      );
      return;
    }
    const scrollDown = bottomSentinelTop < lastScroll.current;
    lastScroll.current = bottomSentinelTop;
    if (scrollDown) {
      checkNext();
    } else {
      checkPrevious();
    }
  }, [checkPrevious, checkNext]);
  const checkWindowResize = React.useCallback(() => {
    checkNext();
    checkPrevious();
  }, [checkNext, checkPrevious]);
  React.useEffect(() => {
    const scrollHandler = _throttle(checkWindowScroll, throttle);
    const resizeHandler = _throttle(checkWindowResize, throttle);
    container()?.addEventListener("scroll", scrollHandler);
    container()?.addEventListener("resize", resizeHandler);
    if (typeof window === "object" && window.addEventListener) {
      window.addEventListener("resize", resizeHandler);
    }
    return () => {
      container()?.removeEventListener("scroll", scrollHandler);
      container()?.removeEventListener("resize", resizeHandler);
      if (typeof window === "object" && window.removeEventListener) {
        window.removeEventListener("resize", resizeHandler);
      }
    };
  }, [customContainer, container, throttle, checkWindowScroll]);
  React.useEffect(() => {
    checkNext();
  }, [
    customContainer,
    containerRef,
    topSentinelRef,
    bottomSentinelRef,
    isLoading,
    hasNext,
    checkNext,
    children,
  ]);
  return (
    <ul className={styles.wrapper} ref={containerRef}>
      <li role="none" ref={topSentinelRef} />
      {children}
      <li role="none" ref={bottomSentinelRef} />
    </ul>
  );
};
