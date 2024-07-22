import { ThemeUIStyleObject } from "@dashlane/design-system";
const ELEMENT_HEIGHT = `35px`;
const DEFAULT_PADDING = "16px";
const FONT_FAMILY =
  "Public Sans, PublicSans-Regular, Public Sans Regular, Helvetica, Arial, sans-serif";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    position: "relative",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    width: "100%",
  },
  CURRENT_ELEMENT: {
    alignItems: "center",
    background: "none",
    border: "1px solid",
    borderRadius: "4px",
    borderColor: "ds.border.brand.standard.idle",
    display: "flex",
    fontFamily: FONT_FAMILY,
    fontSize: "16px",
    height: ELEMENT_HEIGHT,
    outline: "none",
    paddingLeft: DEFAULT_PADDING,
    paddingRight: DEFAULT_PADDING,
    width: "100%",
    zIndex: "1",
  },
  ARROW_ELEMENT: {
    paddingRight: "30px",
  },
  ERROR: {
    border: "1px solid",
    borderColor: "ds.border.warning.quiet.idle",
    color: "ds.text.warning.quiet",
    "&::placeholder": {
      color: "ds.text.warning.quiet",
    },
  },
  DROPDOWN: {
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    borderRadius: "4px",
    border: "1px solid",
    borderColor: "ds.border.neutral.quiet.idle",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    fontFamily: FONT_FAMILY,
    marginTop: "4px",
    overflowY: "auto",
    position: "absolute",
    top: ELEMENT_HEIGHT,
    outline: "none",
    width: "100%",
    zIndex: "10",
  },
  DROPDOWN_CONTROLS: {
    alignItems: "center",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    right: "0",
    top: "0",
    width: "30px",
  },
  DROPDOWN_ITEM: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: ELEMENT_HEIGHT,
    overflowX: "hidden",
    overflowY: "hidden",
    padding: DEFAULT_PADDING,
    textOverflow: "ellipsis",
    "&:hover": {
      backgroundColor: "ds.container.expressive.brand.quiet.hover",
    },
  },
  FOCUSED_ITEM: {
    backgroundColor: "ds.container.expressive.brand.quiet.hover",
  },
  EMPHASIZED_TEXT: {
    fontWeight: "600",
  },
  LABEL: {
    color: "ds.text.brand.standard",
    textTransform: "uppercase",
    height: "20px",
    fontSize: "10px",
    lineHeight: "20px",
    fontWeight: "600",
    marginBottom: "4px",
    display: "block",
  },
  ROOT: {
    width: "100%",
  },
  SPACE_CONTAINER: {
    paddingRight: "4px",
  },
  READONLY: {
    backgroundColor: "ds.container.expressive.brand.quiet.disabled",
  },
};
