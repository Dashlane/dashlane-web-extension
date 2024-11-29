import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
export const useGroupProvisioningStatus = () => {
  const {
    data: groupProvisioningConfiguration,
    status: groupProvisioningConfigurationStatus,
  } = useModuleQuery(confidentialSSOApi, "getGroupProvisioningConfiguration");
  if (groupProvisioningConfigurationStatus !== DataStatus.Success) {
    return {
      groupProvisioningConfiguration: null,
    };
  }
  return {
    groupProvisioningConfiguration,
  };
};
