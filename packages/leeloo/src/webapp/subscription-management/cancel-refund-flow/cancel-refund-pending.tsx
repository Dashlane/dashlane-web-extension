import { Card, Paragraph } from '@dashlane/ui-components';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    PROGRESS1: 'manage_subscription_refund_progress1',
    PROGRESS2: 'manage_subscription_refund_progress2',
};
export const CancelOrRefundPendingCard: React.FC = () => {
    const { translate } = useTranslate();
    return (<Card sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '420px',
            justifyContent: 'center',
        }}>
      <IndeterminateLoader size={90}/>
      <Paragraph size="small">{translate(I18N_KEYS.PROGRESS1)}</Paragraph>
      <Paragraph size="small">{translate(I18N_KEYS.PROGRESS2)}</Paragraph>
    </Card>);
};
