import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  MAIN: {
    display: "flex",
    flexDirection: "column",
    padding: "0 16px",
    gap: "8px",
  },
  ROW: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    background: "transparent",
    padding: "12px",
    cursor: "pointer",
  },
  ROW_LABEL_CONTAINER: {
    display: "flex",
    alignItems: "center",
    "& > p": {
      marginLeft: "8px",
    },
  },
};
