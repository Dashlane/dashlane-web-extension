import { PropsWithChildren } from 'react';
import { jsx } from '@dashlane/design-system';
import { GridChild, GridContainer } from '@dashlane/ui-components';
type BlockQuoteProps = PropsWithChildren<Record<string, unknown>>;
export const BlockQuote = ({ children }: BlockQuoteProps) => {
    return (<GridContainer gridTemplateAreas="'leftBar content'" gridTemplateColumns="4px auto" gap="8px">
      <GridChild as="div" gridArea="leftBar" sx={{
            backgroundColor: 'ds.oddity.brand',
            height: '100%',
            width: '4px',
            borderRadius: '8px',
            marginRight: '10px',
        }}/>
      <GridChild gridArea="content">{children}</GridChild>
    </GridContainer>);
};
