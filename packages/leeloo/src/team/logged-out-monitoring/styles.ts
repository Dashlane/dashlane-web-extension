import { DSStyleObject } from "@dashlane/design-system/jsx-runtime";
export const LOMO_STYLES: Record<string, Partial<DSStyleObject>> = {
  CARD: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    gap: "16px",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    borderColor: "ds.border.neutral.quiet.idle",
  },
  SUBCARD: {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    gap: "16px",
    backgroundColor: "ds.background.alternate",
    border: "none",
  },
  DISPLAY_FIELD_CONTAINER: {
    height: "100%",
    display: "flex",
    padding: "8px 16px",
    gap: "8px",
    backgroundColor: "ds.container.agnostic.neutral.quiet",
    border: "none",
  },
  DISPLAY_FIELD_WHITE: {
    height: "100%",
    display: "flex",
    padding: "2px 16px",
    gap: "8px",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    borderColor: "ds.border.neutral.quiet.idle",
  },
  VERTICAL_DIVIDER: {
    borderLeft: "1px solid ds.border.neutral.quiet.idle",
  },
};
