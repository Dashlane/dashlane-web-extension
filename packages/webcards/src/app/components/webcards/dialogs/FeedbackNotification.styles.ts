import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  H1: {
    color: "ds.text.neutral.catchy",
    fontSize: "16px",
    lineHeight: "125%",
    display: "inline",
    fontFamily: "GTWalsheimPro, GT Walsheim Pro, Helvetica, Arial, sans-serif",
  },
  DOMAIN: {
    fontSize: "10px",
    textTransform: "uppercase",
    color: "ds.text.brand.standard",
    letterSpacing: "0.2px",
    lineHeight: "100%",
    fontWeight: "500",
    marginBottom: "5px",
  },
  EDIT: {
    color: "ds.text.brand.standard",
    backgroundColor: "white",
    textDecoration: "underline",
    "&:hover": {
      color: "ds.text.brand.standard.hover",
      cursor: "pointer",
    },
  },
  FEEDBACK_CONTAINER: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
  },
};
