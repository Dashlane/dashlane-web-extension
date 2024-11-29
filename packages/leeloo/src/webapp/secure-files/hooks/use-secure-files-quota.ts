import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useModuleQuery } from "@dashlane/framework-react";
import { secureFilesApi, SecureFilesQuota } from "@dashlane/vault-contracts";
export function useSecureFilesQuota(): SecureFilesQuota {
  const secureFilesQuota = useModuleQuery(secureFilesApi, "getSecureFileQuota");
  return secureFilesQuota.status === DataStatus.Success
    ? secureFilesQuota.data
    : {
        max: 0,
        remaining: 0,
      };
}
