import React, { ReactNodeArray } from "react";
import { LoadMore } from "../load-more";
import { Header } from "./header";
interface PartialHeaderProps {
  i18nKey: string;
  children: ReactNodeArray;
  loadMore: () => void;
  matchCount: number;
  loadedCount: number;
}
export const SearchResultsSection = ({
  i18nKey,
  children,
  loadMore,
  matchCount,
  loadedCount,
}: PartialHeaderProps) => {
  return (
    <section>
      <Header i18nKey={i18nKey} />
      {children}
      <LoadMore loadMore={loadMore} remaining={matchCount - loadedCount} />
    </section>
  );
};
