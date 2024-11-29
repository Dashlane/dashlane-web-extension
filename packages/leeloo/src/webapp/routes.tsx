import { CustomRoute, RoutesProps, WrappingRoute } from "../libs/router";
import {
  LOGIN_TAC_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
  RoutingSchemeOptions,
} from "../app/routes/constants";
import { NamedRoutes } from "../app/routes/types";
import { NoSideBarWebapp, Webapp } from "./index";
import DashlaneLabRoutes from "./dashlane-labs/routes";
import FamilyRoutes from "./family-dashboard/routes";
import NotificationRoutes from "./sharing-notifications/routes";
import { PaymentsRoutes } from "./payments/routes";
import { PersonalInfoRoutes } from "./personal-info/routes";
import { SecureNotesRoutes } from "./secure-notes/routes";
import TeamConsoleRoutes from "./team-console/routes";
import { SharingCenterRoutes } from "./sharing-center/routes";
import UpsellRoutes from "./upsell/routes";
import { AntiPhishingRoutes } from "./anti-phishing/routes";
import { ChromeWelcomeRoutes } from "./chrome-welcome/routes";
import { CollectionsRoutes } from "./collections/collections-routes";
import { CredentialsRoutes } from "./credentials/routes";
import { PasskeysRoutes } from "./passkeys/routes";
import { PasswordHistoryRoutes } from "./password-history/routes";
import { DarkWebMonitoringRoutes } from "./dark-web-monitoring/routes";
import { IdsRoutes } from "./ids/routes";
import { OnboardingRoutes } from "./onboarding/routes";
import { PasswordHealthRoutes } from "./password-health/password-health-routes";
import { PremiumPlusRoutes } from "./premium-plus/routes";
import { ProfileAdminRoutes } from "./profile-admin/routes";
import { ReferralRoutes } from "./referral/routes";
import { SubscriptionManagementRoutes } from "./subscription-management/routes";
import { VpnRoutes } from "./vpn/routes";
import { TwoFactorAuthenticationRoutes } from "./two-factor-authentication/routes";
import { ImportDataRouteWrapper } from "./import-data/routes";
import { VaultItemsPanelRoutes } from "./vault-items-panel-routes";
import { DeviceTransferContainer } from "./device-transfer/device-transfer-container";
import { SecretsRoutes } from "./secrets/routes";
import { ChangeLoginEmailContainer } from "../account-management/change-login-email/change-login-email-container";
import { SettingsRoutes } from "./settings/routes";
interface Props extends RoutesProps<string[]> {
  basePath: string;
  routingSchemeOptions: RoutingSchemeOptions;
}
export enum Lists {
  CredentialsList = "credentialsList",
  SecureNotesList = "secureNotesList",
  UserList = "user",
  GroupList = "userGroup",
  CollectionList = "collection",
}
export type PreviousPage =
  | {
      type: Lists.CredentialsList;
    }
  | {
      type: Lists.SecureNotesList;
    }
  | {
      type: Lists.CollectionList;
      collectionId: string;
    }
  | {
      type: Lists.UserList;
      alias: string;
    }
  | {
      type: Lists.GroupList;
      groupId: string;
    };
