import { v4 as uuidv4 } from "uuid";
import {
  InitSecureFilesStorageInfoResult,
  SecureFileResultErrorCode,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { ukiSelector } from "Authentication";
import { userIdSelector } from "Session/selectors";
import { WSSecureFileGetUploadLinkResult } from "Libs/WS/SecureFile";
import { secureFileSetStorageInfoAction } from "Session/Store/secureFileStorage";
export async function initSecureFilesStorageInfoHandler({
  wsService,
  storeService,
}: CoreServices): Promise<InitSecureFilesStorageInfoResult> {
  const login = userIdSelector(storeService.getState());
  let getUploadLink: WSSecureFileGetUploadLinkResult = null;
  try {
    getUploadLink = await wsService.secureFile.getUploadLink({
      contentLength: 0,
      secureFileInfoId: uuidv4(),
      login,
      uki: ukiSelector(storeService.getState()),
    });
  } catch (error) {
    return {
      success: false,
      error: {
        code: SecureFileResultErrorCode.SERVER_ERROR,
      },
    };
  }
  if (getUploadLink.code === 200) {
    storeService.dispatch(
      secureFileSetStorageInfoAction(getUploadLink.content.quota)
    );
    return {
      success: true,
    };
  }
  storeService.dispatch(secureFileSetStorageInfoAction(null));
  return {
    success: false,
  };
}
