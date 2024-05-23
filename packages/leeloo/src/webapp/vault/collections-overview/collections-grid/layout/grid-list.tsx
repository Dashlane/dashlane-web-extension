import { HTMLProps } from 'react';
import { jsx } from '@dashlane/design-system';
export const GridList = (props: HTMLProps<HTMLUListElement>) => (<ul sx={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
        gap: '16px',
        padding: '32px',
        overflow: 'auto',
    }} {...props}/>);
