import { ReactNode } from "react";
import { Flex, Paragraph } from "@dashlane/design-system";
export interface TutorialStepTitleProps {
  title: string;
  icon: ReactNode;
}
export const TutorialStepTitle = ({ title, icon }: TutorialStepTitleProps) => {
  return (
    <Flex gap="8px" alignItems="center">
      {icon}
      <Paragraph textStyle="ds.title.section.medium" as="header">
        {title}
      </Paragraph>
    </Flex>
  );
};
