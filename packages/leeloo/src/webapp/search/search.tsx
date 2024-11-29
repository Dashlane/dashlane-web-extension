import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";
export const Search = () => {
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <SearchInput />
      <SearchResults />
    </div>
  );
};
