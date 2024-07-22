import * as React from "react";
import classNames from "classnames";
import {
  Icon,
  jsx,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import { List } from "../../../common/generic/List";
import { getIconName } from "../../../common/icons/icons";
import {
  OtherCategory,
  SelfCorrectingAutofillCardItem,
  SelfCorrectingAutofillWebcardStep,
} from "./SelfCorrectingTree";
import styles from "./SelfCorrectingMenu.module.scss";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  ITEM: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "ds.container.agnostic.neutral.quiet",
      cursor: "pointer",
    },
    display: "flex",
    alignItems: "center",
  },
};
interface SelfCorrectingContentProps {
  selfCorrectingOptions?: SelfCorrectingAutofillCardItem[];
  selfCorrectingStep: SelfCorrectingAutofillWebcardStep;
  onClickSelfCorrectingCategory: (item: SelfCorrectingAutofillCardItem) => void;
  onClickSelfCorrectingOption: (item: SelfCorrectingAutofillCardItem) => void;
  isInputPasswordField: boolean;
}
export const SelfCorrectingContent = ({
  selfCorrectingOptions = [],
  selfCorrectingStep,
  onClickSelfCorrectingCategory,
  onClickSelfCorrectingOption,
  isInputPasswordField,
}: SelfCorrectingContentProps) => {
  const { translate } = React.useContext(I18nContext);
  const isItemDisabled = (item: SelfCorrectingAutofillCardItem) => {
    return (
      selfCorrectingStep === SelfCorrectingAutofillWebcardStep.Options &&
      !isInputPasswordField &&
      [
        "TR_SELFCORRECT_STEP2_PASSWORD_NEW",
        "TR_SELFCORRECT_STEP2_PASSWORD_CURRENT",
        "TR_SELFCORRECT_STEP2_PASSWORD_CONFIRM",
      ].includes(item.localizationKey)
    );
  };
  const getItemSx = (item: SelfCorrectingAutofillCardItem) => {
    if (isItemDisabled(item)) {
      return mergeSx([
        SX_STYLES.ITEM,
        {
          color: "ds.text.oddity.disabled",
          "&:hover": { cursor: "not-allowed" },
        },
      ]);
    }
    return SX_STYLES.ITEM;
  };
  return (
    <List
      pager={{
        displayDot: false,
        hasScroll: true,
      }}
      data={selfCorrectingOptions.map((item) => (
        <button
          type="button"
          key={item.itemType + item.localizationKey}
          className={classNames(styles.item, styles.withIcon)}
          sx={getItemSx(item)}
          onClick={() =>
            selfCorrectingStep === SelfCorrectingAutofillWebcardStep.Categories
              ? onClickSelfCorrectingCategory(item)
              : onClickSelfCorrectingOption(item)
          }
          disabled={isItemDisabled(item)}
          data-keyboard-accessible={translate(item.localizationKey)}
        >
          {(() => {
            if (
              selfCorrectingStep ===
              SelfCorrectingAutofillWebcardStep.Categories
            ) {
              const iconName =
                item.itemType === OtherCategory.Nothing
                  ? "MuteAutofillOutlined"
                  : getIconName(item.itemType);
              if (iconName) {
                return <Icon name={iconName} size="large" />;
              }
            }
            return null;
          })()}
          <div className={styles.text}>{translate(item.localizationKey)}</div>
        </button>
      ))}
    />
  );
};
