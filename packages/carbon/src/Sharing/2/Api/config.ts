import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { SharingQueries } from "Sharing/2/Api/queries";
import { SharingLiveQueries } from "Sharing/2/Api/live-queries";
import { myAcceptedUserGroupsSelector } from "Sharing/2/Services/selectors";
import { sortedSharedItemIdsSelector } from "Sharing/2/Services/selectors/sorted-shared-item-ids.selector";
import { sharingCapacitySelector } from "Sharing/2/Services/selectors/sharing-capacity.selector";
import {
  allSharedItemIds$,
  myAcceptedUserGroups$,
  sharingCapacity$,
} from "Sharing/2/Services/live";
import { config as UserGroupBusConfig } from "Sharing/2/UserGroup/Api/config";
import { config as SharingUserBusConfig } from "Sharing/2/SharingUser/Api/config";
import { shareItem } from "../handlers/share-item";
import { convertItemToDashlaneXmlHandler } from "../handlers/convert-item-to-dashlane-xml";
import { SharingCommands } from "./commands";
import { convertDashlaneXmlToItem } from "../handlers/convert-dashlane-xml-to-item";
import { saveSharedItemsToVault } from "../handlers/save-shared-items-to-vault";
export const config: CommandQueryBusConfig<
  SharingCommands,
  SharingQueries,
  SharingLiveQueries
> = {
  commands: {
    convertItemToDashlaneXml: { handler: convertItemToDashlaneXmlHandler },
    convertDashlaneXmlToItem: { handler: convertDashlaneXmlToItem },
    shareItem: { handler: shareItem },
    saveSharedItemsToVault: { handler: saveSharedItemsToVault },
  },
  queries: {
    getAllSharedItemIds: { selector: sortedSharedItemIdsSelector },
    getMyAcceptedUserGroups: { selector: myAcceptedUserGroupsSelector },
    getSharingCapacity: {
      selector: sharingCapacitySelector,
    },
    ...UserGroupBusConfig.queries,
    ...SharingUserBusConfig.queries,
  },
  liveQueries: {
    liveAllSharedItemIds: { operator: allSharedItemIds$ },
    liveMyAcceptedUserGroups: { operator: myAcceptedUserGroups$ },
    liveSharingCapacity: { operator: sharingCapacity$ },
    ...UserGroupBusConfig.liveQueries,
    ...SharingUserBusConfig.liveQueries,
  },
};
