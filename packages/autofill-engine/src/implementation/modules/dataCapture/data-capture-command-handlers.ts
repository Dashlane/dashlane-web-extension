import { captureDataFromPageHandler } from "./capture-data-from-page-handler";
import { notifyLiveValuesUpdateHandler } from "./notify-live-values-update-handler";
import { findSavePasswordTargetCredentialHandler } from "./find-save-password-target-credential-handler";
import { HandlersForModuleCommands } from "../../commands/handlers";
import { savePersonalDataHandler } from "./save-personal-data-handler";
import {
  saveCredentialHandler,
  updateCredentialHandler,
} from "./save-or-update-credential-handler";
import { cancelSaveCredentialHandler } from "./cancel-save-credential-handler";
export const DataCaptureCommandHandlers: HandlersForModuleCommands<
  | "captureDataFromPage"
  | "notifyLiveValuesUpdate"
  | "findSavePasswordTargetCredential"
  | "savePersonalData"
  | "saveCredential"
  | "updateCredential"
  | "cancelSaveCredential"
> = {
  savePersonalData: savePersonalDataHandler,
  findSavePasswordTargetCredential: findSavePasswordTargetCredentialHandler,
  captureDataFromPage: captureDataFromPageHandler,
  notifyLiveValuesUpdate: notifyLiveValuesUpdateHandler,
  saveCredential: saveCredentialHandler,
  updateCredential: updateCredentialHandler,
  cancelSaveCredential: cancelSaveCredentialHandler,
};
