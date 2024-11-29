import { PropsWithChildren } from "react";
import { Logo } from "@dashlane/design-system";
interface Props {
  backgroundColor?: string;
}
export const BasePanelContainer = ({
  children,
  backgroundColor = "ds.background.alternate",
}: PropsWithChildren<Props>) => {
  return (
    <div
      role="complementary"
      sx={{
        backgroundColor,
        minHeight: "100%",
        width: "100%",
      }}
    >
      <div
        sx={{
          position: "sticky",
          paddingLeft: "80px",
          top: "50px",
        }}
      >
        <Logo height={40} name="DashlaneLockup" />
      </div>
      {children}
    </div>
  );
};
