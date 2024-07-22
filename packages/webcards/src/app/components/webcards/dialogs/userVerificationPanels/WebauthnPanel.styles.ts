import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    display: "flex",
    flexDirection: "column",
    padding: "0 16px",
    gap: "12px",
  },
  ICON_CONTAINER: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 0",
  },
  ICON: {
    width: "96px",
    height: "96px",
  },
  ERROR_LABEL: {
    color: "ds.text.danger.standard",
  },
};
