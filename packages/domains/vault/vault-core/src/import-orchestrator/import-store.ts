import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { ImportState, ImportSteps } from "@dashlane/vault-contracts";
export class ImportStore extends defineStore<ImportState, ImportState>({
  persist: false,
  scope: UseCaseScope.User,
  storeName: "import-store",
  initialValue: {
    step: ImportSteps.NOT_STARTED,
  },
  capacity: StoreCapacity._100KB,
}) {}
