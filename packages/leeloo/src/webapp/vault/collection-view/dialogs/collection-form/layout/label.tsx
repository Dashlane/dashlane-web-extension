import { jsx } from '@dashlane/design-system';
export const Label = ({ ...props }) => (<label sx={{
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'ds.text.neutral.quiet',
        textTransform: 'uppercase',
    }} {...props}/>);
