import { defineEvent, UseCaseScope } from "@dashlane/framework-contracts";
import { VaultItemType } from "../types";
export interface BaseEventPayload {
  ids: string[];
  vaultItemType: VaultItemType;
}
export class BaseEvent extends defineEvent<BaseEventPayload>({
  scope: UseCaseScope.User,
}) {}
