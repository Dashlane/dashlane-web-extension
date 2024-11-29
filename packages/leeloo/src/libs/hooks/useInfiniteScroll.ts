import * as React from "react";
export interface UseInfiniteScrollParams {
  hasMore: boolean;
  loadMore: () => void;
  scrollContainerRef: React.RefObject<Element>;
  bottomRef: React.RefObject<Element>;
}
export function useInfiniteScroll({
  hasMore,
  scrollContainerRef,
  bottomRef,
  loadMore,
}: UseInfiniteScrollParams): void {
  React.useEffect(() => {
    const loaderNode = bottomRef.current;
    const scrollContainerNode = scrollContainerRef.current;
    if (!scrollContainerNode || !loaderNode || !hasMore) {
      return;
    }
    scrollContainerNode?.scrollTo(0, 0);
    const options = {
      root: null,
      rootMargin: `0px`,
      threshold: 1.0,
    };
    const listener: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    };
    const observer = new IntersectionObserver(listener, options);
    observer.observe(loaderNode);
    return () => observer.disconnect();
  }, [hasMore, scrollContainerRef, bottomRef, loadMore]);
}
