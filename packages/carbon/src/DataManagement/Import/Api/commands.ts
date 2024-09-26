import {
  ImportPersonalDataRequest,
  ImportPersonalDataResult,
  PreviewPersonalDataRequest,
  PreviewPersonalDataResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type ImportPersonalDataCommands = {
  importPersonalData: Command<
    ImportPersonalDataRequest,
    ImportPersonalDataResult
  >;
  previewPersonalData: Command<
    PreviewPersonalDataRequest,
    PreviewPersonalDataResult
  >;
  dismissPersonalDataImportNotifications: Command<void, void>;
};
