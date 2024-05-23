import { useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CancelPlanStep, PageView } from '@dashlane/hermes';
import { Button, Card, Heading, Paragraph } from '@dashlane/ui-components';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import { openDashlaneUrl } from 'libs/external-urls';
import { logPageView } from 'libs/logs/logEvent';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import { logCancellationEvent } from 'webapp/subscription-management/logs';
const I18N_KEYS = {
    CARD_TITLE: 'manage_subscription_refund_success_title',
    DESCRIPTION: 'manage_subscription_refund_success_desc',
    PLANS_BUTTON: 'manage_subscription_refund_view_options_button',
};
export const RefundCompleteCard: React.FC = () => {
    const premiumStatus = usePremiumStatus();
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    useEffect(() => {
        if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
            logPageView(PageView.PlansManagementRefundDone);
            logCancellationEvent(CancelPlanStep.SuccessRefund, premiumStatus.data);
        }
    }, [premiumStatus]);
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return <IndeterminateLoader />;
    }
    const goToPlansPage = () => {
        openDashlaneUrl(routes.userGoPlans, {
            type: 'subscriptionManagement',
            action: 'goToPlans',
        });
    };
    return (<Card sx={{ padding: '32px' }}>
      <Heading size="small" sx={{ marginBottom: '40px' }}>
        {translate(I18N_KEYS.CARD_TITLE)}
      </Heading>

      <Paragraph size="small" sx={{ marginBottom: '20px' }}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>

      <Button nature="secondary" type="button" onClick={goToPlansPage}>
        {translate(I18N_KEYS.PLANS_BUTTON)}
      </Button>
    </Card>);
};
