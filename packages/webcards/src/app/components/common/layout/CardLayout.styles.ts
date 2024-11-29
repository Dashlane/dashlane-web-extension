import { ThemeUIStyleObject } from "@dashlane/design-system";
export const ACTIVE_OUTLINE_STYLES: Record<
  string,
  Partial<ThemeUIStyleObject>
> = {
  "*.active": {
    outline: "5px auto",
    outlineColor: "ds.oddity.focus",
    outlineOffset: "-4px",
  },
};
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CARD_LAYOUT: {
    backgroundColor: "ds.background.alternate",
    margin: "0",
    overflow: "hidden",
    borderRadius: "8px",
    ...ACTIVE_OUTLINE_STYLES,
  },
  DIALOG_LAYOUT: {
    width: "380px",
  },
  DROPDOWN_LAYOUT: {
    maxWidth: "650px",
  },
  MAIN_WITH_PADDING: {
    padding: "0 8px 8px 8px",
  },
  MAIN_WITHOUT_PADDING: {
    padding: "0",
  },
};
