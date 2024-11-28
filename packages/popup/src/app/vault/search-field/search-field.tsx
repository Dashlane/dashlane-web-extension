import React, { useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { SearchField as DSSearchField, jsx } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import SearchEventLogger from "../search-event-logger";
import { useSearchContext } from "./search-context";
import listRowStyles from "../active-tab-list/lists/common/section-list-row/styles.css";
const I18N_KEYS = {
  SEARCH_PLACEHOLDER: "tab/all_items/search/placeholder",
};
interface Props {
  searchInputRef: React.RefObject<HTMLInputElement>;
}
export const SearchField = ({ searchInputRef }: Props) => {
  const { translate } = useTranslate();
  const { searchValue, setSearchValue } = useSearchContext();
  const hasSearchLogBeenSent = useRef(false);
  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
      hasSearchLogBeenSent.current = false;
    }, 200),
    []
  );
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      SearchEventLogger.logSearchEvent(false);
      setSearchValue("");
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
        searchInputRef.current.focus();
      }
      return;
    }
    debouncedSetSearchValue(event.target.value);
  };
  const focusFirstListItem = () => {
    const listItem = document.querySelector(
      `.${CSS.escape(listRowStyles.content)}`
    );
    if (listItem) {
      (listItem as HTMLElement).focus();
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirstListItem();
    }
  };
  const handleOnBlur = () => {
    if (searchValue && !hasSearchLogBeenSent.current) {
      SearchEventLogger.logSearchEvent(false);
      hasSearchLogBeenSent.current = true;
    }
  };
  const placeholder = translate(I18N_KEYS.SEARCH_PLACEHOLDER);
  return (
    <DSSearchField
      ref={searchInputRef}
      label={placeholder}
      placeholder={placeholder}
      onChange={onChangeHandler}
      onKeyDown={onKeyDown}
      autoFocus
      onBlur={handleOnBlur}
      hasClearAction
      sx={{
        margin: "8px",
      }}
    />
  );
};
