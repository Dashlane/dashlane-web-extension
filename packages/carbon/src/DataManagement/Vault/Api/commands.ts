import type {
  DeleteVaultModuleItemParam,
  DeleteVaultModuleItemResponse,
  DeleteVaultModuleItemsBulkParam,
  DeleteVaultModuleItemsBulkResponse,
} from "@dashlane/communication";
import type { Command } from "Shared/Api";
export type VaultCommands = {
  deleteVaultModuleItem: Command<
    DeleteVaultModuleItemParam,
    DeleteVaultModuleItemResponse
  >;
  deleteVaultModuleItemsBulk: Command<
    DeleteVaultModuleItemsBulkParam,
    DeleteVaultModuleItemsBulkResponse
  >;
  disableVaultItemProtection: Command<string, void>;
};
