import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CELL: {
    boxSizing: "border-box",
    color: "ds.text.neutral.quiet",
    display: "flex",
    paddingRight: "16px",
    textAlign: "left",
    variant: "text.ds.body.standard.regular",
    width: "460px",
  },
  BORDER: {
    borderBottom: "1px solid transparent",
    borderColor: "ds.border.neutral.quiet.idle",
  },
  SELECTED: {
    backgroundColor: "ds.container.expressive.neutral.supershy.active",
  },
  CELLS_WRAPPER: {
    flexGrow: 1,
    display: "inline-flex",
    alignItems: "center",
    height: "100%",
  },
  ROW: {
    display: "flex",
    flexShrink: 0,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: "60px",
    '&:hover button[name="hiddenAction"], &:focus-within button[name="hiddenAction"]':
      {
        opacity: 1,
      },
  },
};
