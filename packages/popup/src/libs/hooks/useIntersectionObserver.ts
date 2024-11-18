import { RefObject, useEffect, useRef } from "react";
export interface UseInfiniteScrollParams {
  hasMore: boolean;
  loadMore: () => void;
  bottomRef: RefObject<Element>;
}
export function useIntersectionObserver({
  hasMore,
  loadMore,
  bottomRef,
}: UseInfiniteScrollParams) {
  const observerRef = useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin: `0px 0px 250px 0px`,
      }
    )
  );
  useEffect(() => {
    if (!hasMore && bottomRef.current) {
      return observerRef.current.unobserve(bottomRef.current);
    }
    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }
    return () => {
      if (bottomRef.current) {
        observerRef.current.unobserve(bottomRef.current);
      }
    };
  }, [bottomRef, hasMore]);
}
