import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { ReactNode } from 'react';
import { FlexContainer } from '@dashlane/ui-components';
export interface ListItemContentProps {
    icon: ReactNode;
    title: string;
    explanation?: string;
}
export const ListItemContent = ({ title, explanation, icon, }: ListItemContentProps) => (<FlexContainer as="article" flexDirection="row" alignItems="center" gap="16px" flexWrap="nowrap">
    <span>{icon}</span>
    <FlexContainer gap="2px" as="header" flexDirection="column">
      <Heading color="ds.text.neutral.catchy" as="h2" textStyle="ds.title.block.small">
        {title}
      </Heading>
      {explanation ? (<Paragraph color={'ds.text.neutral.quiet'} textStyle="ds.body.standard.regular">
          {explanation}
        </Paragraph>) : null}
    </FlexContainer>
  </FlexContainer>);
