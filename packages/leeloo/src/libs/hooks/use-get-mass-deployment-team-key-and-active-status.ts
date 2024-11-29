import { DataStatus, useModuleQueries } from "@dashlane/framework-react";
import {
  IntuneSetupInformationResult,
  loggedOutMonitoringApi,
} from "@dashlane/risk-monitoring-contracts";
type GetMassDeploymentTeamKeyResult =
  | {
      isLoading: true;
      hasError: false;
    }
  | {
      isLoading: false;
      hasError: true;
      errors: {
        teamKeyError?: string;
        configurationError?: string;
      };
    }
  | {
      isLoading: false;
      hasError: false;
      massDeploymentTeamKey: string | null;
      massDeploymentExtensionIDAndUpdateURL: string | null;
      active: boolean;
    };
export const useGetMassDeploymentTeamKeyAndActiveStatus =
  (): GetMassDeploymentTeamKeyResult => {
    const {
      getMassDeploymentSetupInformation,
      getMassDeploymentSecurityMonitoringConfiguration,
    } = useModuleQueries(
      loggedOutMonitoringApi,
      {
        getMassDeploymentSetupInformation: {
          queryParam: {
            targetedBrowsers: ["chrome"],
            targetedMassDeploymentSoftware: "microsoft-intune",
            targetedOS: "windows",
          },
        },
        getMassDeploymentSecurityMonitoringConfiguration: {},
      },
      []
    );
    const isLoading =
      getMassDeploymentSetupInformation.status === DataStatus.Loading ||
      getMassDeploymentSecurityMonitoringConfiguration.status ===
        DataStatus.Loading;
    const isError =
      getMassDeploymentSetupInformation.status === DataStatus.Error ||
      getMassDeploymentSecurityMonitoringConfiguration.status ===
        DataStatus.Error;
    if (isError) {
      return {
        isLoading: false,
        hasError: true,
        errors: {
          teamKeyError: "",
          configurationError:
            getMassDeploymentSecurityMonitoringConfiguration.error?.message,
        },
      };
    }
    if (isLoading) {
      return {
        isLoading: true,
        hasError: false,
      };
    }
    return {
      isLoading: false,
      hasError: false,
      massDeploymentTeamKey:
        getMassDeploymentSetupInformation.data.massDeploymentTeamKey ?? null,
      massDeploymentExtensionIDAndUpdateURL:
        (
          getMassDeploymentSetupInformation.data
            .massDeploymentSetupInformation as IntuneSetupInformationResult
        )?.massDeploymentExtensionIDsAndUpdateURLs.chrome ?? null,
      active: getMassDeploymentSecurityMonitoringConfiguration.data.active,
    };
  };
