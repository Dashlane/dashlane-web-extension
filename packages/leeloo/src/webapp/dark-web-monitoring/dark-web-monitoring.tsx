import { Fragment, useCallback, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { Lee } from 'lee';
import { AlertWrapper, FlexContainer, Heading, useAlert, } from '@dashlane/ui-components';
import { DarkWebOnboardingState } from '@dashlane/password-security-contracts';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { PageView } from '@dashlane/hermes';
import { isSuccess } from '@dashlane/framework-types';
import useTranslate from 'libs/i18n/useTranslate';
import { GetRouteWithSubscriptionCode } from 'app/routes/helpers';
import { GET_PREMIUM_URL } from 'app/routes/constants';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { MonitoredEmails } from './monitored-emails/monitored-emails';
import { PrivateBreaches } from './private-breaches/private-breaches';
import { Tips } from './tips/tips';
import { AddEmailDialog } from 'webapp/dark-web-monitoring/monitored-emails/add-email-dialog/add-email-dialog';
import { useDarkWebMonitoringEmails } from 'webapp/dark-web-monitoring/hooks/useDarkWebMonitoringEmails';
import { useDarkWebMonitoringOnboardingState } from 'webapp/dark-web-monitoring/hooks/useDarkWebMonitoringOnboardingState';
import { useEmailDialog } from 'webapp/dark-web-monitoring/hooks/useEmailDialog';
import { OnboardingInfos } from 'webapp/dark-web-monitoring/onboarding-infos/onboarding-infos';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { BreachDetailsDialogProvider } from 'webapp/dark-web-monitoring/breach-details/breach-details-dialog-provider';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { PaywallManager, PaywallName, } from 'webapp/paywall/manager/paywall-manager';
import { getPremiumDaysRemaining } from 'libs/account/helpers';
import { useCapabilities } from 'libs/carbon/hooks/useCapabilities';
import { logPageView } from 'libs/logs/logEvent';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { darkWebMonitoringStyles } from './dark-web-monitoring-styles';
const I18N_KEYS = {
    DARK_WEB_MONITORING_TITLE: 'webapp_darkweb_dashboard_title',
    DARK_WEB_MONITORING_FREE_TRIAL_WARNING: 'webapp_darkweb_dashboard_title_free_trial_warning'
};
const EMAIL_REMOVAL_ALERT_TIMEOUT_MS = 5000;
const PENDING_TOOLTIP_ACTION_DELAY_MS = 800;
interface DarkWebMonitoringProps {
    lee: Lee;
}
export const DarkWebMonitoring = ({ lee }: DarkWebMonitoringProps) => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    const accountInfo = useAccountInfo();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const { isLoading: areEmailsLoading, emails, limit, b2bAssociatedEmail, optinEmail, } = useDarkWebMonitoringEmails();
    const { close, setOptInError, isOpen, optInError, open } = useEmailDialog();
    const { onboardingState, updateOnboardingState } = useDarkWebMonitoringOnboardingState();
    const removalOutcomeAlert = useAlert({
        message: '',
        dismissDelay: EMAIL_REMOVAL_ALERT_TIMEOUT_MS,
        closeIconName: translate('_common_alert_dismiss_button'),
    });
    const dataLeakCapability = useCapabilities(['dataLeak']);
    useEffect(() => {
        logPageView(PageView.ToolsDarkWebMonitoring);
    }, []);
    const [newlyAddedEmail, setNewlyAddedEmail] = useState<string | null>(null);
    const onOnboardingClick = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else {
            updateOnboardingState();
            open();
        }
    };
    const onOpenAddEmailDialog = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else {
            open();
        }
    };
    const onAddEmail = async (email: string) => {
        const result = await optinEmail(email);
        if (isSuccess(result)) {
            close();
            setTimeout(() => {
                setNewlyAddedEmail(email);
            }, PENDING_TOOLTIP_ACTION_DELAY_MS);
        }
        else {
            setOptInError(result?.error?.tag);
        }
    };
    const onCancelAddEmail = () => {
        close();
    };
    const resetOptInError = useCallback(() => {
        if (optInError !== null) {
            setOptInError(null);
        }
    }, [optInError, setOptInError]);
    const isLoading = premiumStatus.status === DataStatus.Loading ||
        dataLeakCapability.status === DataStatus.Loading ||
        onboardingState.status === DataStatus.Loading ||
        accountInfo === null ||
        areEmailsLoading ||
        shouldShowTrialDiscontinuedDialog === null;
    if (isLoading) {
        return (<LoadingSpinner size={50} containerStyle={{
                height: '100%',
            }}/>);
    }
    const hasDataLeakCapabilityEnabled = dataLeakCapability.status === DataStatus.Success && dataLeakCapability.data;
    const hasNotSeenOnboarding = onboardingState.status === DataStatus.Success &&
        onboardingState.data === DarkWebOnboardingState.NOT_SEEN;
    const hasPersonallyMonitoredEmails = (emails ?? []).filter((email) => email.email !== b2bAssociatedEmail)
        .length > 0;
    const shouldDisplayOnboarding = hasDataLeakCapabilityEnabled &&
        hasNotSeenOnboarding &&
        !hasPersonallyMonitoredEmails;
    const emailsList = emails ?? [];
    const availableSpots = Math.max(limit - (emails?.length ?? 0), 0);
    const { login } = lee.globalState.carbon.loginStatus;
    const goPremiumUrl = GetRouteWithSubscriptionCode(GET_PREMIUM_URL, accountInfo?.subscriptionCode);
    const daysRemaining = premiumStatus.status === DataStatus.Success && premiumStatus.data
        ? getPremiumDaysRemaining(premiumStatus.data)
        : undefined;
    return (<PersonalDataSectionView>
      <BreachDetailsDialogProvider>
        <PaywallManager mode="fullscreen" paywall={PaywallName.DarkWebMonitoring}>
          <div sx={darkWebMonitoringStyles.onboardingContainer}>
            {shouldDisplayOnboarding ? (<OnboardingInfos onActionClick={onOnboardingClick} premiumDaysRemaining={daysRemaining}/>) : (<div sx={darkWebMonitoringStyles.rootContainer}>
                <Header startWidgets={() => (<FlexContainer flexDirection="column">
                      <Heading as="h2">
                        {translate(I18N_KEYS.DARK_WEB_MONITORING_TITLE)}
                      </Heading>
                      {daysRemaining !== undefined ? (<div sx={darkWebMonitoringStyles.freeTrialWarning}>
                          {translate(I18N_KEYS.DARK_WEB_MONITORING_FREE_TRIAL_WARNING, {
                        days: daysRemaining,
                    })}
                        </div>) : null}
                    </FlexContainer>)} endWidget={<>
                      <HeaderAccountMenu />
                      <NotificationsDropdown />
                    </>}/>

                <div sx={darkWebMonitoringStyles.content}>
                  <div sx={darkWebMonitoringStyles.breachesContent}>
                    <PrivateBreaches hasDataLeakCapability={hasDataLeakCapabilityEnabled} availableEmailSpots={availableSpots} emails={emailsList} onOpenAddDialog={onOpenAddEmailDialog} premiumUrl={goPremiumUrl}/>
                  </div>
                  <div sx={darkWebMonitoringStyles.emailContent}>
                    <MonitoredEmails emails={emailsList} b2bAssociatedEmail={b2bAssociatedEmail} availableEmailSpots={availableSpots} onOpenAddDialog={onOpenAddEmailDialog} removalOutcomeAlert={removalOutcomeAlert} newlyAddedEmail={newlyAddedEmail} setNewlyAddedEmail={setNewlyAddedEmail} hasDataLeakCapability={hasDataLeakCapabilityEnabled}/>
                    <Tips />
                    {isOpen ? (<AddEmailDialog existingEmails={emailsList} userLogin={login} availableSpots={availableSpots} error={optInError} resetError={resetOptInError} handleOnCloseDialog={onCancelAddEmail} handleOnAddEmail={onAddEmail}/>) : null}
                  </div>
                </div>
              </div>)}
          </div>
          <AlertWrapper>{removalOutcomeAlert.alert}</AlertWrapper>
        </PaywallManager>
      </BreachDetailsDialogProvider>
    </PersonalDataSectionView>);
};
