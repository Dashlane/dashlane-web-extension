import { CoreServices } from "Services";
import { resetLoginStepInfo } from "LoginStepInfo/Store/actions";
export const resetLoginStepInfoHandler = (
  services: CoreServices
): Promise<void> => {
  services.storeService.dispatch(resetLoginStepInfo());
  services.sessionService.getInstance().user.persistLocalSettings();
  return Promise.resolve();
};
