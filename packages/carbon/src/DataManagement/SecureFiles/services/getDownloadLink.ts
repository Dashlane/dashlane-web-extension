import { DownloadSecureFileRequest } from "@dashlane/communication";
import { ukiSelector } from "Authentication";
import { WSSecureFileGetDownloadLinkResult } from "Libs/WS/SecureFile";
import { logDebug } from "Logs/Debugger";
import { CoreServices } from "Services";
import { userIdSelector } from "Session/selectors";
import { secureFileDownloadErrorAction } from "Session/Store/secureFileStorage";
export const getDownloadLink = async (
  services: CoreServices,
  params: DownloadSecureFileRequest
): Promise<string | null> => {
  const { storeService, wsService } = services;
  const state = storeService.getState();
  const login = userIdSelector(state);
  const uki = ukiSelector(state);
  let downloadLinkResult: WSSecureFileGetDownloadLinkResult = null;
  try {
    downloadLinkResult = await wsService.secureFile.getDownloadLink({
      login,
      uki,
      key: params.downloadKey,
    });
  } catch (error) {
    logDebug({
      tag: ["SecureFile"],
      message: "Error while getting S3 download link",
      details: { error },
    });
    services.storeService.dispatch(
      secureFileDownloadErrorAction(params.downloadKey)
    );
    return null;
  }
  if (downloadLinkResult.code !== 200) {
    services.storeService.dispatch(
      secureFileDownloadErrorAction(params.downloadKey)
    );
    return null;
  }
  return downloadLinkResult.content.url;
};
