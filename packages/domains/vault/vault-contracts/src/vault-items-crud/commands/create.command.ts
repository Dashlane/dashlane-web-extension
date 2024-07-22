import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CommandError } from "../../common";
import { VaultItemParam } from "./vault-item-param.types";
interface CreateVaultItemResult {
  id: string;
}
export type CreateVaultItemParam = VaultItemParam & {
  shouldSkipSync?: boolean;
};
export class CreateVaultItemCommand extends defineCommand<
  CreateVaultItemParam,
  CreateVaultItemResult,
  CommandError
>({
  scope: UseCaseScope.User,
}) {}
