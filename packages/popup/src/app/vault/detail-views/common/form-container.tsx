import { ReactNode } from "react";
import { jsx } from "@dashlane/ui-components";
interface Props {
  children: ReactNode;
}
export const FormContainer = ({ children }: Props) => (
  <div
    sx={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      height: "433px",
      padding: "16px",
      backgroundColor: "white",
      overflowY: "auto",
      maxWidth: "100%",
      gap: "8px",
    }}
  >
    {children}
  </div>
);
