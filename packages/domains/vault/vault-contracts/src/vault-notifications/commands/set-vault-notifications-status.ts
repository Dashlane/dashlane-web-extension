import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
type NotificationsName =
  | "isCollectionGuidedIntroEnabled"
  | "hasSeenFreeUserFrozenState";
export interface SetVaultNotificationsStatusCommandParam {
  notificationName: NotificationsName;
  isEnabled: boolean;
}
export class SetVaultNotificationsStatusCommand extends defineCommand<SetVaultNotificationsStatusCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
