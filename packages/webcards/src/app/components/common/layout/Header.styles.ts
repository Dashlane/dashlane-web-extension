import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  HEADER: {
    display: "flex",
    backgroundColor: "ds.container.agnostic.neutral.standard",
    alignItems: "center",
    justifyContent: "center",
  },
  DIALOG: {
    minHeight: "64px",
  },
  DIALOG_ACTION: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "ds.container.expressive.neutral.quiet.hover",
    },
    cursor: "pointer",
    flexShrink: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "center",
    marginRight: "16px",
    width: "32px",
    height: "32px",
    borderRadius: "2px",
    marginTop: "20px",
  },
  DIALOG_CONTENT: {
    flex: "1",
    padding: "16px",
  },
  DIALOG_LOGO: {
    flexShrink: "0",
    display: "block",
    width: "28px",
    height: "28px",
    marginLeft: "20px",
  },
  DROPDOWN: {
    minHeight: "36px",
  },
  DROPDOWN_ACTION: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "ds.container.expressive.neutral.quiet.hover",
      svg: {
        fill: "ds.text.neutral.standard",
      },
    },
    width: "36px",
    height: "36px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  DROPDOWN_LOGO: {
    flexShrink: "0",
    display: "block",
    width: "15px",
    height: "15px",
    marginLeft: "16px",
  },
  DROPDOWN_CONTENT: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    overflowX: "hidden",
    padding: "16px",
  },
};
