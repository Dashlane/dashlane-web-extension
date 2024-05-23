import { ReactNode } from 'react';
import { Icon, jsx, Paragraph } from '@dashlane/design-system';
const SX_STYLES = {
    display: 'flex',
    gap: '4px',
    padding: '5px 0px',
    alignItems: 'center',
    color: 'ds.text.brand.standard',
    backgroundColor: 'ds.background.default',
    cursor: 'pointer',
    marginTop: '5px',
};
interface Props {
    linkText: ReactNode;
    internalAction: () => void;
}
export const InternalRedirectButton = ({ internalAction, linkText }: Props) => {
    return (<button onClick={internalAction} sx={SX_STYLES}>
      <Paragraph as="span" sx={{ fontWeight: '500' }}>
        {linkText}
      </Paragraph>
      <Icon name="ArrowRightOutlined" size="small" color="ds.text.brand.standard"/>
    </button>);
};
