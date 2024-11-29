import * as React from "react";
import {
  List as DSList,
  Flex,
  Infobox,
  jsx,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { useTranslate } from "../../../context/i18n";
interface Props {
  data: JSX.Element[];
  pager: {
    displayDot: boolean;
    hasScroll: boolean;
  };
  withSearchForMoreInfo?: boolean;
}
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  DOT: {
    width: "8px",
    height: "8px",
    borderRadius: "8px",
    border: "1px solid ds.border.neutral.standard.active",
    cursor: "pointer",
    backgroundColor: "ds.border.neutral.quiet.idle",
  },
  ACTIVE_DOT: {
    backgroundColor: "ds.border.neutral.standard.active",
    cursor: "default",
  },
};
export const List = ({
  data,
  pager: { displayDot, hasScroll },
  withSearchForMoreInfo,
}: Props) => {
  const { translate } = useTranslate();
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
    <DSList sx={hasScroll ? { maxHeight: "250px", overflowY: "auto" } : {}}>
      {itemsOnPage}
      {displayDot && numberOfPages > 1 && (
        <Flex
          justifyContent="center"
          alignItems="center"
          gap="4px"
          sx={{ padding: "12px" }}
        >
          {arrayWithPageNumbers.map((pageNumber: number) => {
            return (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                aria-label={`page-number-${pageNumber}`}
                sx={mergeSx([
                  SX_STYLES.DOT,
                  pageNumber === currentPage ? SX_STYLES.ACTIVE_DOT : {},
                ])}
              />
            );
          })}
        </Flex>
      )}
      {withSearchForMoreInfo ? (
        <Infobox
          title={translate("useSearchForMoreResults")}
          mood="brand"
          sx={{ mt: "8px" }}
        />
      ) : null}
    </DSList>
  );
};
