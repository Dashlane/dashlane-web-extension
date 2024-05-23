import { differenceInDays } from 'date-fns';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { AutoRenewInfo, SpaceTiers } from '@dashlane/communication';
import { CallToAction, CancelPlanStep } from '@dashlane/hermes';
import { Button, Card, colors, Eyebrow, FlexContainer, Heading, jsx, Link, Paragraph, } from '@dashlane/ui-components';
import { IndeterminateLoader } from '@dashlane/design-system';
import { APP_STORE_PLANS, GOOGLE_PLAY_PLANS } from 'team/urls';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { getActiveSpace, getPlanNameFromTier, isAccountBusiness, isAccountFamily, isAccountFamilyAdmin, isAdvancedPlan, isEssentialsPlan, isFreeTrial, isPaidAccount, isPremiumPlan, isPremiumPlusPlan, } from 'libs/account/helpers';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { openDashlaneUrl } from 'libs/external-urls';
import { getPlanRenewalPeriodicity } from 'libs/premium-status.lib';
import { LocaleFormat } from 'libs/i18n/helpers';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import { NamedRoutes } from 'app/routes/types';
import { CancellationStep } from 'webapp/subscription-management/subscription-page';
import { logCancellationEvent, logPlanRestartEvent, logPlansPageEvent, } from 'webapp/subscription-management/logs';
const I18N_KEYS = {
    BUY_AS_TRIAL: 'manage_subscription_plan_section_buy_as_trial_button',
    CARD_TITLE: 'manage_subscription_plan_section_title',
    CHANGE_PLAN: 'manage_subscription_plan_section_change_button',
    DESC_B2C: 'manage_subscription_plan_section_desc_b2c_plans_markup',
    DESC_BUSINESS: 'manage_subscription_plan_section_desc_business',
    DESC_CANCELLED: 'manage_subscription_plan_section_desc_cancelled_markup',
    DESC_FAMILY_INVITEE: 'manage_subscription_plan_section_desc_family_invitee',
    DESC_FREE: 'manage_subscription_plan_section_desc_free',
    DESC_FREE_TRIAL: 'manage_subscription_plan_section_trial_desc_markup',
    DESC_TEAM: 'manage_subscription_plan_section_desc_team',
    FEATS_COMPARE: 'manage_subscription_plan_section_compare_link',
    FEATS_ADVANCED: 'manage_subscription_plan_section_features_link_advanced',
    FEATS_ESSENTIALS: 'manage_subscription_plan_section_features_link_essentials',
    FEATS_FAMILY: 'manage_subscription_plan_section_features_link_family',
    FEATS_PREMIUM: 'manage_subscription_plan_section_features_link_premium',
    FOOTER: 'manage_subscription_plan_section_cancel_text',
    FOOTER_APPLE: 'manage_subscription_plan_section_apple_cancel_text_markup',
    FOOTER_GOOGLE: 'manage_subscription_plan_section_google_cancel_text_markup',
    PAYPAL_TOOLTIP: 'manage_subscription_plan_section_paypal_tooltip',
    PLAN_NAME_ADVANCED: 'manage_subscription_plan_name_advanced',
    PLAN_NAME_BUSINESS: 'manage_subscription_plan_name_dashlane_business',
    PLAN_NAME_ESSENTIALS: 'manage_subscription_plan_name_essentials',
    PLAN_NAME_FAMILY: 'manage_subscription_plan_name_family',
    PLAN_NAME_FREE: 'manage_subscription_plan_name_free',
    PLAN_NAME_PREMIUM: 'manage_subscription_plan_name_premium',
    PLAN_NAME_PREMIUM_PLUS: 'manage_subscription_plan_name_premium_plus',
    PLAN_NAME_PREMIUM_TRIAL: 'manage_subscription_plan_name_premium_trial',
    PLAN_NAME_TEAM: 'manage_subscription_plan_name_dashlane_team',
    REJOIN: 'manage_subscription_plan_section_rejoin_button',
    UPGRADE: 'manage_subscription_plan_section_upgrade_button',
    VIEW_PLANS: 'manage_subscription_plan_section_buy_plans_button',
};
const getPurchaseUrl = (isAdvanced: boolean, isEssentials: boolean, isFamily: boolean, routes: NamedRoutes, autoRenewInfo?: AutoRenewInfo, subscriptionCode?: string) => {
    if (isAdvanced) {
        return routes.userGoAdvanced(subscriptionCode, getPlanRenewalPeriodicity(autoRenewInfo));
    }
    if (isEssentials) {
        return routes.userGoEssentials(subscriptionCode, getPlanRenewalPeriodicity(autoRenewInfo));
    }
    if (isFamily) {
        return routes.userGoFamily(subscriptionCode, getPlanRenewalPeriodicity(autoRenewInfo));
    }
    return routes.userGoPremium(subscriptionCode, getPlanRenewalPeriodicity(autoRenewInfo));
};
export interface PlanCardProps {
    setCancellationStep: (step: CancellationStep) => void;
}
const LoadingStatus = () => (<Card sx={{
        marginBottom: '16px',
        padding: '32px',
        display: 'flex',
        justifyContent: 'center',
    }}>
    <IndeterminateLoader />
  </Card>);
