import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CommandError } from "../../common";
export interface DeleteCollectionCommandParam {
  id: string;
  name?: string;
}
export class DeleteCollectionCommand extends defineCommand<
  DeleteCollectionCommandParam,
  undefined,
  CommandError
>({
  scope: UseCaseScope.User,
}) {}
