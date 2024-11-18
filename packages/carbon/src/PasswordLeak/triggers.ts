import { checkPasswordLeaked } from "PasswordLeak/services/check-password-leaked";
import { masterPasswordSelector } from "Session/selectors";
import { CoreServices } from "Services";
import { isSSOUserSelector } from "Session/sso.selectors";
import { shouldTriggerMasterPasswordWeakCheck } from "./should-trigger";
import { checkPasswordWeak } from "./services/check-password-weak";
export async function triggerMasterPasswordLeakCheck(
  coreServices: CoreServices
): Promise<void> {
  const state = coreServices.storeService.getState();
  const isSSOUser = isSSOUserSelector(state);
  if (isSSOUser) {
    return;
  }
  const password = masterPasswordSelector(state);
  await checkPasswordLeaked(coreServices, {
    password,
  });
  if (await shouldTriggerMasterPasswordWeakCheck(state)) {
    await checkPasswordWeak(coreServices, {
      password,
    });
  }
}
