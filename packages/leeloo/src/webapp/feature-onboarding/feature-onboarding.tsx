import { ReactNode } from "react";
import { Flex, Heading, ThemeUIStyleObject } from "@dashlane/design-system";
import { ZIndex } from "../../libs/dashlane-style/globals/z-index";
export interface FeatureOnboardingProps {
  contentTitle: string;
  contentSubtitle: string;
  children: ReactNode;
  actions: ReactNode;
}
const overlay: ThemeUIStyleObject = {
  position: "absolute",
  zIndex: ZIndex.MODAL,
  top: "0px",
  overflow: "auto",
  width: "100%",
  height: "100%",
  backgroundColor: "ds.container.agnostic.neutral.standard",
};
const contentStyle: ThemeUIStyleObject = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: "4px",
  background: "ds.container.agnostic.neutral.supershy",
  padding: "88px",
  width: "784px",
};
export const FeatureOnboarding = ({
  contentTitle,
  contentSubtitle,
  children,
  actions,
}: FeatureOnboardingProps) => {
  return (
    <Flex sx={overlay} justifyContent="center" alignItems="center">
      <div sx={{ display: "flex", justifyContent: "center", margin: "32px" }}>
        <div
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: " 0 10% 0 10%",
          }}
        >
          <div sx={contentStyle}>
            <Heading as="h2">{contentTitle}</Heading>
            <div
              sx={{
                color: "ds.text.neutral.quiet",
                marginTop: "8px",
              }}
            >
              {contentSubtitle}
            </div>
            {children}
            {actions}
          </div>
        </div>
      </div>
    </Flex>
  );
};
