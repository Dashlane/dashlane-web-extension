import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  DisableCredentialProtectionRequest,
  DisableCredentialProtectionResult,
  UnlockProtectedItemsResult,
} from "./types";
export const protectedItemsUnlockerCommandsSlots = {
  disableCredentialProtection: slot<
    DisableCredentialProtectionRequest,
    DisableCredentialProtectionResult
  >(),
  unlockProtectedItems: slot<string, UnlockProtectedItemsResult>(),
};
export const protectedItemsUnlockerQueriesSlots = {
  vaultLockDate: slot<void, number | null>(),
};
export const protectedItemsUnlockerLiveQueriesSlots = {
  liveVaultLockDate: liveSlot<number | null>(),
};
