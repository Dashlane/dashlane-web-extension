import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  SortDirection,
  vaultItemsCrudApi,
  VaultItemsCrudFeatureFlips,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
export const useIsPasskeysSidemenuEnabled = (): boolean => {
  const retrievedFeatureFlips = useFeatureFlips();
  const isPasskeysEnabled =
    retrievedFeatureFlips.status === DataStatus.Success &&
    (!!retrievedFeatureFlips.data[
      VaultItemsCrudFeatureFlips.PasskeysInVaultProd
    ] ||
      !!retrievedFeatureFlips.data[
        VaultItemsCrudFeatureFlips.PasskeysInVaultDev
      ]);
  const isEmptyStateBatch2Enabled =
    retrievedFeatureFlips.status === DataStatus.Success &&
    !!retrievedFeatureFlips.data[FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch2];
  const { data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Passkey],
    propertySorting: {
      property: "creationDatetime",
      direction: SortDirection.Descend,
    },
  });
  return Boolean(
    isEmptyStateBatch2Enabled ||
      (data?.passkeysResult.matchCount && isPasskeysEnabled)
  );
};
