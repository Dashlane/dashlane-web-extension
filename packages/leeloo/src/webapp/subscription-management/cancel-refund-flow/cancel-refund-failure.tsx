import { useEffect } from 'react';
import { CancelPlanStep, PageView } from '@dashlane/hermes';
import { Card, Heading, Paragraph } from '@dashlane/ui-components';
import { Button, jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { openUrl } from 'libs/external-urls';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { logCancellationEvent } from 'webapp/subscription-management/logs';
import { DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT } from 'webapp/urls';
const I18N_KEYS = {
    BUTTON: 'manage_subscription_refund_fail_support_button',
    DESC_CANCEL: 'manage_subscription_cancel_failure_description',
    DESC_REFUND: 'manage_subscription_refund_fail_desc',
    TITLE_CANCEL: 'manage_subscription_cancel_failure_title',
    TITLE_REFUND: 'manage_subscription_refund_fail_title',
};
export interface CancelOrRefundFailureCardProps {
    isRefund: boolean;
}
export const CancelOrRefundFailureCard = ({ isRefund, }: CancelOrRefundFailureCardProps) => {
    const premiumStatus = usePremiumStatus();
    const { translate } = useTranslate();
    const title = isRefund ? I18N_KEYS.TITLE_REFUND : I18N_KEYS.TITLE_CANCEL;
    const description = isRefund ? I18N_KEYS.DESC_REFUND : I18N_KEYS.DESC_CANCEL;
    useEffect(() => {
        if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
            const page = isRefund
                ? PageView.PlansManagementRefundError
                : PageView.PlansManagementCancelError;
            const event = isRefund
                ? CancelPlanStep.SuccessCancelAndErrorRefund
                : CancelPlanStep.CancelError;
            logPageView(page);
            logCancellationEvent(event, premiumStatus.data);
        }
    }, [premiumStatus]);
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return null;
    }
    return (<Card sx={{ padding: '32px' }}>
      <Heading size="small">{translate(title)}</Heading>

      <Paragraph size="small" sx={{ margin: '40px 0' }}>
        {translate(description)}
      </Paragraph>

      <Button intensity="quiet" role="link" onClick={() => {
            openUrl(DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT);
            logCancellationEvent(CancelPlanStep.ContactSupport, premiumStatus.data);
        }}>
        {translate(I18N_KEYS.BUTTON)}
      </Button>
    </Card>);
};
