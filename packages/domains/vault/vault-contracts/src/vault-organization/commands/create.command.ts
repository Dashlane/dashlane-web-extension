import {
  CommandSuccess,
  defineCommand,
  UseCaseScope,
} from "@dashlane/framework-contracts";
import { CommandError } from "../../common";
import { BaseCollectionVaultItem } from "../types/collection.types";
export interface CreateCommandParam {
  content: {
    name: string;
    id?: string;
    spaceId?: string;
    vaultItems?: BaseCollectionVaultItem[];
  };
}
export class CreateCollectionCommand extends defineCommand<
  CreateCommandParam,
  CommandSuccess,
  CommandError
>({
  scope: UseCaseScope.User,
}) {}
