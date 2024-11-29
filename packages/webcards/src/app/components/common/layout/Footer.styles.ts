import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  BORDER_TOP: {
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
  },
  DESCRIPTION: {
    marginRight: "4px",
  },
  DIVIDER: {
    padding: "0",
    margin: "0 16px",
  },
  EXTENSION_SHORTCUTS_WRAPPER: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px 8px 8px",
  },
  FOOTER: {
    padding: "0 8px 8px 8px",
  },
  WITH_DIVIDER: {
    paddingTop: "16px",
  },
  WITHOUT_FOOTER_PADDING: {
    margin: "0",
    padding: "0",
  },
  SHORTCUT_ITEM: {
    marginLeft: "4px",
  },
};
