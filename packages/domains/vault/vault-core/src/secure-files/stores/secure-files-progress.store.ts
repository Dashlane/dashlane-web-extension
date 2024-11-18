import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { ProgressStatus } from "@dashlane/vault-contracts";
type SecureFileProgress = Record<string, ProgressStatus | undefined>;
export class SecureFilesProgressStore extends defineStore<SecureFileProgress>({
  initialValue: {},
  scope: UseCaseScope.User,
  storeName: "secure-files-progress",
  persist: false,
  capacity: StoreCapacity._001KB,
}) {}
