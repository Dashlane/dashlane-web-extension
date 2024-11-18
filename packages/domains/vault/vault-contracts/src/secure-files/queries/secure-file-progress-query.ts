import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export enum ProgressStatus {
  NotStarted = "NotStarted",
  Started = "Started",
  Linked = "Linked",
  Fetched = "Fetched",
  Ciphered = "Ciphered",
  Completed = "Completed",
  Error = "Error",
}
type SecureFileProgressQueryParams = {
  secureFileKey: string;
};
export class SecureFileProgressQuery extends defineQuery<
  ProgressStatus,
  never,
  SecureFileProgressQueryParams
>({
  scope: UseCaseScope.User,
}) {}
