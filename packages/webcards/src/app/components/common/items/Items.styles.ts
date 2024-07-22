import { ThemeUIStyleObject } from "@dashlane/design-system";
import { ACTIVE_OUTLINE_STYLES } from "../layout/CardLayout.styles";
export const MORE_BUTTON_CLASS = "moreButton";
const MORE_BUTTON_VISIBLE: Partial<ThemeUIStyleObject> = {
  display: "inline-flex",
  marginLeft: "auto",
};
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTENT: {
    overflow: "hidden",
    fontSize: "12px",
  },
  ICON_CONTAINER: {
    display: "flex",
    flexShrink: "0",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    borderRadius: "4px",
    width: "56px",
    height: "36px",
    margin: "0px 16px 0px 0px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
    borderWidth: "0px",
  },
  SIMPLE_ICON_BACKGROUND: {
    backgroundColor: "ds.container.agnostic.neutral.quiet",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "ds.border.neutral.quiet.idle",
  },
  ITEM: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    cursor: "pointer",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "ds.container.agnostic.neutral.quiet",
    },
    [`.${MORE_BUTTON_CLASS}`]: {
      display: "none",
      "&.active": {
        ...MORE_BUTTON_VISIBLE,
        ...ACTIVE_OUTLINE_STYLES,
      },
    },
    [`&.active .${MORE_BUTTON_CLASS}, &:hover .${MORE_BUTTON_CLASS}`]:
      MORE_BUTTON_VISIBLE,
  },
  TITLE: {
    color: "ds.text.neutral.catchy",
    display: "flex",
    alignItems: "center",
    textOverflow: "ellipsis",
    minHeight: "18px",
    lineHeight: "20px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Public Sans, PublicSans-Regular, Public Sans Regular",
    whiteSpace: "nowrap",
  },
  TITLE_BADGE_CONTAINER: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  SUBTITLE: {
    color: "ds.text.neutral.quiet",
    display: "flex",
    flexDirection: "row",
    height: "20px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontWeight: "400",
    fontStyle: "normal",
  },
  DIVIDER: {
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
    padding: "0",
    margin: "0 0",
  },
  ITEM_BUTTON: {
    backgroundColor: "ds.container.agnostic.neutral.quiet",
    color: "ds.text.neutral.standard",
    "&:hover": {
      backgroundColor: "ds.container.agnostic.neutral.standard",
    },
  },
  ICON: {
    marginLeft: "3px",
    paddingTop: "3px",
  },
  SPACE: {
    marginLeft: "8px",
    flexShrink: "0",
  },
  WITH_WARNING: {
    marginRight: "10px",
  },
};
