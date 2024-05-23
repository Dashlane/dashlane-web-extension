import { jsx } from '@dashlane/ui-components';
import { HTMLAttributes, PropsWithChildren } from 'react';
interface MinimalCardProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
    backgroundColor?: string;
    withBorder?: boolean;
    paddingSize?: 'normal' | 'tight';
}
export const MinimalCard = ({ backgroundColor, withBorder, paddingSize = 'normal', ...rest }: MinimalCardProps) => {
    return (<div sx={{
            bg: backgroundColor ?? 'ds.container.agnostic.neutral.quiet',
            p: paddingSize === 'tight' ? '24px' : '32px 24px',
            border: withBorder ? '1px solid #8C8F9033' : undefined,
            borderRadius: 3,
            height: 'fit-content',
        }} {...rest}/>);
};
