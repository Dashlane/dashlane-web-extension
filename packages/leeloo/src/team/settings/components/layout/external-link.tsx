import { MouseEventHandler, PropsWithChildren } from 'react';
import { Icon, jsx, Paragraph, SxProp } from '@dashlane/design-system';
interface ExternalLinkProps extends SxProp {
    href: string;
    onClick?: MouseEventHandler | undefined;
}
export const ExternalLink = ({ children, href, onClick, ...props }: PropsWithChildren<ExternalLinkProps>) => {
    return (<Paragraph as="a" onClick={onClick} href={href} rel="noopener noreferrer" target="_blank" color="ds.text.brand.quiet" sx={{
            display: 'inline-flex',
            textDecoration: 'underline',
            flexDirection: 'row',
            ':hover': {
                textDecoration: 'none',
                color: 'ds.text.brand.standard',
            },
            ':hover + svg': {
                fill: 'ds.text.brand.standard',
            },
        }} {...props}>
      {children}
      <Icon name="ActionOpenExternalLinkOutlined" color="ds.text.brand.quiet"/>
    </Paragraph>);
};
