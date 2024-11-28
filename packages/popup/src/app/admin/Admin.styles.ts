import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  WRAPPER: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 16px)",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    padding: "8px",
    gap: "8px",
    overflow: "scroll",
  },
};
