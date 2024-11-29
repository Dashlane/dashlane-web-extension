import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  loggedOutMonitoringApi,
  type SupportedMassDeploymentBrowsers,
  type SupportedMassDeploymentOSs,
  type SupportedMassDeploymentSoftwares,
} from "@dashlane/risk-monitoring-contracts";
export type UseLOMoSetupInformationHookParams = {
  targetedMassDeploymentSoftware: SupportedMassDeploymentSoftwares;
  targetedMassDeploymentOS: SupportedMassDeploymentOSs;
  targetedMassDeploymentBrowsers: SupportedMassDeploymentBrowsers[];
};
export const useLOMoSetupInformation = (
  params: UseLOMoSetupInformationHookParams
) => {
  const { status, data } = useModuleQuery(
    loggedOutMonitoringApi,
    "getMassDeploymentSetupInformation",
    {
      targetedBrowsers: params.targetedMassDeploymentBrowsers,
      targetedMassDeploymentSoftware: params.targetedMassDeploymentSoftware,
      targetedOS: params.targetedMassDeploymentOS,
    }
  );
  if (status === DataStatus.Loading) {
    return {
      isLoading: true,
      isError: false,
    };
  }
  if (status === DataStatus.Error) {
    return {
      isLoading: false,
      isError: true,
    };
  }
  return {
    massDeploymentSetupInformation: data.massDeploymentSetupInformation,
    massDeploymentTeamKey: data.massDeploymentTeamKey,
    isLoading: false,
    isError: false,
  };
};
