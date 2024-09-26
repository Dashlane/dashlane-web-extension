import { Credential, Note, Secret } from "@dashlane/communication";
import { StoreService } from "Store";
import {
  ChangeHistory,
  getUpdatedItemChangeHistory,
} from "DataManagement/ChangeHistory/";
import { platformInfoSelector } from "Authentication/selectors";
import { userLoginSelector } from "Session/selectors";
import { personalDataSelector } from "DataManagement/PersonalData/selectors";
import { makeRemovalChange } from "DataManagement/ChangeHistory/change";
export function getRemoveChangeHistory(
  storeService: StoreService,
  deletedItem: Credential | Note | Secret
): ChangeHistory {
  const state = storeService.getState();
  const personalData = personalDataSelector(state);
  const platformInfo = platformInfoSelector(state);
  const userLogin = userLoginSelector(state);
  const { localSettings } = storeService.getState().userSession;
  const deviceName = localSettings.deviceName;
  const change = makeRemovalChange(deletedItem);
  return getUpdatedItemChangeHistory({
    change,
    deviceName,
    personalData,
    userLogin,
    platformInfo,
  });
}
