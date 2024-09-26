import {
  DuplicateVaultItemRequest,
  DuplicateVaultItemResponse,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type DuplicationCommands = {
  duplicateVaultItem: Command<
    DuplicateVaultItemRequest,
    DuplicateVaultItemResponse
  >;
};
