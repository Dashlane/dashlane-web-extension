import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import {
  ImportPersonalDataRequest,
  ImportPersonalDataResult,
  ImportPersonalDataState,
  PreviewPersonalDataRequest,
  PreviewPersonalDataResult,
} from "./types";
export const importQueriesSlots = {
  getImportPersonalDataStatus: slot<void, ImportPersonalDataState>(),
};
export const importLiveQueriesSlots = {
  liveImportPersonalDataStatus: liveSlot<ImportPersonalDataState>(),
};
export const importCommandsSlots = {
  importPersonalData: slot<
    ImportPersonalDataRequest,
    ImportPersonalDataResult
  >(),
  previewPersonalData: slot<
    PreviewPersonalDataRequest,
    PreviewPersonalDataResult
  >(),
  dismissPersonalDataImportNotifications: slot<void, void>(),
};
