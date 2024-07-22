import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface RevisionSummary {
  id: string;
  revision: number;
}
export interface TimestampSummary {
  id: string;
  timestamp: number;
}
export interface SharingSummary {
  collections: RevisionSummary[];
  items: TimestampSummary[];
  itemGroups: RevisionSummary[];
  userGroups: RevisionSummary[];
}
export interface RunSharingSyncCommandParam {
  summary: SharingSummary;
}
export class RunSharingSyncCommand extends defineCommand<RunSharingSyncCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
