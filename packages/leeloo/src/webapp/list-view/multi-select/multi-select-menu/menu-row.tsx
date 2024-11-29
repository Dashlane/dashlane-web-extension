import { ReactNode } from "react";
import { defaultTheme } from "@dashlane/design-system";
interface MenuRowProps {
  visible: boolean;
  children: ReactNode;
}
export const MenuRow = ({ visible, children }: MenuRowProps) => (
  <div
    sx={{
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "50",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "10px 16px",
      margin: "8px 24px",
      borderRadius: "8px",
      backgroundColor: "inherit",
      backgroundImage: `linear-gradient(${defaultTheme.colors.ds.container.expressive.neutral.quiet.idle} 100%, white)`,
      visibility: visible ? "visible" : "hidden",
      transform: visible ? "scale3d(1,1,1)" : "scale3d(1,0,1)",
      transformOrigin: "top",
      transition: "all 250ms",
    }}
  >
    {children}
  </div>
);
