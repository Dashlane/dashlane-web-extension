import { IndeterminateLoader } from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import { confidentialSSOApi, scimApi } from "@dashlane/sso-scim-contracts";
import { siemApi } from "@dashlane/risk-monitoring-contracts";
import { useTeamCapabilities } from "../../team/settings/hooks/use-team-capabilities";
import { IntegrationCardMassDeploy } from "./components/integration-card-mass-deploy";
import { IntegrationsSIEM } from "./integrations-siem";
import { IntegrationsSSO } from "./integrations-sso";
import { IntegrationsScim } from "./integrations-scim";
import { IntegrationsHeader } from "./integrations-header";
import { IntegrationsReset } from "./integrations-reset";
export const Integrations = () => {
  const teamCapabilities = useTeamCapabilities();
  const nitroState = useModuleQuery(confidentialSSOApi, "ssoProvisioning");
  const { data: provisioningSolution, status: provisioningSolutionStatus } =
    useModuleQuery(scimApi, "provisioningSolution");
  const { data: siemConfiguration, status: siemConfigurationStatus } =
    useModuleQuery(siemApi, "getSiemConfiguration");
  const showConfidentialReset = useFeatureFlip(
    "setup_rollout_reset_confidential_button"
  );
  const isCapable = teamCapabilities?.scim.enabled ?? true;
  if (
    nitroState.status !== DataStatus.Success ||
    provisioningSolutionStatus !== DataStatus.Success ||
    siemConfigurationStatus !== DataStatus.Success
  ) {
    return (
      <div sx={{ display: "flex", justifyContent: "center" }}>
        <IndeterminateLoader size={75} />
      </div>
    );
  }
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "32px",
      }}
    >
      <IntegrationsHeader />
      {showConfidentialReset ? <IntegrationsReset /> : null}
      <IntegrationsSSO
        ssoSolution={nitroState.data?.ssoSolution}
        ssoStatus={nitroState.data?.ssoStatus}
        provisioningSolution={provisioningSolution}
        isCapable={isCapable}
      />
      <IntegrationsScim
        ssoSolution={nitroState.data?.ssoSolution}
        ssoStatus={nitroState.data?.ssoStatus}
        provisioningSolution={provisioningSolution}
        isCapable={isCapable}
      />
      <IntegrationCardMassDeploy />
      <IntegrationsSIEM
        active={siemConfiguration?.active}
        ssoSolution={nitroState.data?.ssoSolution}
      />
    </div>
  );
};
