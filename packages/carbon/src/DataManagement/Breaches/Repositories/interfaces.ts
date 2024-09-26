import { Credential } from "@dashlane/communication";
import { BreachesUpdaterChanges } from "DataManagement/Breaches/AppServices/types";
import { VersionedBreach } from "DataManagement/Breaches/types";
export interface CredentialRepository {
  getAllCredentials: () => Credential[];
}
export interface BreachRepository {
  applyChangesFromSync: (
    changes: BreachesUpdaterChanges,
    updatedRevision: number,
    updatedPrivateBreachesRefreshDate: number | undefined
  ) => Promise<void>;
  getAllBreaches: () => VersionedBreach[];
  getLatestPublicBreachesRevision: () => number;
  getPrivateBreachesRefreshDate: () => number;
}
