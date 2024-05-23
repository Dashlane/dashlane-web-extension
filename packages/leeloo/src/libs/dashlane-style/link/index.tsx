import React from 'react';
import { colors, Link as DashlaneLink, jsx } from '@dashlane/ui-components';
type HTMLAttributeReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    disabled?: boolean;
    referrerPolicy?: HTMLAttributeReferrerPolicy;
}
const { midGreen00, dashGreen00, dashDarkerGreen00 } = colors;
const defaultStyles = {
    color: midGreen00,
    activeColor: dashDarkerGreen00,
    hoverColor: dashGreen00,
};
const Link = ({ children, ...props }: Props) => {
    const relAttribute = props.target === '_blank' ? { rel: 'noopener noreferrer' } : {};
    return (<DashlaneLink sx={{ textDecoration: 'revert', fontWeight: 400 }} {...defaultStyles} {...props} {...relAttribute}>
      {children}
    </DashlaneLink>);
};
export default Link;
