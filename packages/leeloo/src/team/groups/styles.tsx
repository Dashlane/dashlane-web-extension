import { ThemeUIStyleObject } from "@dashlane/ui-components";
const ROOT_GROUP_STYLES_PARTS = ["CARD_CONTAINER", "HEADER"] as const;
type RootGroupStyles = {
  [key in (typeof ROOT_GROUP_STYLES_PARTS)[number]]: Partial<ThemeUIStyleObject>;
};
export const ROOT_GROUP_STYLES: RootGroupStyles = {
  HEADER: {
    display: "inline-block",
    width: "100%",
    verticalAlign: "top",
  },
  CARD_CONTAINER: {
    display: "flex",
    gap: "16px",
    flexDirection: "column",
    padding: "32px",
    borderRadius: "8px",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    border: "1px solid ds.border.neutral.quiet.idle",
  },
};
