import { PropsWithChildren } from 'react';
import { Heading, jsx } from '@dashlane/ui-components';
export const SimpleDialogHeader = ({ children, }: PropsWithChildren<Record<never, never>>) => {
    return (<Heading id="dialogTitle" size="small" sx={{
            paddingRight: '24px',
            marginBottom: '16px',
        }}>
      {children}
    </Heading>);
};
