import * as React from "react";
import { jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { DropdownOption, OPTIONS_TYPE } from "./DropdownOption";
import styles from "./DropdownOptionsList.module.scss";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  DIVIDER: {
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
    padding: "0",
    margin: "0 0",
  },
};
interface Props {
  onCloseOption: () => void;
  onNeverSuggestOption: () => void;
  onSelfCorrectOption: () => void;
  showSelfCorrectingOption?: boolean;
}
export const DropdownOptionsList = ({
  onCloseOption,
  onNeverSuggestOption,
  onSelfCorrectOption,
  showSelfCorrectingOption = true,
}: Props) => {
  return (
    <div className={styles.dropdownOptionsList}>
      <DropdownOption
        onClick={onCloseOption}
        type={OPTIONS_TYPE.OPTION_CLOSE}
      />

      <hr sx={SX_STYLES.DIVIDER} />

      <DropdownOption
        onClick={onNeverSuggestOption}
        type={OPTIONS_TYPE.OPTION_NEVER_SUGGEST}
      />

      {showSelfCorrectingOption ? (
        <React.Fragment>
          <hr sx={SX_STYLES.DIVIDER} />
          <DropdownOption
            onClick={onSelfCorrectOption}
            type={OPTIONS_TYPE.OPTION_SELF_CORRECT}
          />
        </React.Fragment>
      ) : null}
    </div>
  );
};
