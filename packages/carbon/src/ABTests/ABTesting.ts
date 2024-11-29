import { CoreServices } from "Services/index";
import { GetABTestingVersionDetailsRequest } from "Libs/WS/Premium";
import Debugger from "Logs/Debugger";
import { saveABTestingInfo } from "./Store/abtesting/actions";
export const fetchABTestingVersionDetails = (
  services: CoreServices,
  options?: {
    abTestForcedVersion?: string;
  }
): Promise<void> => {
  const storeService = services.storeService;
  const platformInfo = storeService.getPlatform().info;
  const abTestingRequest: GetABTestingVersionDetailsRequest = {
    capacity: "",
    language: platformInfo.lang,
    platform: "real_website",
  };
  if (options?.abTestForcedVersion) {
    abTestingRequest.forceVersion3 = options.abTestForcedVersion;
  }
  return services.wsService.premium
    .getABTestingVersionDetails(abTestingRequest)
    .then((abTestingVersionResult) => {
      storeService.dispatch(saveABTestingInfo(abTestingVersionResult));
    })
    .catch((error) => {
      Debugger.error(
        "Carbon init - Error while calling getABTestingVersionDetails: ",
        error
      );
    });
};
