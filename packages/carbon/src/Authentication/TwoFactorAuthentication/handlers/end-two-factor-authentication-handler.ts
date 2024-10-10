import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
import { changeMPDone } from "Session/Store/changeMasterPassword/actions";
export const endTwoFactorAuthenticationHandler = async ({
  sessionService,
  storeService,
}: CoreServices) => {
  storeService.dispatch(changeMPDone());
  await sessionService.getInstance().user.attemptSync(Trigger.SettingsChange);
  return { success: true };
};
