import { Fragment, useEffect, useState } from 'react';
import { Heading, IndeterminateLoader, jsx, Paragraph, } from '@dashlane/design-system';
import { PageView, ScimSetupStep, UserSetupConfidentialScimEvent, } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { InferredSsoState } from '@dashlane/sso-scim-contracts';
import { ExternalLink } from 'team/settings/components/layout/external-link';
import { GridContainer } from '@dashlane/ui-components';
import { FeatureCard } from 'team/settings/components/feature-card';
import { activeDirectory, confidentialSCIM, selfhostedlSCIM, } from './card-info';
import { useTeamCapabilities } from 'team/settings/hooks/use-team-capabilities';
import { SCIMPaywall } from '../scim-provisioning/scim-paywall';
import { useBuyOrUpgradePaywallDetails } from 'team/helpers/use-buy-or-upgrade-paywall-details';
const SETUP_GUIDE_HREF = '*****';
const I18N_KEYS = {
    HEADER: 'tac_settings_directory_sync_header',
    HEADER_HELPER: 'tac_settings_directory_sync_header_helper',
    HEADER_LINK: 'tac_settings_directory_sync_header_link',
};
interface DirectorySyncLandingPageProps {
    ssoState?: InferredSsoState;
    isAdSyncEnabled: boolean;
    isSelfhostedScimEnabled: boolean;
    isNitroSCIMEnabled: boolean;
    isLoading?: boolean;
}
const selfhostedEnabled = (ssoState?: InferredSsoState) => ssoState === 'SelfHostedComplete' || ssoState === 'SelfHostedIncomplete';
export const DirectorySyncLandingPage = ({ ssoState, isAdSyncEnabled, isSelfhostedScimEnabled, isNitroSCIMEnabled, isLoading = false, }: DirectorySyncLandingPageProps) => {
    const { translate } = useTranslate();
    const isNitroSSOActivated = ssoState === 'NitroComplete';
    const isNitroSSOStarted = isNitroSSOActivated || ssoState === 'NitroIncomplete';
    const isSelfhostedSSO = selfhostedEnabled(ssoState);
    const teamCapabilities = useTeamCapabilities();
    const [isCapable, setIsCapable] = useState(true);
    const [isTrialOrGracePeriod, setIsTrialOrGracePeriod] = useState(false);
    const paywallInfo = useBuyOrUpgradePaywallDetails({
        hasBillingAccess: true,
    });
    useEffect(() => {
        if (teamCapabilities) {
            setIsCapable(!!teamCapabilities.scim.enabled);
        }
    }, [teamCapabilities]);
    useEffect(() => {
        logPageView(PageView.TacSettingsDirectorySync);
    }, []);
    useEffect(() => {
        if (paywallInfo?.isTrialOrGracePeriod) {
            setIsTrialOrGracePeriod(paywallInfo.isTrialOrGracePeriod);
        }
    }, [paywallInfo]);
    if (isLoading) {
        return (<GridContainer justifyItems="center">
        <IndeterminateLoader size={75} sx={{ marginTop: '20vh' }}/>
      </GridContainer>);
    }
    return (<div sx={{ margin: '32px' }}>
      <Heading as="h1" textStyle="ds.title.section.large" sx={{ marginBottom: '16px' }}>
        {translate(I18N_KEYS.HEADER)}
      </Heading>
      <Paragraph sx={{ marginBottom: '8px' }}>
        {translate(I18N_KEYS.HEADER_HELPER)}
      </Paragraph>
      <ExternalLink sx={{ marginBottom: '32px' }} href={SETUP_GUIDE_HREF}>
        {translate(I18N_KEYS.HEADER_LINK)}
      </ExternalLink>
      <GridContainer fullWidth gridTemplateColumns="repeat(3, 1fr)" gap="24px">
        {isCapable ? (<>
            <FeatureCard optionNumber={1} {...confidentialSCIM} selected={isNitroSCIMEnabled} disabled={(!isNitroSCIMEnabled && !isNitroSSOActivated) ||
                isSelfhostedSSO ||
                isSelfhostedScimEnabled ||
                isAdSyncEnabled} onCtaClick={() => {
                logEvent(new UserSetupConfidentialScimEvent({
                    scimSetupStep: ScimSetupStep.ClickSetUp,
                }));
            }}/>
            <FeatureCard optionNumber={2} {...selfhostedlSCIM} selected={isSelfhostedScimEnabled} disabled={isNitroSSOStarted || isNitroSCIMEnabled || isAdSyncEnabled}/>
            <FeatureCard optionNumber={3} {...activeDirectory} selected={isAdSyncEnabled} disabled={isNitroSCIMEnabled || isSelfhostedScimEnabled}/>
          </>) : (<>
            <FeatureCard optionNumber={1} {...activeDirectory} selected={isAdSyncEnabled} disabled={isNitroSCIMEnabled || isSelfhostedScimEnabled}/>
            <SCIMPaywall isTrialOrGracePeriod={isTrialOrGracePeriod}/>
          </>)}
      </GridContainer>
    </div>);
};
