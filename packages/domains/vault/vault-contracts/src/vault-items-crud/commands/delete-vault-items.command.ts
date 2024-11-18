import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CommandError } from "../../common";
import { VaultItemType } from "../types";
export interface DeleteVaultItemsCommandParam {
  vaultItemType: VaultItemType;
  ids: string[];
  ignoreSharing?: boolean;
}
interface DeleteVaultItemsCommandError extends CommandError {
  failedDeletionIds: string[];
}
export class DeleteVaultItemsCommand extends defineCommand<
  DeleteVaultItemsCommandParam,
  undefined,
  DeleteVaultItemsCommandError
>({
  scope: UseCaseScope.User,
}) {}
