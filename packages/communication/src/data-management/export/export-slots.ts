import { slot } from "ts-event-bus";
import {
  GetPersonalDataExportRequest,
  GetPersonalDataExportResult,
} from "./types";
export const exportQueriesSlots = {
  getIsForcedDomainsEnabled: slot<void, boolean>(),
};
export const exportCommandsSlots = {
  getPersonalDataExport: slot<
    GetPersonalDataExportRequest,
    GetPersonalDataExportResult
  >(),
};
