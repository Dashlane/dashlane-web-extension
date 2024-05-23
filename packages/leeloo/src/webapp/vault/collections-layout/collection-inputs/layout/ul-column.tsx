import { HTMLProps } from 'react';
import { jsx } from '@dashlane/design-system';
import { minimalisticScrollbarStyle } from 'webapp/vault/styles';
export const UlColumn = (props: HTMLProps<HTMLUListElement>) => (<ul sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'scroll',
        maxHeight: '25vh',
        padding: '8px',
        ...minimalisticScrollbarStyle,
    }} {...props}/>);
