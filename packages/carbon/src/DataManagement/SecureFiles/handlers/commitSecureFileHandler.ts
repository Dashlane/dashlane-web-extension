import {
  CommitSecureFileRequest,
  CommitSecureFileResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { ukiSelector } from "Authentication";
import { userIdSelector } from "Session/selectors";
import { savePersonalDataItem } from "Session/Store/actions";
export async function commitSecureFileHandler(
  { wsService, sessionService, storeService }: CoreServices,
  { secureFileInfo }: CommitSecureFileRequest
): Promise<CommitSecureFileResult> {
  const commitFile = await wsService.secureFile.commit({
    key: secureFileInfo.DownloadKey,
    secureFileInfoId: secureFileInfo.Id,
    login: userIdSelector(storeService.getState()),
    uki: ukiSelector(storeService.getState()),
  });
  if (commitFile.code !== 200) {
    return {
      success: false,
    };
  }
  try {
    storeService.dispatch(
      savePersonalDataItem(secureFileInfo, secureFileInfo.kwType)
    );
    sessionService.getInstance().user.persistPersonalData();
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