export const PlanCard = ({ setCancellationStep }: PlanCardProps) => {
    const accountInfo = useAccountInfo();
    const premiumStatus = usePremiumStatus();
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return <LoadingStatus />;
    }
    const { autoRenewInfo, autoRenewal, endDate = 0, planType, } = premiumStatus.data;
    const isPaidAccountUser = isPaidAccount(premiumStatus.data);
    const isBusinessUser = isAccountBusiness(premiumStatus.data);
    const isEssentialUser = isEssentialsPlan(premiumStatus.data);
    const isFamilyAdmin = isAccountFamilyAdmin(premiumStatus.data);
    const isFamilyUser = isAccountFamily(premiumStatus.data);
    const isFamilyInvitee = isFamilyUser && !isFamilyAdmin;
    const isPremiumUser = isPremiumPlan(premiumStatus.data);
    const isPremiumPlusUser = isPaidAccountUser && isPremiumPlusPlan(premiumStatus.data);
    const isFreeTrialUser = isFreeTrial(premiumStatus.data);
    const isAdvancedUser = isAdvancedPlan(premiumStatus.data);
    const isAppStoreUser = planType?.includes('ios');
    const isGooglePlayUser = planType?.includes('playstore');
    let planTitleText = '';
    let secondaryLink = '';
    let descriptionText;
    const renewalDate = new Date(endDate * 1000);
    const renewalDateString = translate.shortDate(renewalDate, LocaleFormat.LL);
    if (isFamilyInvitee) {
        descriptionText = translate(I18N_KEYS.DESC_FAMILY_INVITEE);
    }
    else {
        const descriptionString = autoRenewal
            ? I18N_KEYS.DESC_B2C
            : I18N_KEYS.DESC_CANCELLED;
        descriptionText = endDate
            ? translate.markup(descriptionString, {
                date: renewalDateString,
                days: '30',
            })
            : '';
    }
    if (isBusinessUser) {
        const activeSpace = getActiveSpace(premiumStatus.data);
        if (activeSpace &&
            getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Team) {
            planTitleText = translate(I18N_KEYS.PLAN_NAME_TEAM);
            descriptionText = translate(I18N_KEYS.DESC_TEAM);
        }
        else {
            planTitleText = translate(I18N_KEYS.PLAN_NAME_BUSINESS);
            descriptionText = translate(I18N_KEYS.DESC_BUSINESS);
        }
    }
    else if (isFamilyUser) {
        planTitleText = translate(I18N_KEYS.PLAN_NAME_FAMILY);
        secondaryLink = translate(I18N_KEYS.FEATS_FAMILY);
    }
    else if (isAdvancedUser) {
        planTitleText = translate(I18N_KEYS.PLAN_NAME_ADVANCED);
        secondaryLink = translate(I18N_KEYS.FEATS_ADVANCED);
    }
    else if (isEssentialUser) {
        planTitleText = translate(I18N_KEYS.PLAN_NAME_ESSENTIALS);
        secondaryLink = translate(I18N_KEYS.FEATS_ESSENTIALS);
    }
    else if (isFreeTrialUser) {
        const daysUntilTrialExpires = differenceInDays(renewalDate, new Date().getTime());
        planTitleText = translate(I18N_KEYS.PLAN_NAME_PREMIUM_TRIAL);
        descriptionText = translate.markup(I18N_KEYS.DESC_FREE_TRIAL, {
            days: daysUntilTrialExpires,
            date: renewalDateString,
        });
        secondaryLink = translate(I18N_KEYS.FEATS_COMPARE);
    }
    else if (isPremiumPlusUser) {
        planTitleText = translate(I18N_KEYS.PLAN_NAME_PREMIUM_PLUS);
    }
    else if (isPremiumUser) {
        planTitleText = translate(I18N_KEYS.PLAN_NAME_PREMIUM);
        secondaryLink = translate(I18N_KEYS.FEATS_PREMIUM);
    }
    else {
        planTitleText = translate(I18N_KEYS.PLAN_NAME_FREE);
        descriptionText = translate(I18N_KEYS.DESC_FREE);
        secondaryLink = translate(I18N_KEYS.FEATS_COMPARE);
    }
    const showPlansCTA = !isFreeTrialUser &&
        !isFamilyInvitee &&
        !isBusinessUser &&
        !isAppStoreUser &&
        !isGooglePlayUser &&
        !autoRenewal;
    const isPlansCTAPrimary = !isPaidAccountUser || isFreeTrialUser || !autoRenewal;
    const showBuyCTA = isPaidAccountUser &&
        !autoRenewal &&
        !isPremiumPlusUser &&
        !isAppStoreUser &&
        !isGooglePlayUser &&
        !isFamilyInvitee;
    const plansButtonPaidString = autoRenewal
        ? I18N_KEYS.CHANGE_PLAN
        : I18N_KEYS.VIEW_PLANS;
    const plansButtonText = translate(!isPaidAccountUser || isFreeTrialUser
        ? I18N_KEYS.UPGRADE
        : plansButtonPaidString);
    const showFooter = !isBusinessUser && (autoRenewal || isGooglePlayUser || isAppStoreUser);
    const unparsedFooter = translate(I18N_KEYS.FOOTER);
    const [preFooterLink, footerLink, postFooterLink] = unparsedFooter.split('_');
    const appleFooter = translate.markup(I18N_KEYS.FOOTER_APPLE, {
        link: APP_STORE_PLANS,
    });
    const googleFooter = translate.markup(I18N_KEYS.FOOTER_GOOGLE, {
        link: GOOGLE_PLAY_PLANS,
    });
    const startCancelFlow = () => {
        setCancellationStep(CancellationStep.CANCEL_CONFIRM);
        logCancellationEvent(CancelPlanStep.Start, premiumStatus.data);
    };
    const goToPlansPage = () => {
        openDashlaneUrl(routes.userGoPlans, {
            type: 'subscriptionManagement',
            action: 'goToPlans',
        });
        logPlansPageEvent(CallToAction.AllOffers);
    };
    const goToPurchasePage = () => {
        const purchaseUrl = getPurchaseUrl(isAdvancedUser, isEssentialUser, isFamilyUser, routes, autoRenewInfo, accountInfo?.subscriptionCode);
        openDashlaneUrl(purchaseUrl, {
            type: 'subscriptionManagement',
            action: 'goToCheckout',
        });
        logPlanRestartEvent(premiumStatus.data);
    };
    return (<Card sx={{ marginBottom: '16px', padding: '32px' }}>
      <FlexContainer alignItems="center" justifyContent="space-between" sx={{ marginBottom: '32px' }}>
        <div>
          <Eyebrow color={colors.grey00}>
            {translate(I18N_KEYS.CARD_TITLE)}
          </Eyebrow>
          <Heading size="small" as="h2">
            {planTitleText}
          </Heading>
        </div>

        <div>
          {showPlansCTA ? (<Button nature={isPlansCTAPrimary ? 'primary' : 'secondary'} onClick={goToPlansPage} type="button" role="link">
              {plansButtonText}
            </Button>) : null}
          {showBuyCTA ? (<Button onClick={goToPurchasePage} nature="secondary" sx={{ marginLeft: '8px' }} type="button" role="link">
              {translate(I18N_KEYS.REJOIN)}
            </Button>) : null}
          {isFreeTrialUser ? (<Button onClick={goToPurchasePage} nature="primary" sx={{ marginLeft: '8px' }} type="button" role="link">
              {translate(I18N_KEYS.BUY_AS_TRIAL)}
            </Button>) : null}
        </div>
      </FlexContainer>

      <Paragraph color={colors.grey00}>{descriptionText}</Paragraph>
      {secondaryLink ? (<Link href={routes.userGoPlans} sx={{ color: colors.midGreen00, fontSize: 2, fontWeight: 'light' }} onClick={() => {
                logPlansPageEvent(CallToAction.PlanDetails);
            }} target="_blank" rel="noopener noreferrer">
          {secondaryLink}
        </Link>) : null}

      {showFooter ? (<Paragraph size="small" color={colors.grey00} sx={{
                borderTop: `1px solid ${colors.grey04}`,
                marginTop: '32px',
                paddingTop: '32px',
            }}>
          {!isGooglePlayUser && !isAppStoreUser ? (<span>
              {preFooterLink}
              <Link role="button" sx={{ color: colors.midGreen00 }} data-testid="buttonCancelSubscriptionConfirmation" onClick={startCancelFlow}>
                {footerLink}
              </Link>
              {postFooterLink}
            </span>) : null}
          {isAppStoreUser ? appleFooter : null}
          {isGooglePlayUser ? googleFooter : null}
        </Paragraph>) : null}
    </Card>);
};
