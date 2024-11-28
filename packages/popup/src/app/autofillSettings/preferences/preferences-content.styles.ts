import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  MAIN_CONTAINER: {
    padding: "16px",
  },
  HEADER_CONTAINER: {
    lineHeight: "16px",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    borderBottom: "1px solid",
    borderBottomColor: "ds.border.neutral.quiet.idle",
    paddingBottom: "4px",
  },
  HEADER: {
    textTransform: "uppercase",
    fontWeight: "600",
    color: "ds.text.neutral.catchy",
  },
  SUBHEADER: {
    fontWeight: "400",
    color: "ds.text.neutral.standard",
  },
  TOGGLE_OPTION_CONTAINER: {
    marginTop: "20px",
  },
  TOGGLE_BY_SOURCETYPE_CONTAINER: {
    marginTop: "13px",
    paddingLeft: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },
};
