import { useCallback, useRef, useState } from "react";
import { debounce } from "lodash";
import { Icon, TextInput } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useCollectionsOverviewUpdateContext } from "../collections-overview-context";
import { SearchCloseIcon } from "./search-close-icon";
export const CollectionsSearch = () => {
  const { translate } = useTranslate();
  const { setSearchValue } = useCollectionsOverviewUpdateContext();
  const [displayClearIcon, setDisplayClearIcon] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
      setDisplayClearIcon(!!value);
    }, 200),
    []
  );
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchValue(event.target.value);
  };
  const onSearchFieldClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      searchInputRef.current.focus();
    }
    setSearchValue("");
    setDisplayClearIcon(false);
  };
  const placeholder = translate(
    "collections_overview_search_input_placeholder"
  );
  return (
    <TextInput
      ref={searchInputRef}
      placeholder={placeholder}
      aria-label={placeholder}
      prefixIcon={<Icon name="ActionSearchOutlined" size="medium" />}
      onChange={onChangeHandler}
      actionButtons={[
        <SearchCloseIcon
          key="clear-collections-search"
          onClick={onSearchFieldClear}
          isHidden={!displayClearIcon}
        />,
      ]}
      autoFocus
      intensity="quiet"
      sx={{
        maxWidth: "300px",
        margin: "16px 0",
      }}
    />
  );
};
