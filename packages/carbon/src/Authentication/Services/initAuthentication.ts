import { logDebug } from "Logs/Debugger";
import { CoreServices } from "Services";
import {
  saveAppKeys,
  saveDashlaneServerDeltaTimestamp,
  saveStyxKeys,
} from "Session/Store/sdk/actions";
import { loadLocalUsersAuthenticationDataFromStorage } from "Authentication/Storage/localUsers";
import { getRemoteTime, isApiError } from "Libs/DashlaneApi";
import { platformInfoSelector } from "Authentication/selectors";
import { checkOrigin } from "Utils";
export const initAuthentication = async (
  services: CoreServices,
  keys: {
    appAccess: string;
    appSecret: string;
    styxAccess: string;
    styxSecret: string;
  }
) => {
  initAppKeys(services, keys);
  initStyxKeys(services, keys);
  await loadLocalUsersAuthenticationDataFromStorage(services);
  await synchronizeTimeWithServer(services, checkOrigin(self));
};
const initAppKeys = (
  services: CoreServices,
  keys: {
    appAccess: string;
    appSecret: string;
  }
) => {
  const { storeService } = services;
  storeService.dispatch(
    saveAppKeys({
      accessKey: keys.appAccess,
      secretKey: keys.appSecret,
    })
  );
};
const initStyxKeys = (
  services: CoreServices,
  keys: {
    styxAccess: string;
    styxSecret: string;
  }
) => {
  const { storeService } = services;
  storeService.dispatch(
    saveStyxKeys({
      accessKey: keys.styxAccess,
      secretKey: keys.styxSecret,
    })
  );
};
const synchronizeTimeWithServer = async (
  services: CoreServices,
  sendTz?: boolean
) => {
  const { storeService } = services;
  try {
    const platformInfo = platformInfoSelector(storeService.getState());
    const response = await getRemoteTime(
      storeService,
      (platformInfo.platformName === "server_tac" ||
        platformInfo.platformName === "server_leeloo") &&
        sendTz
        ? { tz: new Date().getTimezoneOffset().toString() }
        : undefined
    );
    if (isApiError(response)) {
      throw response;
    }
    storeService.dispatch(saveDashlaneServerDeltaTimestamp(response.timestamp));
  } catch (error) {
    logDebug({
      tag: ["Auth"],
      message: "Error while calling getRemoteTime",
      details: { error },
    });
  }
};
