import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CommandError } from "../../common";
import { VaultItemParam } from "./vault-item-param.types";
export type UpdateVaultItemCommandParam = VaultItemParam & {
  id: string;
  shouldSkipSync?: boolean;
};
export class UpdateVaultItemCommand extends defineCommand<
  UpdateVaultItemCommandParam,
  undefined,
  CommandError
>({
  scope: UseCaseScope.User,
}) {}
