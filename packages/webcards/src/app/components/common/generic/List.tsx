import * as React from "react";
import styles from "./List.module.scss";
import classNames from "classnames";
interface Props {
  data: JSX.Element[];
  pager: {
    displayDot: boolean;
    hasScroll: boolean;
  };
}
export const List = ({ data, pager: { displayDot, hasScroll } }: Props) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemPerPage = 5;
  const webcards = data || [];
  const numberOfPages = Math.ceil(webcards.length / itemPerPage);
  const itemsOnPage = displayDot
    ? webcards.slice(
        currentPage * itemPerPage,
        currentPage * itemPerPage + itemPerPage
      )
    : webcards;
  const arrayWithPageNumbers = Array.from(Array(numberOfPages)).map(
    (_, key) => key
  );
  return (
    <div
      className={classNames({
        [styles.list]: true,
        [styles.withScroll]: hasScroll,
      })}
    >
      <div>{itemsOnPage}</div>
      {displayDot && numberOfPages > 1 && (
        <div className={styles.pager}>
          {arrayWithPageNumbers.map((pageNumber: number) => {
            return (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={classNames(styles.pageDot, {
                  [styles.selected]: pageNumber === currentPage,
                })}
                aria-label={`page-number-${pageNumber}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
