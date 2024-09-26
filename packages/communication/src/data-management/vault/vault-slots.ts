import { slot } from "ts-event-bus";
import type {
  DeleteVaultModuleItemParam,
  DeleteVaultModuleItemResponse,
  DeleteVaultModuleItemsBulkParam,
  DeleteVaultModuleItemsBulkResponse,
} from "./types";
export const vaultQueriesSlots = {};
export const vaultCommandsSlots = {
  deleteVaultModuleItem: slot<
    DeleteVaultModuleItemParam,
    DeleteVaultModuleItemResponse
  >(),
  deleteVaultModuleItemsBulk: slot<
    DeleteVaultModuleItemsBulkParam,
    DeleteVaultModuleItemsBulkResponse
  >(),
  disableVaultItemProtection: slot<string, void>(),
};
