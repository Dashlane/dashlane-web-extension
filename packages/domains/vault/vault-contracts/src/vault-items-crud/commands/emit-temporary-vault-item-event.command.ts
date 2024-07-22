import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export enum EventType {
  Deleted = "deleted",
  Updated = "updated",
  Created = "created",
}
export interface EmitTemporaryVaultItemEventCommandParam {
  ids: string[];
  eventType: EventType;
}
export class EmitTemporaryVaultItemEventCommand extends defineCommand<EmitTemporaryVaultItemEventCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
