import * as React from "react";
import {
  Icon,
  IconName,
  jsx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import { KEYBOARD_EVENTS } from "../../../../constants";
import styles from "./DropdownOption.module.scss";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  OPTION_CONTAINER: {
    display: "flex",
    alignItems: "center",
    color: "ds.text.neutral.quiet",
    cursor: "pointer",
    height: "48px",
    "&:hover": {
      backgroundColor: "ds.container.agnostic.neutral.quiet",
    },
  },
};
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
export const getOptionIconName = (
  optionType: OPTIONS_TYPE
): IconName | null => {
  switch (optionType) {
    case OPTIONS_TYPE.OPTION_NEVER_SUGGEST:
    case OPTIONS_TYPE.OPTION_CLOSE:
      return "MuteAutofillOutlined";
    case OPTIONS_TYPE.OPTION_SELF_CORRECT:
      return "ActionSearchOutlined";
    default:
      return null;
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
    <div>
      <div
        id={type}
        sx={SX_STYLES.OPTION_CONTAINER}
        role="button"
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
      >
        {iconName ? (
          <div className={styles.iconWrapper}>
            <Icon name={iconName} aria-hidden color={"ds.text.brand.quiet"} />
          </div>
        ) : null}
        <div className={styles.textWrapper}>{translate(translationKey)}</div>
      </div>
    </div>
  );
};
