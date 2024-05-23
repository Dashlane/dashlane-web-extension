import { HTMLProps } from 'react';
import { jsx } from '@dashlane/design-system';
import { keyframes } from '@dashlane/ui-components';
const easeDown = keyframes({
    from: {
        transform: 'scale3d(1, 0, 1)',
    },
    to: {
        transform: 'scale3d(1, 1, 1)',
    },
});
export const Dropdown = (props: HTMLProps<HTMLSpanElement>) => (<span sx={{
        position: 'absolute',
        top: 'calc(100% - 4px)',
        zIndex: 7,
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0px 4px 8px rgb(0 0 0 / 25%)',
        border: '1px solid',
        borderColor: 'ds.border.neutral.quiet.idle',
        transformOrigin: '0 0',
        animation: `${easeDown} 150ms`,
    }} {...props}/>);
