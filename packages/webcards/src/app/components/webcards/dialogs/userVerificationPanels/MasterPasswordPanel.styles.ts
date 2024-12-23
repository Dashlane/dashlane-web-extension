import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  PIN_PANEL_CONTAINER: { padding: "8px 0" },
  LOGGED_IN_INFO: {
    color: "ds.text.neutral.quiet",
    paddingTop: "8px",
    display: "flex",
    alignItems: "center",
  },
  LOGGED_IN_INFO_TEXT: {
    paddingRight: "4px",
    "& > span": {
      color: "ds.text.brand.quiet",
    },
  },
};
