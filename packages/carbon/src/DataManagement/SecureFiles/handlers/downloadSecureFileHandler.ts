import {
  DownloadSecureFileRequest,
  DownloadSecureFileResult,
  SecureFileResultErrorCode,
} from "@dashlane/communication";
import { splitEvery } from "ramda";
import { CoreServices } from "Services";
import {
  secureFileChunkReadyAction,
  secureFileDownloadErrorAction,
  secureFileStartDecipheringAction,
} from "Session/Store/secureFileStorage";
import { decipherSecureFileContent } from "../services/decipherSecureFileContent";
import { downloadFileFromStorage } from "../services/downloadFileFromStorage";
import { getDownloadLink } from "../services/getDownloadLink";
const ERROR_RESULT: DownloadSecureFileResult = {
  success: false,
  error: {
    code: SecureFileResultErrorCode.INTERNAL_ERROR,
  },
};
const CHUNK_SIZE = Math.pow(1024, 2) * 15;
export const downloadSecureFileHandler = async (
  services: CoreServices,
  params: DownloadSecureFileRequest
): Promise<DownloadSecureFileResult> => {
  const downloadLink = await getDownloadLink(services, params);
  if (!downloadLink) {
    return ERROR_RESULT;
  }
  const downloadFileOperation = await downloadFileFromStorage(
    services,
    downloadLink,
    params
  );
  if (!downloadFileOperation.success) {
    services.storeService.dispatch(
      secureFileDownloadErrorAction(params.downloadKey)
    );
    return ERROR_RESULT;
  }
  services.storeService.dispatch(
    secureFileStartDecipheringAction(params.downloadKey)
  );
  const decipheredContent = await decipherSecureFileContent(
    downloadFileOperation.chunks,
    params.cryptoKey
  );
  if (decipheredContent === null) {
    services.storeService.dispatch(
      secureFileDownloadErrorAction(params.downloadKey)
    );
    return ERROR_RESULT;
  }
  const bytesArray = new Uint8Array(decipheredContent);
  const serializedContent = JSON.stringify(Array.from(bytesArray));
  const chunks =
    serializedContent.length > CHUNK_SIZE
      ? splitEvery(CHUNK_SIZE, serializedContent)
      : [serializedContent];
  services.storeService.dispatch(
    secureFileChunkReadyAction(params.downloadKey, chunks)
  );
  return {
    success: true,
  };
};
