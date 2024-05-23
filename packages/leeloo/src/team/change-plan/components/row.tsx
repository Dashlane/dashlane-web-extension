import * as React from 'react';
import { FlexChild, FlexContainer, jsx } from '@dashlane/ui-components';
interface RowProps {
    label?: React.ReactNode;
    value?: React.ReactNode;
}
export const Row = ({ label, value }: RowProps) => (<FlexContainer justifyContent="flex-end" sx={{ display: 'flex', justifyContent: 'flexEnd', padding: '0 10px' }}>
    {label ? (<FlexChild flex="1" sx={{ display: 'flex', alignItems: 'center' }}>
        {label}
      </FlexChild>) : null}
    {value ? (<FlexChild sx={{ display: 'flex', alignItems: 'center' }}>
        {value}
      </FlexChild>) : null}
  </FlexContainer>);
