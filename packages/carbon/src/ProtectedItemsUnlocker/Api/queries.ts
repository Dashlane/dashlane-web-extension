import { Query } from "Shared/Api";
export type ProtectedItemsUnlockerQueries = {
  vaultLockDate: Query<void, number | null>;
};
