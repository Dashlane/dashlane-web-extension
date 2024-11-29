import { ReactNode } from "react";
import { DSStyleObject } from "@dashlane/design-system";
const ENTRY_FONT_SIZE = "20px";
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  group: {
    margin: "0 32px",
    padding: "8px 0",
    borderTop: "1px solid ds.border.neutral.quiet.idle",
  },
  item: {
    alignItems: "center",
    display: "flex",
    height: "40px",
    outline: 0,
    a: {
      justifyContent: "space-between",
      display: "flex",
      variant: "text.ds.body.standard.regular",
    },
    button: {
      display: "flex",
      backgroundColor: "transparent",
      background: "inherit",
      border: "none",
      margin: "0",
      padding: "0",
      textAlign: "left",
      flexDirection: "row",
      lineHeight: "30px",
      alignItems: "center",
      justifyContent: "space-between",
    },
    "a, button": {
      width: "100%",
      color: "inherit",
      cursor: "pointer",
      textDecoration: "none",
      fontSize: ENTRY_FONT_SIZE,
    },
  },
};
interface PanelEntryProps {
  children: ReactNode;
}
export const PanelGroup = ({ children }: PanelEntryProps) => {
  return <ul sx={SX_STYLES.group}>{children}</ul>;
};
export const PanelItem = ({ children }: PanelEntryProps) => {
  return <li sx={SX_STYLES.item}>{children}</li>;
};
