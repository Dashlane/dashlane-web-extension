import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
type UseHasSharableItems =
  | {
      status: DataStatus.Loading | DataStatus.Error;
    }
  | {
      status: DataStatus.Success;
      hasSharableItems: boolean;
    };
export const useHasSharableItems = (): UseHasSharableItems => {
  const { data: vaultItemsData, status: vaultItemsStatus } = useModuleQuery(
    vaultItemsCrudApi,
    "query",
    {
      vaultItemTypes: [
        VaultItemType.Secret,
        VaultItemType.SecureNote,
        VaultItemType.Credential,
      ],
    }
  );
  if (vaultItemsStatus !== DataStatus.Success) {
    return {
      status: vaultItemsStatus,
    };
  }
  const { credentialsResult, secretsResult, secureNotesResult } =
    vaultItemsData;
  return {
    status: DataStatus.Success,
    hasSharableItems:
      [credentialsResult, secretsResult, secureNotesResult].reduce(
        (acc, result) => acc + result.matchCount,
        0
      ) > 0,
  };
};
