import { VersionedBreach } from "DataManagement/Breaches/types";
export interface BreachesUpdaterChanges {
  updates: VersionedBreach[];
  deletions: string[];
}
