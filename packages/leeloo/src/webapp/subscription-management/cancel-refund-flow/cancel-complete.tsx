import { useEffect, useState } from 'react';
import { PremiumStatus } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CancelPlanStep, PageView, SurveyAnswer } from '@dashlane/hermes';
import { Button, Card, colors, Heading, Link, Paragraph, } from '@dashlane/ui-components';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import { isAccountFamily, isAdvancedPlan, isEssentialsPlan, } from 'libs/account/helpers';
import { carbonConnector } from 'libs/carbon/connector';
import { getPlanRenewalPeriodicity } from 'libs/premium-status.lib';
import { LocaleFormat } from 'libs/i18n/helpers';
import { logPageView } from 'libs/logs/logEvent';
import { openDashlaneUrl } from 'libs/external-urls';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import { NamedRoutes } from 'app/routes/types';
import { TERMS_OF_SERVICE } from 'team/urls';
import { OPEN_IN_NEW_TAB } from 'webapp/vpn/components/vpn-links-constants';
import { logCancellationEvent, logPlanRestartEvent, } from 'webapp/subscription-management/logs';
import { CancellationStep } from 'webapp/subscription-management/subscription-page';
const I18N_KEYS = {
    CARD_TITLE: 'manage_subscription_cancel_confirmed_section_title',
    DESCRIPTION: {
        ADVANCED: 'manage_subscription_cancel_confirmed_section_desc_advanced',
        ESSENTIALS: 'manage_subscription_cancel_confirmed_section_desc_essentials',
        FAMILY: 'manage_subscription_cancel_confirmed_section_desc_family',
        PREMIUM: 'manage_subscription_cancel_confirmed_section_desc_premium',
    },
    FOOTER: {
        ADVANCED: 'manage_subscription_cancel_confirmed_section_refund_request_advanced',
        ESSENTIALS: 'manage_subscription_cancel_confirmed_section_refund_request_essentials',
        FAMILY: 'manage_subscription_cancel_confirmed_section_refund_request_premium',
        POLICY: 'manage_subscription_cancel_confirmed_section_refund_policy_markup',
        PREMIUM: 'manage_subscription_cancel_confirmed_section_refund_request_premium',
    },
    RESTART_BUTTON: 'manage_subscription_cancel_confirmed_section_restart_button',
    PLANS_BUTTON: 'manage_subscription_cancel_confirmed_section_view_plans_button',
};
const getPlanDetails = (premiumStatusData: PremiumStatus, routes: NamedRoutes, subscriptionCode?: string) => {
    const { autoRenewInfo } = premiumStatusData;
    const userPeriodicity = getPlanRenewalPeriodicity(autoRenewInfo);
    if (isAdvancedPlan(premiumStatusData)) {
        return {
            planNameString: 'ADVANCED',
            restartPlanUrl: routes.userGoAdvanced(subscriptionCode, userPeriodicity),
        };
    }
    if (isEssentialsPlan(premiumStatusData)) {
        return {
            planNameString: 'ESSENTIALS',
            restartPlanUrl: routes.userGoEssentials(subscriptionCode, userPeriodicity),
        };
    }
    if (isAccountFamily(premiumStatusData)) {
        return {
            planNameString: 'FAMILY',
            restartPlanUrl: routes.userGoFamily(subscriptionCode, userPeriodicity),
        };
    }
    return {
        planNameString: 'PREMIUM',
        restartPlanUrl: routes.userGoPremium(subscriptionCode, userPeriodicity),
    };
};
export interface CancelCompleteCardProps {
    setCancellationStep: (step: CancellationStep) => void;
    surveyAnswer?: SurveyAnswer;
}
export const CancelCompleteCard = ({ setCancellationStep, surveyAnswer, }: CancelCompleteCardProps) => {
    const accountInfo = useAccountInfo();
    const premiumStatus = usePremiumStatus();
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const [isEligible, setIsEligible] = useState<boolean>(false);
    useEffect(() => {
        async function checkRefundEligibility() {
            const result = await carbonConnector.requestRefund({ dryRun: true });
            if (result.success) {
                setIsEligible(true);
            }
        }
        checkRefundEligibility();
    }, []);
    useEffect(() => {
        if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
            logPageView(PageView.PlansManagementCancelDone);
            logCancellationEvent(CancelPlanStep.SuccessCancel, premiumStatus.data, surveyAnswer);
        }
    }, [premiumStatus, surveyAnswer]);
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return <IndeterminateLoader />;
    }
    const { endDate } = premiumStatus.data;
    const renewalDate = endDate ? new Date(endDate * 1000) : null;
    const renewalDateString = renewalDate
        ? translate.shortDate(renewalDate, LocaleFormat.LL)
        : '';
    const { planNameString, restartPlanUrl } = getPlanDetails(premiumStatus.data, routes, accountInfo?.subscriptionCode);
    const goToPlansPage = () => {
        openDashlaneUrl(routes.userGoPlans, {
            type: 'subscriptionManagement',
            action: 'goToPlans',
        });
    };
    const requestRefund = async () => {
        setCancellationStep(CancellationStep.REFUND_PENDING);
        const result = await carbonConnector.requestRefund({ dryRun: false });
        setCancellationStep(result.success
            ? CancellationStep.REFUND_COMPLETE
            : CancellationStep.REFUND_FAILURE);
    };
    const restartSubscription = () => {
        openDashlaneUrl(restartPlanUrl, {
            type: 'subscriptionManagement',
            action: 'restartPlan',
        });
        logPlanRestartEvent(premiumStatus.data);
    };
    const requestText = translate(I18N_KEYS.FOOTER[planNameString]);
    const [preRequestLink, requestLink, postRequestLink] = requestText.split('_');
    return (<Card sx={{ padding: '32px' }}>
      <Heading size="small" sx={{ marginBottom: '40px' }}>
        {translate(I18N_KEYS.CARD_TITLE)}
      </Heading>

      <Paragraph size="small" sx={{ marginBottom: '12px' }}>
        {translate(I18N_KEYS.DESCRIPTION[planNameString], {
            date: renewalDateString,
        })}
      </Paragraph>

      <Button sx={{ marginRight: '8px' }} nature="secondary" type="button" onClick={restartSubscription}>
        {translate(I18N_KEYS.RESTART_BUTTON)}
      </Button>

      <Button nature="secondary" type="button" onClick={goToPlansPage}>
        {translate(I18N_KEYS.PLANS_BUTTON)}
      </Button>

      {isEligible ? (<Paragraph size="small" sx={{
                borderTop: `1px solid ${colors.grey04}`,
                marginTop: '40px',
                paddingTop: '20px',
            }}>
          {preRequestLink}
          <Link role="button" sx={{ color: colors.midGreen00, fontWeight: 400 }} onClick={requestRefund}>
            {requestLink}
          </Link>
          {postRequestLink}{' '}
          {translate.markup(I18N_KEYS.FOOTER.POLICY, { policyLink: TERMS_OF_SERVICE }, { linkTarget: OPEN_IN_NEW_TAB })}
        </Paragraph>) : null}
    </Card>);
};
