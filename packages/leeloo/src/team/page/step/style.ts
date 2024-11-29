import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    position: "relative",
    paddingLeft: "34px",
    borderLeft: "1px dashed ds.border.brand.standard.idle",
    paddingBottom: "16px",
    paddingRight: "24px",
    marginTop: "15px",
    flexBasis: "33%",
  },
  IMG: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: "translate(-50%, -30%)",
  },
};
