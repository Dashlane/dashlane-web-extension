import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
import { isObject } from "@dashlane/framework-types";
import { SecureFilesQuota } from "@dashlane/vault-contracts";
const isSecureFileQuotaStore = (x: unknown): x is SecureFilesQuota => {
  if (!x || !isObject(x)) {
    return false;
  }
  return "remaining" in x;
};
export class SecureFilesQuotaStore extends defineStore<
  SecureFilesQuota,
  SecureFilesQuota
>({
  persist: true,
  storage: {
    initialValue: {
      remaining: 0,
      max: 0,
    },
    typeGuard: isSecureFileQuotaStore,
    schemaVersion: 1,
  },
  scope: UseCaseScope.User,
  storeName: "secure-file-quota",
  capacity: StoreCapacity._001KB,
  codec: PassthroughCodec,
}) {}
