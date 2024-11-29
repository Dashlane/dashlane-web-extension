import * as React from "react";
import { Flex, Icon, jsx, ListItem, Paragraph } from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import { List } from "../../../common/generic/List";
import { getIconName } from "../../../common/icons/icons";
import {
  OtherCategory,
  SelfCorrectingAutofillCardItem,
  SelfCorrectingAutofillWebcardStep,
} from "./SelfCorrectingTree";
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
  return (
    <List
      pager={{
        displayDot: false,
        hasScroll: true,
      }}
      data={selfCorrectingOptions.map((item) => (
        <ListItem
          key={item.itemType + item.localizationKey}
          onClick={
            isItemDisabled(item)
              ? undefined
              : () =>
                  selfCorrectingStep ===
                  SelfCorrectingAutofillWebcardStep.Categories
                    ? onClickSelfCorrectingCategory(item)
                    : onClickSelfCorrectingOption(item)
          }
          sx={
            isItemDisabled(item)
              ? {
                  color: "ds.text.oddity.disabled",
                  "&:hover": { cursor: "not-allowed" },
                }
              : {}
          }
          aria-label={translate(item.localizationKey)}
        >
          <Flex
            alignItems="center"
            gap="8px"
            flexWrap="unset"
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
                  return (
                    <Icon
                      name={iconName}
                      size="large"
                      color="ds.text.neutral.standard"
                    />
                  );
                }
              }
              return null;
            })()}
            <Paragraph
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {translate(item.localizationKey)}
            </Paragraph>
          </Flex>
        </ListItem>
      ))}
    />
  );
};