interface State {
  previousPage?: PreviousPage;
}
export const previousRoute = (state: State, namedRoutes: NamedRoutes) => {
  switch (state?.previousPage?.type) {
    case Lists.CredentialsList:
      return namedRoutes.userCredentials;
    case Lists.SecureNotesList:
      return namedRoutes.userSecureNotes;
    case Lists.UserList:
      if (state.previousPage.alias) {
        return namedRoutes.userSharingUserInfo(state.previousPage.alias);
      }
      return namedRoutes.userCredentials;
    case Lists.GroupList: {
      const groupId = state.previousPage.groupId?.match(/{(.*)}/)?.[1];
      if (groupId) {
        return namedRoutes.userSharingGroupInfo(groupId);
      }
      return namedRoutes.userCredentials;
    }
    case Lists.CollectionList: {
      const collectionId =
        state.previousPage.collectionId?.match(/{(.*)}/)?.[1];
      if (collectionId) {
        return namedRoutes.userCollection(collectionId);
      }
      return namedRoutes.userCredentials;
    }
    default:
      return namedRoutes.userCredentials;
  }
};
export default function routes({
  basePath,
  routingSchemeOptions,
}: Props): JSX.Element {
  return (
    <>
      <WrappingRoute
        path={[
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
          `${basePath}/profile-admin`,
          `${basePath}/referral`,
          `${basePath}/secure-notes`,
          `${basePath}/go-premium`,
          `${basePath}/sharing-center`,
          `${basePath}/subscription`,
          `${basePath}/vpn`,
          `${basePath}/dashlane-labs`,
          `${basePath}/settings`,
          `${basePath}/secrets`,
        ]}
        component={Webapp}
        permission={(p) => p.loggedIn}
        redirectPath={LOGIN_URL_SEGMENT}
      >
        <CollectionsRoutes path={`${basePath}/collections`} />
        <CredentialsRoutes path={`${basePath}/credentials`} />
        <CustomRoute
          path={`${basePath}/device-transfer`}
          component={DeviceTransferContainer}
        />

        <PasskeysRoutes path={`${basePath}/passkeys`} />

        <DarkWebMonitoringRoutes path={`${basePath}/darkweb-monitoring`} />
        <IdsRoutes path={`${basePath}/ids`} />
        <ImportDataRouteWrapper path={`${basePath}/import`} />
        <NotificationRoutes path={`${basePath}/notifications`} />
        <OnboardingRoutes path={`${basePath}/onboarding`} />
        <PasswordHealthRoutes path={`${basePath}/password-health`} />
        <PasswordHistoryRoutes path={`${basePath}/password-history`} />
        <PaymentsRoutes path={`${basePath}/payments`} />
        <PersonalInfoRoutes path={`${basePath}/personal-info`} />
        <PremiumPlusRoutes path={`${basePath}/premium-plus`} />
        <ProfileAdminRoutes path={`${basePath}/profile-admin`} />
        <ReferralRoutes path={`${basePath}/referral`} />
        <SecureNotesRoutes path={`${basePath}/secure-notes`} />
        <UpsellRoutes path={`${basePath}/go-premium`} />
        <SharingCenterRoutes path={`${basePath}/sharing-center`} />
        <SubscriptionManagementRoutes path={`${basePath}/subscription`} />
        <VpnRoutes path={`${basePath}/vpn`} />
        <DashlaneLabRoutes path={`${basePath}/dashlane-labs`} />
        <VaultItemsPanelRoutes path={basePath} />
        <SettingsRoutes path={`${basePath}/settings`} />
        <SecretsRoutes path={`${basePath}/secrets`} />
      </WrappingRoute>

      <WrappingRoute
        path={[
          `${basePath}/family-dashboard`,
          `${basePath}/chrome-welcome`,
          `${basePath}/two-factor-authentication`,
          `${basePath}/account-recovery-key-result`,
          `${basePath}/auto-login-sso-success`,
          `${basePath}/device-transfer-success`,
        ]}
        component={NoSideBarWebapp}
        permission={(p) => p.loggedIn}
        redirectPath={LOGIN_URL_SEGMENT}
      >
        <FamilyRoutes path={`${basePath}/family-dashboard`} />
        <ChromeWelcomeRoutes path={`${basePath}/chrome-welcome`} />
        <TwoFactorAuthenticationRoutes
          path={`${basePath}/two-factor-authentication`}
        />
      </WrappingRoute>

      <WrappingRoute
        path={[`${basePath}/console`]}
        component={NoSideBarWebapp}
        permission={(p) => p.loggedIn}
        redirectPath={`${basePath}${LOGIN_TAC_URL_SEGMENT}`}
      >
        <TeamConsoleRoutes
          path={`${basePath}/console`}
          routingSchemeOptions={routingSchemeOptions}
        />
      </WrappingRoute>

      <WrappingRoute
        path={[`${basePath}/anti-phishing`]}
        component={NoSideBarWebapp}
      >
        <AntiPhishingRoutes path={`${basePath}/anti-phishing`} />
      </WrappingRoute>

      <WrappingRoute
        path={[`${basePath}/account-management`]}
        component={NoSideBarWebapp}
      >
        <CustomRoute
          path={`${basePath}/account-management`}
          component={ChangeLoginEmailContainer}
        />
      </WrappingRoute>
    </>
  );
}
