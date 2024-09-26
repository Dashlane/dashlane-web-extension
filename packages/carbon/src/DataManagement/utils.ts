export const nextTick = require("next-tick");
import { DataModelObject, DataModelType } from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { SyncDebounceFunction } from "DataManagement/types";
import { debounce } from "Helpers/debounce";
import { Debugger } from "Logs/Debugger";
import { reportDataUpdate } from "Session/SessionCommunication";
import dataTypes from "Session/Store/personalData/dataTypes";
import { PersonalData } from "Session/Store/personalData/types";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
import { isPersonalSpaceEnabledSelector } from "../Team/selectors";
import { PERSONAL_SPACE_ID } from "./Spaces/constants";
import { activeSpacesSelector } from "./Spaces/selectors";
export const WAIT_MS_BEFORE_SYNC = 60 * 1000;
function informClientsAndSyncPersonalDataChange(
  storeService: StoreService,
  sessionService: SessionService,
  syncTrigger: Trigger
): void {
  reportDataUpdate(storeService);
  nextTick(() => {
    sessionService.getInstance().user.attemptSync(syncTrigger);
  });
}
export const getDebounceSync = (
  storeService: StoreService,
  sessionService: SessionService
): SyncDebounceFunction => {
  return debounce((syncTrigger: Trigger) => {
    Debugger.log(
      "DebounceSync called => informClientsAndSyncPersonalDataChange()"
    );
    informClientsAndSyncPersonalDataChange(
      storeService,
      sessionService,
      syncTrigger
    );
  }, WAIT_MS_BEFORE_SYNC);
};
export const getCurrentItems = (
  type: DataModelType,
  personalData: PersonalData
): DataModelObject[] => {
  const storeName = dataTypes[type];
  return personalData?.[storeName] || [];
};
export const getDefaultSpaceId = (storeService: StoreService): string => {
  const state = storeService.getState();
  const activeSpace = activeSpacesSelector(state)[0];
  const defaultSpaceId = isPersonalSpaceEnabledSelector(state)
    ? PERSONAL_SPACE_ID
    : activeSpace.teamId;
  return defaultSpaceId;
};
