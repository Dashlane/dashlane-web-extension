import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore, StoreCapacity } from "@dashlane/framework-application";
import { z } from "zod";
import { PassthroughCodec } from "@dashlane/framework-services";
const PinCodeStateSchema = z.object({
  localAccounts: z.record(
    z.string(),
    z.object({
      salt: z.string(),
      encryptedSessionKey: z.string(),
      serverSessionKey: z.string(),
      attemptsLeft: z.number(),
    })
  ),
});
export type PinCodeState = z.infer<typeof PinCodeStateSchema>;
export const isPinCodeStore = (x: unknown): x is PinCodeState =>
  PinCodeStateSchema.safeParse(x).success;
export class PinCodeStore extends defineStore<PinCodeState, PinCodeState>({
  persist: true,
  storage: {
    initialValue: { localAccounts: {} },
    schemaVersion: 1,
    typeGuard: isPinCodeStore,
    migrateStorageSchema: () => ({
      localAccounts: {},
    }),
  },
  codec: PassthroughCodec,
  scope: UseCaseScope.Device,
  storeName: "pincode",
  capacity: StoreCapacity._001KB,
}) {}
