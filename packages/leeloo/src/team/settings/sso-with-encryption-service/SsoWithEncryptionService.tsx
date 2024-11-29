import {
  confidentialSSOApi,
  SsoSolution,
  SsoStatus,
} from "@dashlane/sso-scim-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { SsoSetupStep } from "@dashlane/hermes";
import { GridContainer } from "@dashlane/ui-components";
import { IndeterminateLoader, Infobox } from "@dashlane/design-system";
import { redirect, Route, Switch, useRouteMatch } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { BackPageLayout } from "../components/layout/back-page-layout";
import { LinkCard, LinkType } from "../components/layout/link-card";
import { ResponsiveMainSecondaryLayout } from "../components/layout/responsive-main-secondary-layout";
import { useEncryptionServiceConfig } from "../hooks/useEncryptionServiceConfig";
import { logSelfHostedSSOSetupStep } from "../sso-setup-logs";
import { useTeamSpaceContext } from "../components/TeamSpaceContext";
import { EncryptionService } from "../encryption-service/encryption-service";
import { EncryptionServiceSetup } from "../encryption-service/encryption-service-setup";
import { RestartEncryptionServiceInfobox } from "../encryption-service/restart-es-infobox";
import { PageContext, SsoInfobox } from "../scim-sso-infoboxes/sso-infobox";
import { useTeamSettings } from "../hooks/useTeamSettings";
import { SsoSetupForm } from "./SsoSetupForm";
import { SsoSetup } from "./SsoSetup";
const SETUP_GUIDE_HREF = "__REDACTED__";
const I18N_KEYS = {
  TITLE: "team_settings_es_sso_title",
  SETUP_GUIDE_HEADING: "team_settings_es_sso_setup_guide_heading",
  SETUP_GUIDE_DESCRIPTION: "team_settings_es_sso_setup_guide_description",
  SETUP_GUIDE_LINK: "team_settings_es_sso_setup_guide_link_text",
  SSO_HEADER: "team_settings_es_sso_setup_header",
  SSO_DESCRIPTION: "team_settings_es_sso_setup_description",
  CONFIGURE_ES_TOOLTIP: "team_settings_es_sso_setup_configure_es_tooltip",
  BUTTON_CANCEL: "team_settings_encryption_service_button_cancel",
  BUTTON_SAVE_CHANGES: "team_settings_encryption_service_button_save_changes",
  SSO_MIGRATION_INFOBOX_TITLE: "team_settings_es_sso_migration_infobox_title",
  SSO_MIGRATION_INFOBOX_BODY: "team_settings_es_sso_migration_infobox_body",
};
export const encryptionServiceSubPath = `/encryption-service-settings`;
export const ssoSettingsSubPath = `/sso-settings`;
export const SsoWithEncryptionService = ({
  backRoute,
}: {
  backRoute: string;
}) => {
  const { translate } = useTranslate();
  const { path } = useRouteMatch();
  const { esConfig, esConfigLoading, refreshEncryptionServiceConfig } =
    useEncryptionServiceConfig();
  const { teamId } = useTeamSpaceContext();
  const { teamSettings, updateTeamSettings, teamSettingsLoading } =
    useTeamSettings(teamId);
  const { status: ssoStateStatus, data: ssoState } = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  if (ssoStateStatus !== DataStatus.Success) {
    return null;
  }
  const {
    ssoSolution,
    ssoStatus,
    global: { ssoCapable },
    enableSSO: { ssoEnabled },
  } = ssoState;
  const isNitroInProgress =
    ssoSolution === SsoSolution.enum.confidentialSaml &&
    ssoStatus === SsoStatus.enum.incomplete;
  const showBackButton = !ssoEnabled;
  const migratingFromSSOConnector =
    ssoSolution === SsoSolution.enum.ssoConnector;
  const onBackClicked = () => {
    logSelfHostedSSOSetupStep({
      ssoSetupStep: SsoSetupStep.ReturnToSsoSelection,
    });
    redirect(backRoute);
  };
  return (
    <BackPageLayout
      title={translate(I18N_KEYS.TITLE)}
      onBackClicked={onBackClicked}
      showBackButton={showBackButton}
    >
      <ResponsiveMainSecondaryLayout
        mainContent={
          <GridContainer
            gridTemplateColumns="auto"
            gridAutoRows="min-content"
            gap="32px"
          >
            <Switch>
              <Route exact path={path}>
                <SsoInfobox
                  pageContext={PageContext.SelfHosted}
                  onSetupClear={() =>
                    updateTeamSettings({ ssoServiceProviderUrl: null })
                  }
                />
                <RestartEncryptionServiceInfobox />

                {migratingFromSSOConnector ? (
                  <Infobox
                    title={translate(I18N_KEYS.SSO_MIGRATION_INFOBOX_TITLE)}
                    description={translate(
                      I18N_KEYS.SSO_MIGRATION_INFOBOX_BODY
                    )}
                  />
                ) : null}

                <EncryptionServiceSetup
                  loading={esConfigLoading || ssoCapable === null}
                  esConfig={esConfig}
                  parentPath={path}
                  disableSetupButton={!ssoCapable || isNitroInProgress}
                />
                <SsoSetup
                  isSsoCapable={ssoCapable}
                  disableSetupButton={!ssoCapable || !esConfig?.config}
                />
              </Route>
              <Route path={`${path}${encryptionServiceSubPath}`}>
                {esConfigLoading || teamSettingsLoading ? (
                  <IndeterminateLoader />
                ) : (
                  <EncryptionService
                    migratingFromSSOConnector={migratingFromSSOConnector}
                    onSave={() => refreshEncryptionServiceConfig()}
                    teamSettings={teamSettings}
                    updateTeamSettings={updateTeamSettings}
                    esConfig={esConfig}
                  />
                )}
              </Route>
              <Route path={`${path}${ssoSettingsSubPath}`}>
                <SsoSetupForm />
              </Route>
            </Switch>
          </GridContainer>
        }
        secondaryContent={
          <LinkCard
            description={translate(I18N_KEYS.SETUP_GUIDE_DESCRIPTION)}
            heading={translate(I18N_KEYS.SETUP_GUIDE_HEADING)}
            linkText={translate(I18N_KEYS.SETUP_GUIDE_LINK)}
            linkProps={{
              linkType: LinkType.ExternalLink,
              linkHref: SETUP_GUIDE_HREF,
            }}
          />
        }
      />
    </BackPageLayout>
  );
};
