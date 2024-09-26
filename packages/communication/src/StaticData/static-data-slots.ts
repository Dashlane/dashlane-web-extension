import { slot } from "ts-event-bus";
import { Banks, CallingCodes, GetBanksRequest, GetBanksResult } from "./types";
export const staticDataQueriesSlots = {
  getAllBanks: slot<void, Banks>(),
  getAllCallingCodes: slot<void, CallingCodes>(),
  getBanks: slot<GetBanksRequest, GetBanksResult>(),
  getSecureDocumentsExtensionsList: slot<void, string[]>(),
};
