import { DSStyleObject } from "@dashlane/design-system";
const MIN_HEIGHT = "360px";
export const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  STATE_WRAPPER: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    width: "100%",
    height: MIN_HEIGHT,
    padding: "24px",
    textAlign: "center",
  },
  TABLE_BODY: {
    minHeight: MIN_HEIGHT,
    tr: {
      boxShadow: "inset 0 -1px 0 0 ds.border.neutral.quiet.idle",
      height: "60px",
      transition: "background-color 0.2s ease",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "ds.container.expressive.neutral.supershy.hover",
      },
      td: {
        padding: "16px",
        verticalAlign: "middle",
        variant: "text.ds.body.reduced.regular",
        color: "ds.text.neutral.standard",
      },
    },
  },
  INPUT_WITH_CLEAR_ACTION: {
    display: "grid",
    gridTemplateColumns: "calc(100% - 40px) auto",
    alignItems: "center",
    gap: "4px",
  },
};
