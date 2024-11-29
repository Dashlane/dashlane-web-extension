import { colors, ThemeUIStyleObject } from "@dashlane/ui-components";
export const actionCellSx: Partial<ThemeUIStyleObject> = {
  cursor: "pointer",
  margin: "0px 10px",
  padding: "5px",
  border: "1px solid transparent",
  "&:hover": {
    border: `1px solid ${colors.grey05}`,
  },
  borderRadius: "4px",
};
export const disableButtonSx: Partial<ThemeUIStyleObject> = {
  opacity: 0.6,
};
