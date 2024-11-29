import { HTMLProps, ReactNode, useEffect, useRef } from "react";
const UlColumn = (props: HTMLProps<HTMLUListElement>) => (
  <ul
    {...props}
    sx={{
      height: "100%",
      display: "flex",
      flex: "1",
      flexDirection: "column",
      overflow: "auto",
      paddingBottom: "20px",
    }}
  />
);
interface InfiniteScrollListProps {
  className?: string;
  onNextPage: (nextPageNumber: number) => void;
  children: ReactNode;
  hasMore: boolean;
  ListComponent?: React.ComponentType<HTMLProps<HTMLUListElement>>;
}
export const InfiniteScrollList = ({
  onNextPage,
  children,
  hasMore,
  ListComponent = UlColumn,
  ...props
}: InfiniteScrollListProps) => {
  const pageNumberRef = useRef(1);
  const bottomObserverTargetRef = useRef<HTMLLIElement>(null);
  const observerRef = useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onNextPage(++pageNumberRef.current);
        }
      },
      {
        rootMargin: "0px 0px 500px 0px",
      }
    )
  );
  useEffect(() => {
    if (!hasMore && bottomObserverTargetRef.current) {
      return observerRef.current.unobserve(bottomObserverTargetRef.current);
    }
    if (bottomObserverTargetRef.current) {
      observerRef.current.observe(bottomObserverTargetRef.current);
    }
    return () => {
      if (bottomObserverTargetRef.current) {
        observerRef.current.unobserve(bottomObserverTargetRef.current);
      }
    };
  }, [bottomObserverTargetRef, hasMore]);
  return (
    <ListComponent {...props}>
      {children}
      <li aria-hidden ref={bottomObserverTargetRef} />
    </ListComponent>
  );
};
