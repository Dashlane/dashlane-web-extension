import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CommandError } from "../../common";
import { BaseCollectionVaultItem } from "../types/collection.types";
export enum OperationType {
  SUBSTRACT_VAULT_ITEMS = "subtract_vault_items",
  APPEND_VAULT_ITEMS = "append_vault_items",
}
export interface CollectionUpdate {
  id?: string;
  name?: string;
  spaceId?: string;
  vaultItems?: BaseCollectionVaultItem[];
}
export interface UpdateCommandParam {
  id: string;
  collection: CollectionUpdate;
  operationType?: OperationType;
}
export class UpdateCollectionCommand extends defineCommand<
  UpdateCommandParam,
  undefined,
  CommandError
>({
  scope: UseCaseScope.User,
}) {}
