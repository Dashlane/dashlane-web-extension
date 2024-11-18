import { UpdateLoginStepInfoRequest } from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  updateLoginStepInfoLogin,
  updateLoginStepInfoStep,
} from "LoginStepInfo/Store/actions";
export const updateLoginStepInfoHandler = (
  services: CoreServices,
  data: UpdateLoginStepInfoRequest
): Promise<void> => {
  if (data.login !== undefined) {
    services.storeService.dispatch(updateLoginStepInfoLogin(data.login));
  }
  if (data.step !== undefined) {
    services.storeService.dispatch(updateLoginStepInfoStep(data.step));
  }
  services.sessionService.getInstance().user.persistLocalSettings();
  return Promise.resolve();
};
