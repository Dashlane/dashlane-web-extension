import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  OUTER_CARD: {
    maxWidth: "850px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "80px",
    paddingBottom: "36px",
    marginTop: "18px",
  },
  INNER_CARD: {
    maxWidth: "480px",
    minHeight: "648px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};
