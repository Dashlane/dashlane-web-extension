import { setRememberMeTypeAction } from "Authentication/Store/currentUser/actions";
import { getLocalAccountRememberMeType } from "Libs/RememberMe/helpers";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
export function loadRememberMeTypeToStore(coreServices: CoreServices) {
  const { storeService } = coreServices;
  const login = userLoginSelector(storeService.getState());
  const savedRememberMeType = getLocalAccountRememberMeType(login);
  if (savedRememberMeType) {
    storeService.dispatch(setRememberMeTypeAction(savedRememberMeType));
  }
}
