import * as React from "react";
import { Button, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import styles from "./SearchResultsHeader.module.scss";
const I18N_KEYS = {
  ALL_ITEMS_BUTTON: "allItemsButton",
  ITEMS_COUNT_LABEL: "itemsCountLabel",
  SUGGESTED_BUTTON: "suggestedButton",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  HEADER: {
    padding: "8px 16px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    color: "ds.text.neutral.quiet",
    fontSize: "12px",
    fontWeight: "500",
    lineHeight: "16px",
    width: "100%",
    backgroundColor: "ds.container.agnostic.neutral.standard",
  },
  BUTTON_SELECTED: {
    backgroundColor: "ds.container.expressive.brand.catchy.idle",
  },
  BUTTON_NOT_SELECTED: {
    backgroundColor: "transparent",
    color: "ds.text.neutral.quiet",
  },
};
interface Props {
  itemsCount: number;
  onClickAllItemsButton?: () => void;
  onClickSuggestedButton?: () => void;
  allItemsButtonSelected?: boolean;
}
export const SearchResultsHeader = ({
  itemsCount,
  onClickAllItemsButton,
  onClickSuggestedButton,
  allItemsButtonSelected = false,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  return (
    <div sx={SX_STYLES.HEADER}>
      <div className={styles.buttonsContainer}>
        {onClickSuggestedButton ? (
          <Button
            size="small"
            id="dropdownSuggestedItemsButton"
            type="button"
            sx={
              allItemsButtonSelected
                ? SX_STYLES.BUTTON_NOT_SELECTED
                : SX_STYLES.BUTTON_SELECTED
            }
            onClick={onClickSuggestedButton}
            aria-label={translate(I18N_KEYS.SUGGESTED_BUTTON)}
            data-keyboard-accessible={translate(I18N_KEYS.SUGGESTED_BUTTON)}
          >
            {translate(I18N_KEYS.SUGGESTED_BUTTON)}
          </Button>
        ) : null}
        {onClickAllItemsButton ? (
          <Button
            id="dropdownAllItemsButton"
            type="button"
            size="small"
            sx={
              allItemsButtonSelected
                ? SX_STYLES.BUTTON_SELECTED
                : SX_STYLES.BUTTON_NOT_SELECTED
            }
            onClick={onClickAllItemsButton}
            aria-label={translate(I18N_KEYS.ALL_ITEMS_BUTTON)}
            data-keyboard-accessible={translate(I18N_KEYS.ALL_ITEMS_BUTTON)}
          >
            {translate(I18N_KEYS.ALL_ITEMS_BUTTON)}
          </Button>
        ) : null}
      </div>
      <span>
        {itemsCount !== 0
          ? translate(I18N_KEYS.ITEMS_COUNT_LABEL, {
              count: itemsCount,
            })
          : ""}
      </span>
    </div>
  );
};
