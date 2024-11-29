import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTENT_CONTAINER: {
    paddingX: "8px",
  },
  NEVER_ASK_AGAIN_CONTAINER: {
    display: "inline-grid",
    gap: "12px",
    margin: "12px 0px",
  },
  BUTTONS_CONTAINER: {
    display: "flex",
    justifyContent: "space-between",
  },
  BUTTONS_GROUP: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  BUTTONS_RIGHT: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};
