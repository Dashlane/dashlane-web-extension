import {
  DisableCredentialProtectionRequest,
  DisableCredentialProtectionResult,
  UnlockProtectedItemsResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type ProtectedItemsUnlockerCommands = {
  unlockProtectedItems: Command<string, UnlockProtectedItemsResult>;
  disableCredentialProtection: Command<
    DisableCredentialProtectionRequest,
    DisableCredentialProtectionResult
  >;
};
