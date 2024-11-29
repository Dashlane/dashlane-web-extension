import { PropsWithChildren } from "react";
import { ThemeUIStyleObject } from "@dashlane/design-system";
export const containerStyle: ThemeUIStyleObject = {
  backgroundColor: "ds.container.agnostic.neutral.supershy",
  padding: "32px",
  border: `1px solid ds.border.brand.quiet.idle`,
  borderRadius: 2,
  marginTop: "16px",
};
export const TutorialStepWrapper = ({
  children,
}: PropsWithChildren<unknown>) => {
  return <div sx={containerStyle}>{children}</div>;
};
