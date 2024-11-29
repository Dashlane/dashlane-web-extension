import { IndeterminateLoader } from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  confidentialSSOApi,
  ProvisioningSolution,
  scimApi,
  SsoSolution,
  SsoStatus,
} from "@dashlane/sso-scim-contracts";
import { GridContainer } from "@dashlane/ui-components";
import { CustomRoute, Switch, useRouteMatch } from "../../../libs/router";
import { useAccountInfo } from "../../../libs/carbon/hooks/useAccountInfo";
import activeDirectorySettingsReducer from "./active-directory/reducer";
import { ActiveDirectorySettings } from "./active-directory/active-directory";
import { ScimProvisioning } from "./scim-provisioning/scim-provisioning";
import { useTeamSpaceContext } from "../components/TeamSpaceContext";
import { useEncryptionServiceConfig } from "../hooks/useEncryptionServiceConfig";
import { useTeamSettings } from "../hooks/useTeamSettings";
import { useTeamDeviceConfig } from "../hooks/useTeamDeviceConfig";
import { DirectorySyncLandingPage } from "./directory-sync-landing-page";
import { ConfidentialSCIM } from "./confidential-scim";
export const TeamScimRoutes = {
  SELF_HOSTED_SCIM: "/scim-provisioning",
  CONFIDENTIAL_SCIM: "/confidential-scim",
  ACTIVE_DIRECTORY: "/active-directory",
};
export const DirectorySync = () => {
  const { path } = useRouteMatch();
  const { esConfig, esConfigLoading } = useEncryptionServiceConfig();
  const { teamDeviceConfig } = useTeamDeviceConfig({
    draft: false,
    deviceAccessKey: esConfig?.deviceAccessKey,
  });
  const { teamId } = useTeamSpaceContext();
  const {
    teamSettings = {},
    teamSettingsLoading,
    updateTeamSettings,
    teamCapabilities,
  } = useTeamSettings(teamId);
  const accountInfo = useAccountInfo();
  const adSyncEnabled =
    !teamSettingsLoading && teamSettings.activeDirectorySyncType;
  const scimEnabled = teamDeviceConfig?.configProperties.scimEnabled;
  const isAdSyncCapable = teamCapabilities?.activeDirectorySync.enabled ?? null;
  const { data: ssoState } = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  const ssoSolution = ssoState?.ssoSolution;
  const { data: provisioningSolution, status: provisioningSolutionStatus } =
    useModuleQuery(scimApi, "provisioningSolution");
  const isSelfHostedDisabled =
    ssoSolution === SsoSolution.enum.confidentialSaml ||
    ssoSolution === SsoSolution.enum.ssoConnector ||
    provisioningSolution === ProvisioningSolution.enum.confidentialScim ||
    provisioningSolution === ProvisioningSolution.enum.adSync;
  const isConfidentialDisabled =
    ssoSolution === SsoSolution.enum.selfHostedSaml ||
    ssoSolution === SsoSolution.enum.ssoConnector ||
    provisioningSolution === ProvisioningSolution.enum.selfHostedScim ||
    provisioningSolution === ProvisioningSolution.enum.adSync;
  const isNitroInProgress =
    ssoSolution === SsoSolution.enum.confidentialSaml &&
    ssoState?.ssoStatus === SsoStatus.enum.incomplete;
  const disableAdSyncForm = (scimEnabled && !adSyncEnabled) || !isAdSyncCapable;
  const disableScimForm = isNitroInProgress || (adSyncEnabled && !scimEnabled);
  const dataLoading =
    teamSettingsLoading ||
    esConfigLoading ||
    !accountInfo ||
    ssoSolution === undefined ||
    provisioningSolutionStatus === DataStatus.Loading;
  const isSsoConnectorSetup = ssoSolution === SsoSolution.enum.ssoConnector;
  return (
    <GridContainer
      gridTemplateColumns="auto"
      gridTemplateRows="auto 1fr"
      fullWidth
      sx={{ height: "100%" }}
    >
      {dataLoading ? (
        <GridContainer justifyItems="center">
          <IndeterminateLoader size={75} sx={{ marginTop: "20vh" }} />
        </GridContainer>
      ) : (
        <Switch>
          <CustomRoute
            exact
            path={path}
            component={DirectorySyncLandingPage}
            permission={(p) =>
              p.adminAccess.hasFullAccess || p.adminAccess.hasBillingAccess
            }
            additionalProps={{
              ssoSolution,
              ssoStatus: ssoState?.ssoStatus,
              provisioningSolution,
              isLoading: dataLoading,
            }}
          />
          <CustomRoute
            exact
            path={`${path}${TeamScimRoutes.CONFIDENTIAL_SCIM}`}
            component={ConfidentialSCIM}
            redirectPath={path}
            permission={(p) =>
              !isConfidentialDisabled &&
              (p.adminAccess.hasFullAccess || p.adminAccess.hasBillingAccess)
            }
          />
          <CustomRoute
            path={`${path}${TeamScimRoutes.SELF_HOSTED_SCIM}`}
            component={ScimProvisioning}
            additionalProps={{
              isScimEnabled: scimEnabled ?? null,
              isScimCapable: teamCapabilities?.scim.enabled ?? null,
              teamSettings,
              updateTeamSettings,
              disableForm: disableScimForm,
              adSyncEnabled,
              isSsoConnectorSetup,
            }}
            permission={(p) =>
              !isSelfHostedDisabled &&
              (p.adminAccess.hasFullAccess || p.adminAccess.hasBillingAccess)
            }
            redirectPath={path}
          />
          <CustomRoute
            path={`${path}${TeamScimRoutes.ACTIVE_DIRECTORY}`}
            component={ActiveDirectorySettings}
            additionalProps={{
              isAdSyncCapable,
              disableForm: disableAdSyncForm,
              adSyncEnabled,
              accountInfo,
            }}
            reducer={activeDirectorySettingsReducer}
          />
        </Switch>
      )}
    </GridContainer>
  );
};
