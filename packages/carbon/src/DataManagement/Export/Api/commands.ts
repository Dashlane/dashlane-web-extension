import {
  GetPersonalDataExportRequest,
  GetPersonalDataExportResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type ExportCommands = {
  getPersonalDataExport: Command<
    GetPersonalDataExportRequest,
    GetPersonalDataExportResult
  >;
};
