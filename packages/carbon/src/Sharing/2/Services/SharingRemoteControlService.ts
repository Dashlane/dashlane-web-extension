import { firstValueFrom } from "rxjs";
import {
  getFailure,
  getSuccess,
  isFailure,
  safeCast,
} from "@dashlane/framework-types";
import { ApplicationModulesAccess } from "@dashlane/communication";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import { StoreService } from "Store";
import { TeamSpaceContentControlDone } from "EventBus";
import { sendExceptionLog } from "Logs/Exception";
import { pickBestTeamSpaceForForcedCategorizationForSharedItem } from "DataManagement/SmartTeamSpaces/forced-categorization.domain";
import { spacesWithForcedCategorizationEnabledSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { TeamDomainsMatchResult } from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
const hasVaultChanges = ({
  deletedItemIds,
  updatedItemIds,
}: TeamSpaceContentControlDone) => {
  return deletedItemIds.length > 0 || updatedItemIds.length > 0;
};
type ApplicationModulesAccessClients = ReturnType<
  ApplicationModulesAccess["createClients"]
>;
type SharingInvitesApi = ApplicationModulesAccessClients["sharingInvites"];
type SharingItemsApi = ApplicationModulesAccessClients["sharingItems"];
const findMyPendingInvitesToRefuse = async (
  storeService: StoreService,
  sharingInvitesApi: SharingInvitesApi
) => {
  const allPendingInvitesResult = await firstValueFrom(
    sharingInvitesApi.queries.getInvites()
  );
  if (isFailure(allPendingInvitesResult)) {
    throw new Error(
      `Failiure in findMyPendingInvitesToRefuse: ${getFailure(
        allPendingInvitesResult
      )}`
    );
  }
  const spaces = spacesWithForcedCategorizationEnabledSelector(
    storeService.getState()
  );
  return getSuccess(allPendingInvitesResult).pendingSharedItems.reduce(
    (pendingItemIds, item) => {
      if (item.itemType !== ShareableItemType.Credential) {
        return pendingItemIds;
      }
      const teamSpaces = spaces.map((s) => s.details);
      const pick = pickBestTeamSpaceForForcedCategorizationForSharedItem(
        teamSpaces,
        item
      );
      if (
        Boolean(pick) &&
        pick.domainsMatchResult === TeamDomainsMatchResult.SomeFieldsMatch
      ) {
        pendingItemIds.push(item.sharedItemId);
      }
      return pendingItemIds;
    },
    safeCast<string[]>([])
  );
};
export async function revokeRemoteControlledSharedItems(
  storeService: StoreService,
  sharingItemsApi: SharingItemsApi,
  sharingInvitesApi: SharingInvitesApi,
  initiatingEvent: TeamSpaceContentControlDone
): Promise<void> {
  try {
    const { hiddenItemIds } = initiatingEvent;
    const {
      commands: { remoteControlSharedItems },
    } = sharingItemsApi;
    const pendingInvitesIds = await findMyPendingInvitesToRefuse(
      storeService,
      sharingInvitesApi
    );
    await remoteControlSharedItems({
      vaultItemIds: hiddenItemIds,
      pendingInvitesIds,
      shouldRunSync: hasVaultChanges(initiatingEvent),
    });
  } catch (error) {
    const message = `[SharingRemoteControl] - revokeRemoteControlledSharedItems: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
  }
}
