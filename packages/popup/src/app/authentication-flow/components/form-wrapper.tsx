import * as React from 'react';
import { jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
interface Props {
    children: React.ReactNode;
}
export const FormWrapper = ({ children }: Props) => (<FlexContainer flexDirection="column" sx={{
        flexGrow: '1',
    }}>
    {children}
  </FlexContainer>);
