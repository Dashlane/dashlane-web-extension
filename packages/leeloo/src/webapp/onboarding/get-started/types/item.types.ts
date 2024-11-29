import { DSJSX } from "@dashlane/design-system";
export enum ActionType {
  LINK = "link",
  TASK = "task",
}
export enum Link {
  SHARE_ITEM = "share-item",
}
export enum Task {
  INSTALL_EXTENSION = "install-extension",
  ADD_PASSWORD = "add-password",
  TRY_AUTOFILL = "try-autofill",
  OPEN_ADMIN_CONSOLE = "open-admin-console",
  INVITE_MEMBERS = "invite-members",
  CREATE_ACCOUNT = "create-account",
  GET_MOBILE_APP = "get-mobile-app",
}
export enum TaskStatus {
  COMPLETED = "completed",
  DISABLED = "disabled",
  IDLE = "idle",
}
export type GuideItemComponentProps = {
  status: TaskStatus;
};
export type GuideItem = {
  featureFlip?: string;
  hidden?: boolean;
  component: ({ status }: GuideItemComponentProps) => DSJSX.Element | null;
};
