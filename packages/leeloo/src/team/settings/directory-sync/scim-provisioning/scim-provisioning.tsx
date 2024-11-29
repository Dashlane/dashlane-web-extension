import { useEffect, useState } from "react";
import { GridContainer } from "@dashlane/ui-components";
import {
  IndeterminateLoader,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { TeamSettings } from "@dashlane/communication";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useFeatureFlip } from "@dashlane/framework-react";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { Route, Switch, useRouteMatch } from "../../../../libs/router";
import { ResponsiveMainSecondaryLayout } from "../../components/layout/responsive-main-secondary-layout";
import { useEncryptionServiceConfig } from "../../hooks/useEncryptionServiceConfig";
import { ContactUsSideContent } from "../../scim-sso-infoboxes/contact-us-side-item-sso-scim-card";
import { ContactSupportDialog } from "../../../page/support/contact-support-dialog";
import { useBuyOrUpgradePaywallDetails } from "../../../helpers/use-buy-or-upgrade-paywall-details";
import { EncryptionService } from "../../encryption-service/encryption-service";
import { EncryptionServiceSetup } from "../../encryption-service/encryption-service-setup";
import { RestartEncryptionServiceInfobox } from "../../encryption-service/restart-es-infobox";
import { SCIMInfobox } from "../../scim-sso-infoboxes/scim-infobox";
import { ScimSetup } from "./scimSetup";
import { ScimSetupForm } from "./scim-setup-form";
import { SetupAndInviteLinkGuideInfo } from "./setup-and-invite-link-guide-info";
import { BackPageLayout } from "../../components/layout/back-page-layout";
export const encryptionServiceSubPath = `/encryption-service-settings`;
export const scimSettingsSubPath = `/scim-settings`;
const I18N_KEYS = {
  SSO_MIGRATION_INFOBOX_TITLE: "team_settings_es_sso_migration_infobox_title",
  SSO_MIGRATION_INFOBOX_BODY: "team_settings_es_sso_migration_infobox_body",
  AD_SYNC_WARNING_HEADING:
    "team_settings_encryption_service_scim_setup_ad_sync_warning_heading",
  AD_SYNC_WARNING_DESCRIPTION:
    "team_settings_encryption_service_scim_setup_ad_sync_warning_description",
};
export const ScimProvisioning = ({
  isScimEnabled,
  isScimCapable,
  teamSettings,
  updateTeamSettings,
  disableForm = false,
  adSyncEnabled,
  isSsoConnectorSetup,
}: {
  isScimEnabled: boolean | null;
  isScimCapable: boolean | null;
  teamSettings: TeamSettings;
  updateTeamSettings: (settings: TeamSettings) => Promise<void>;
  disableForm?: boolean;
  adSyncEnabled: boolean;
  isSsoConnectorSetup?: boolean;
}) => {
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  const openSupportDialog = () => setSupportDialogIsOpen(true);
  const { translate } = useTranslate();
  const { path } = useRouteMatch();
  const {
    esConfig,
    esConfigLoading: dataLoading,
    refreshEncryptionServiceConfig,
  } = useEncryptionServiceConfig();
  const forceSSOMigration = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.ItadminTacEncryptionserviceSSOmigrationReset
  );
  const migratingFromSSOConnector = Boolean(
    forceSSOMigration || (!dataLoading && isSsoConnectorSetup)
  );
  useEffect(() => {
    logPageView(PageView.TacSettingsDirectorySyncSelfHostedScim);
  }, []);
  const vpnPaywallInfo = useBuyOrUpgradePaywallDetails({
    hasBillingAccess: true,
  });
  if (!vpnPaywallInfo) {
    return null;
  }
  const { shouldShowBuyOrUpgradePaywall, planType, isTrialOrGracePeriod } =
    vpnPaywallInfo;
  const showPaywall =
    shouldShowBuyOrUpgradePaywall && planType !== SpaceTier.Business;
  return (
    <BackPageLayout title="Self-hosted SCIM">
      <ResponsiveMainSecondaryLayout
        mainContent={
          <GridContainer
            gridTemplateColumns="auto"
            gridAutoRows="min-content"
            gap="32px"
          >
            <Switch>
              <Route exact path={path}>
                {showPaywall ? (
                  <SCIMInfobox
                    isSCIMCapable={isScimCapable}
                    isTrialOrGracePeriod={isTrialOrGracePeriod}
                    showPaywall
                  />
                ) : (
                  <>
                    <RestartEncryptionServiceInfobox />

                    <SCIMInfobox isSCIMCapable={isScimCapable} />
                    {adSyncEnabled ? (
                      <Infobox
                        size="medium"
                        mood="neutral"
                        title={translate(I18N_KEYS.AD_SYNC_WARNING_HEADING)}
                        description={translate(
                          I18N_KEYS.AD_SYNC_WARNING_DESCRIPTION
                        )}
                      />
                    ) : null}

                    {migratingFromSSOConnector ? (
                      <Infobox
                        size="medium"
                        mood="brand"
                        title={translate(I18N_KEYS.SSO_MIGRATION_INFOBOX_TITLE)}
                        description={
                          <Paragraph>
                            {translate(I18N_KEYS.SSO_MIGRATION_INFOBOX_BODY)}
                          </Paragraph>
                        }
                      />
                    ) : null}

                    <EncryptionServiceSetup
                      parentPath={path}
                      loading={dataLoading || isScimCapable === null}
                      esConfig={esConfig}
                      disableSetupButton={
                        isScimCapable === false || disableForm
                      }
                    />
                    <ScimSetup
                      teamSettings={teamSettings}
                      parentPath={path}
                      loading={dataLoading || isScimCapable === null}
                      esConfig={esConfig}
                      isScimCapable={isScimCapable === true}
                      disableSetupButton={disableForm}
                    />
                  </>
                )}

                {supportDialogIsOpen ? (
                  <ContactSupportDialog
                    onDismiss={() => setSupportDialogIsOpen(false)}
                  />
                ) : null}
              </Route>
              <Route path={`${path}${encryptionServiceSubPath}`}>
                {dataLoading ? (
                  <IndeterminateLoader mood="brand" />
                ) : (
                  <EncryptionService
                    migratingFromSSOConnector={migratingFromSSOConnector}
                    onSave={() => refreshEncryptionServiceConfig()}
                    teamSettings={teamSettings}
                    updateTeamSettings={updateTeamSettings}
                    esConfig={esConfig}
                    isSettingupScim={true}
                  />
                )}
              </Route>
              <Route path={`${path}${scimSettingsSubPath}`}>
                <ScimSetupForm
                  config={esConfig}
                  esEndpoint={teamSettings?.ssoServiceProviderUrl}
                />
              </Route>
            </Switch>
          </GridContainer>
        }
        secondaryContent={
          showPaywall ? (
            <ContactUsSideContent openContactDialog={openSupportDialog} />
          ) : (
            <SetupAndInviteLinkGuideInfo isScimEnabled={isScimEnabled} />
          )
        }
      />
    </BackPageLayout>
  );
};
