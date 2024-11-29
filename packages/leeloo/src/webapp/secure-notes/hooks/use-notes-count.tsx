import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
export const useNotesCount = (): number | null => {
  const { currentSpaceId } = useTeamSpaceContext();
  const secureNoteData = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.SecureNote],
    propertyFilters:
      currentSpaceId !== null
        ? [
            {
              property: "spaceId",
              value: currentSpaceId,
            },
          ]
        : undefined,
  });
  return secureNoteData.status === DataStatus.Success
    ? secureNoteData.data?.secureNotesResult.matchCount
    : null;
};
