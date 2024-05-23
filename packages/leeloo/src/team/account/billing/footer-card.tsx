import { PropsWithChildren, ReactNode } from 'react';
import { jsx } from '@dashlane/design-system';
import { FlexContainer, mergeSx } from '@dashlane/ui-components';
import { SX_ACCOUNT_STYLES } from '../account.styles';
export const FooterCard = ({ children }: PropsWithChildren<ReactNode>) => {
    return (<FlexContainer flexDirection="column" sx={mergeSx([
            SX_ACCOUNT_STYLES.CARD_BORDER,
            {
                backgroundColor: 'ds.container.agnostic.neutral.supershy',
                padding: '24px',
                flex: '1',
                overflow: 'visible',
            },
        ])}>
      {children}
    </FlexContainer>);
};
