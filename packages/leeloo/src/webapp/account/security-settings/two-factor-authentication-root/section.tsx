import { colors, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import React, { PropsWithChildren } from 'react';
const { grey05 } = colors;
interface Props {
    title?: React.ReactNode;
    description?: React.ReactNode;
}
export const Section = ({ title, children, description, }: PropsWithChildren<Props>) => {
    return (<FlexContainer sx={{ p: '32px', pt: '0' }} flexDirection="column">
      <hr sx={{
            border: 'none',
            borderTop: `1px solid ${grey05}`,
            margin: 0,
            width: '100%',
        }}/>
      {title ? (<FlexContainer as="header" flexDirection="column" flexWrap="nowrap" fullWidth justifyContent="space-between" sx={{ marginTop: '16px' }}>
          <Heading size="x-small" as="h2">
            {title}
          </Heading>
          {description ? (<Paragraph size="x-small" sx={{ paddingTop: '14px', color: colors.grey00 }}>
              {description}
            </Paragraph>) : null}
        </FlexContainer>) : null}
      {children}
    </FlexContainer>);
};
