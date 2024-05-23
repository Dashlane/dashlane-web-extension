import React from 'react';
import { CustomRoute, RoutesProps, WrappingRoute } from 'libs/router';
import { LOGIN_TAC_URL_SEGMENT, LOGIN_URL_SEGMENT, RoutingSchemeOptions, } from 'app/routes/constants';
import { NoSideBarWebapp, Webapp } from './index';
import DashlaneLabRoutes from './dashlane-labs/routes';
import FamilyRoutes from './family-dashboard/routes';
import NotificationRoutes from './sharing-notifications/routes';
import { PaymentsRoutes } from './payments/routes';
import { PersonalInfoRoutes } from './personal-info/routes';
import { SecureNotesRoutes } from './secure-notes/routes';
import TeamConsoleRoutes from './team-console/routes';
import { SharingCenterRoutes } from './sharing-center/routes';
import UpsellRoutes from './upsell/routes';
import { AntiPhishingRoutes } from './anti-phishing/routes';
import { ChromeWelcomeRoutes } from './chrome-welcome/routes';
import { CollectionsRoutes } from './vault/collections-routes';
import { CredentialsRoutes } from './credentials/routes';
import { PasskeysRoutes } from './vault/passkeys/routes';
import { PasswordHistoryRoutes } from './password-history/routes';
import { DarkWebMonitoringRoutes } from './dark-web-monitoring/routes';
import { IdsRoutes } from './ids/routes';
import { OnboardingRoutes } from './onboarding/routes';
import { PasswordHealthRoutes } from './password-health/password-health-routes';
import { PremiumPlusRoutes } from './premium-plus/routes';
import { ReferralRoutes } from './referral/routes';
import { SubscriptionManagementRoutes } from './subscription-management/routes';
import { VpnRoutes } from './vpn/routes';
import { TwoFactorAuthenticationRoutes } from './two-factor-authentication/routes';
import { ImportDataRouteWrapper } from './import-data/routes';
import { VaultItemsPanelRoutes } from './vault/vault-items-panel-routes';
import { PrivacySettingsRoutes } from './privacy-settings/routes';
import { DeviceTransferContainer } from './device-transfer/device-transfer-container';
import { SecretsRoutes } from './secrets/routes';
interface Props extends RoutesProps<string[]> {
    basePath: string;
    routingSchemeOptions: RoutingSchemeOptions;
}
export default function routes({ basePath, routingSchemeOptions, }: Props): JSX.Element {
    return (<>
      <WrappingRoute path={[
            `${basePath}/collections`,
            `${basePath}/credentials`,
            `${basePath}/device-transfer`,
            `${basePath}/passkeys`,
            `${basePath}/darkweb-monitoring`,
            `${basePath}/ids`,
            `${basePath}/import`,
            `${basePath}/notifications`,
            `${basePath}/onboarding`,
            `${basePath}/password-health`,
            `${basePath}/password-history`,
            `${basePath}/payments`,
            `${basePath}/personal-info`,
            `${basePath}/premium-plus`,
            `${basePath}/referral`,
            `${basePath}/secrets`,
            `${basePath}/secure-notes`,
            `${basePath}/go-premium`,
            `${basePath}/sharing-center`,
            `${basePath}/subscription`,
            `${basePath}/vpn`,
            `${basePath}/dashlane-labs`,
            `${basePath}/privacy-settings`,
        ]} component={Webapp} permission={(p) => p.loggedIn} redirectPath={LOGIN_URL_SEGMENT}>
        <CollectionsRoutes path={`${basePath}/collections`}/>
        <CredentialsRoutes path={`${basePath}/credentials`}/>
        <CustomRoute path={`${basePath}/device-transfer`} component={DeviceTransferContainer}/>

        
        <PasskeysRoutes path={`${basePath}/passkeys`}/>

        <DarkWebMonitoringRoutes path={`${basePath}/darkweb-monitoring`}/>
        <IdsRoutes path={`${basePath}/ids`}/>
        <ImportDataRouteWrapper path={`${basePath}/import`}/>
        <NotificationRoutes path={`${basePath}/notifications`}/>
        <OnboardingRoutes path={`${basePath}/onboarding`}/>
        <PasswordHealthRoutes path={`${basePath}/password-health`}/>
        <PasswordHistoryRoutes path={`${basePath}/password-history`}/>
        <PaymentsRoutes path={`${basePath}/payments`}/>
        <PersonalInfoRoutes path={`${basePath}/personal-info`}/>
        <PremiumPlusRoutes path={`${basePath}/premium-plus`}/>
        <ReferralRoutes path={`${basePath}/referral`}/>
        <SecretsRoutes path={`${basePath}/secrets`}/>
        <SecureNotesRoutes path={`${basePath}/secure-notes`}/>
        <UpsellRoutes path={`${basePath}/go-premium`}/>
        <SharingCenterRoutes path={`${basePath}/sharing-center`}/>
        <SubscriptionManagementRoutes path={`${basePath}/subscription`}/>
        <VpnRoutes path={`${basePath}/vpn`}/>
        <DashlaneLabRoutes path={`${basePath}/dashlane-labs`}/>
        <VaultItemsPanelRoutes path={basePath}/>
        <PrivacySettingsRoutes path={`${basePath}/privacy-settings`}/>
      </WrappingRoute>

      <WrappingRoute path={[
            `${basePath}/family-dashboard`,
            `${basePath}/chrome-welcome`,
            `${basePath}/two-factor-authentication`,
            `${basePath}/account-recovery-key-result`,
            `${basePath}/auto-login-sso-success`,
            `${basePath}/device-transfer-success`,
        ]} component={NoSideBarWebapp} permission={(p) => p.loggedIn} redirectPath={LOGIN_URL_SEGMENT}>
        <FamilyRoutes path={`${basePath}/family-dashboard`}/>
        <ChromeWelcomeRoutes path={`${basePath}/chrome-welcome`}/>
        <TwoFactorAuthenticationRoutes path={`${basePath}/two-factor-authentication`}/>
      </WrappingRoute>

      <WrappingRoute path={[`${basePath}/console`]} component={NoSideBarWebapp} permission={(p) => p.loggedIn} redirectPath={`${basePath}${LOGIN_TAC_URL_SEGMENT}`}>
        <TeamConsoleRoutes path={`${basePath}/console`} routingSchemeOptions={routingSchemeOptions}/>
      </WrappingRoute>

      <WrappingRoute path={[`${basePath}/anti-phishing`]} component={NoSideBarWebapp}>
        <AntiPhishingRoutes path={`${basePath}/anti-phishing`}/>
      </WrappingRoute>
    </>);
}
