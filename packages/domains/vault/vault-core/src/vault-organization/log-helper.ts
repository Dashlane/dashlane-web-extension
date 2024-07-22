import { Client } from "@dashlane/framework-contracts";
import { CollectionAction, UserUpdateCollectionEvent } from "@dashlane/hermes";
import { CarbonModuleApi } from "@dashlane/communication";
export function sendUserUpdateCollectionEvent(
  client: Client<CarbonModuleApi["commands"], CarbonModuleApi["queries"]>,
  collectionAction: CollectionAction,
  collectionId: string,
  collectionItemsCount: number
) {
  const event = new UserUpdateCollectionEvent({
    collectionId,
    action: collectionAction,
    itemCount: collectionItemsCount,
    isShared: false,
  });
  return client.commands.carbon({
    name: "logEvent",
    args: [{ event }],
  });
}
