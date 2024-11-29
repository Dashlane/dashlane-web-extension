import { debounce } from "lodash";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import {
  Button,
  DSStyleObject,
  Icon,
  mergeSx,
  TextField,
} from "@dashlane/design-system";
import { useSearchContext } from "./search-context";
import useTranslate from "../../libs/i18n/useTranslate";
const DEBOUNCE_DELAY_MS = 100;
const I18N_KEYS = {
  SEARCH_PLACEHOLDER: "webapp_search_input_placeholder",
  SEARCH_CLEAR: "webapp_search_input_clear",
  SEARCH_CLOSE: "_common_toast_close_label",
};
const DELTA_WITH_DS_COMPONENT = 8;
const STYLES: Record<string, Partial<DSStyleObject>> = {
  REDUCE_HEIGHT: {
    "& > div": {
      minHeight: `${48 - DELTA_WITH_DS_COMPONENT}px`,
    },
    "& > div > div > div > label": {
      top: `${13 - DELTA_WITH_DS_COMPONENT / 2}px`,
    },
  },
  REMOVE_BORDER: {
    "& > div": { borderColor: "transparent !important" },
  },
  REMOVE_PADDING: {
    "& > div": {
      paddingLeft: 0,
    },
  },
};
export const SearchInput = () => {
  const { translate } = useTranslate();
  const { setSearchValue, closeSearch, searchValue } = useSearchContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedHandler = useCallback(
    debounce((value: string) => setSearchValue(value), DEBOUNCE_DELAY_MS),
    []
  );
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    debouncedHandler(e.target.value);
  const onClearHandler = () => {
    setSearchValue("");
  };
  const isClearable = searchValue.length > 0;
  useEffect(() => {
    if (searchValue.length) {
      inputRef.current?.select();
    }
  }, []);
  return (
    <div
      sx={{
        display: "grid",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        gridTemplateColumns: "40px 1fr auto",
        padding: "12px 16px 12px 20px",
      }}
    >
      <Icon
        name="ActionSearchOutlined"
        color="ds.text.neutral.standard"
        size="medium"
        sx={{
          padding: "10px",
          boxSizing: "content-box",
        }}
      />
      <TextField
        role="search"
        sx={mergeSx([
          STYLES.REDUCE_HEIGHT,
          STYLES.REMOVE_BORDER,
          STYLES.REMOVE_PADDING,
        ])}
        value={searchValue}
        onChange={onChangeHandler}
        labelPersists={false}
        label={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
        placeholder={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
        autoFocus={true}
        ref={inputRef}
      />
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isClearable ? (
          <Button
            mood="brand"
            intensity="supershy"
            icon="ActionCloseOutlined"
            onClick={onClearHandler}
          >
            {translate(I18N_KEYS.SEARCH_CLEAR)}
          </Button>
        ) : null}
        <Button
          layout="iconOnly"
          mood="neutral"
          intensity="supershy"
          icon="ActionCloseOutlined"
          onClick={closeSearch}
          aria-label={translate(I18N_KEYS.SEARCH_CLOSE)}
        />
      </div>
    </div>
  );
};
