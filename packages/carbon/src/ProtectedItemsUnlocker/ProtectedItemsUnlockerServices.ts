import {
  UnlockProtectedItemsResult,
  UnlockProtectedItemsStatus,
  unlockProtectedItemsWrongPasswordError,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { validateMasterPassword } from "Session/performValidation";
export async function unlockProtectedItems(
  services: CoreServices,
  masterPassword: string
): Promise<UnlockProtectedItemsResult> {
  const { storeService, masterPasswordEncryptorService } = services;
  const isValid = await validateMasterPassword(
    storeService,
    masterPasswordEncryptorService,
    masterPassword
  );
  if (!isValid) {
    return {
      status: UnlockProtectedItemsStatus.ERROR,
      error: {
        code: unlockProtectedItemsWrongPasswordError,
      },
    };
  }
  return {
    status: UnlockProtectedItemsStatus.SUCCESS,
  };
}
