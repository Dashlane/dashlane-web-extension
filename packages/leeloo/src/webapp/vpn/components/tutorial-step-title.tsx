import { FlexContainer, Heading, jsx } from '@dashlane/ui-components';
import { ReactNode } from 'react';
export interface TutorialStepTitleProps {
    title: string;
    icon: ReactNode;
}
export const TutorialStepTitle = ({ title, icon }: TutorialStepTitleProps) => {
    return (<FlexContainer gap="8px" alignItems="center">
      {icon}
      <Heading size="x-small">{title}</Heading>
    </FlexContainer>);
};
