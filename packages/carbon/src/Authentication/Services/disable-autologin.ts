import { setRememberMeTypeAction } from "Authentication/Store/currentUser/actions";
import { rememberMeTypeSelector } from "Authentication/selectors";
import { persistLocalAccountRememberMeType } from "Libs/RememberMe/helpers";
import { CoreServices } from "Services";
export async function disableAutologin({
  storeService,
  localStorageService,
}: CoreServices): Promise<void> {
  const autologinTypes = ["autologin", "sso"];
  const userRememberMeType = rememberMeTypeSelector(storeService.getState());
  if (!autologinTypes.includes(userRememberMeType)) {
    return Promise.resolve();
  }
  await localStorageService.getInstance().cleanAuthenticationKey();
  await persistLocalAccountRememberMeType(storeService, "disabled");
  storeService.dispatch(setRememberMeTypeAction("disabled"));
  return Promise.resolve();
}
