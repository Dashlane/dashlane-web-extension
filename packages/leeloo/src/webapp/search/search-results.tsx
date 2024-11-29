import { DSStyleObject, mergeSx } from "@dashlane/design-system";
import { SearchResultsSection } from "./results/shared/search-results-section";
import { useSearchContext } from "./search-context";
import { useItemSearchRankedData } from "../sidemenu/search/results/use-item-search-data";
const SEARCH_INPUT_HEIGHT = "64px";
const STYLES: Record<string, Partial<DSStyleObject>> = {
  BASE: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "0 12px",
    overflow: "auto",
    a: {
      textDecoration: "none",
    },
  },
  SECTIONS: {
    "&:has(> section)": {
      paddingTop: "12px",
      paddingBottom: "12px",
      borderTop: "1px solid ds.border.neutral.quiet.idle",
    },
  },
};
export const SearchResults = () => {
  const { searchValue: query } = useSearchContext();
  const search = useItemSearchRankedData(query);
  if (!query.length) {
    return null;
  }
  return (
    <div
      sx={mergeSx([
        STYLES.BASE,
        STYLES.SECTIONS,
        {
          maxHeight: `calc(90vh - ${SEARCH_INPUT_HEIGHT})`,
        },
      ])}
    >
      <SearchResultsSection search={search} query={query} />
    </div>
  );
};
