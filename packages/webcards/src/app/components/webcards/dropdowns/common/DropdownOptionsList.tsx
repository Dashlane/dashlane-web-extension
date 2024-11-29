import * as React from "react";
import { Card, Flex, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
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
      <Card sx={{ marginX: "8px", padding: "8px", gap: 0 }}>
        <DropdownOption
          onClick={onCloseOption}
          type={OPTIONS_TYPE.OPTION_CLOSE}
        />

        <DropdownOption
          onClick={onNeverSuggestOption}
          type={OPTIONS_TYPE.OPTION_NEVER_SUGGEST}
        />
      </Card>

      {showSelfCorrectingOption ? (
        <Flex justifyContent="center" sx={{ paddingY: "8px" }}>
          <DropdownOption
            onClick={onSelfCorrectOption}
            type={OPTIONS_TYPE.OPTION_SELF_CORRECT}
          />
        </Flex>
      ) : null}
    </div>
  );
};
