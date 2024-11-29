import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  MAIN: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  ROW: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    background: "transparent",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "ds.container.expressive.neutral.quiet.hover",
    },
  },
  ROW_LABEL_CONTAINER: {
    display: "flex",
    alignItems: "center",
    "& > p": {
      marginLeft: "8px",
    },
  },
};
