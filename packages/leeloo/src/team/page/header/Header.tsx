import { ReactNode } from 'react';
import { jsx } from '@dashlane/design-system';
const SX_STYLE = {
    alignItems: 'center',
    backgroundColor: 'ds.background.alternate',
    borderBottom: '1px solid ds.border.neutral.quiet.idle',
    display: 'flex',
    height: '80px',
    justifyContent: 'flex-end',
    padding: '0 48px',
};
interface Props {
    children?: ReactNode;
}
export const Header = ({ children }: Props) => {
    return <header sx={SX_STYLE}>{children}</header>;
};
