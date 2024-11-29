import * as React from "react";
import { Button, IconName, jsx } from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import { KEYBOARD_EVENTS } from "../../../../constants";
export enum OPTIONS_TYPE {
  OPTION_CLOSE = "OPTION_CLOSE",
  OPTION_NEVER_SUGGEST = "OPTION_NEVER_SUGGEST",
  OPTION_SELF_CORRECT = "OPTION_SELF_CORRECT",
}
export const getTranslationKey = (type: string) => {
  switch (type) {
    case OPTIONS_TYPE.OPTION_CLOSE:
      return "optionsClose";
    case OPTIONS_TYPE.OPTION_NEVER_SUGGEST:
      return "optionsNeverSuggest";
    case OPTIONS_TYPE.OPTION_SELF_CORRECT:
      return "optionsFillSomethingElse";
    default:
      return "";
  }
};
const getOptionIconName = (optionType: OPTIONS_TYPE): IconName | undefined => {
  switch (optionType) {
    case OPTIONS_TYPE.OPTION_NEVER_SUGGEST:
    case OPTIONS_TYPE.OPTION_CLOSE:
      return "MuteAutofillOutlined";
    case OPTIONS_TYPE.OPTION_SELF_CORRECT:
      return "ActionSearchOutlined";
    default:
      return undefined;
  }
};
interface Props {
  onClick: () => void;
  type: OPTIONS_TYPE;
}
export const DropdownOption = ({ onClick, type }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const iconName = getOptionIconName(type);
  const translationKey = getTranslationKey(type);
  return (
    <Button
      id={type}
      onClick={onClick}
      onKeyUp={(e) => {
        if (
          e.key !== KEYBOARD_EVENTS.ENTER &&
          e.key !== KEYBOARD_EVENTS.SPACE
        ) {
          return;
        }
        onClick();
      }}
      tabIndex={0}
      data-keyboard-accessible={translate(translationKey)}
      layout={iconName ? "iconLeading" : "labelOnly"}
      mood="neutral"
      intensity="supershy"
      icon={iconName}
    >
      {translate(translationKey)}
    </Button>
  );
};
