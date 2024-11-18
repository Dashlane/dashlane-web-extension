import { _makeRequest } from "Libs/WS/request";
import {
  WSBackup,
  WSEraseParams,
  WSEraseResult,
  WSLatestParams,
  WSLatestResult,
  WSUnlockParams,
  WSUploadParams,
  WSUploadResult,
} from "Libs/WS/Backup/types";
const WSVERSION = 12;
const WSNAME = "backup";
export const makeWSBackup = (): WSBackup => {
  return {
    latest: (params: WSLatestParams) => latest(params),
    upload: (params: WSUploadParams) => upload(params),
    unlock: (params: WSUnlockParams) => unlock(params),
    erase: (params: WSEraseParams) => erase(params),
  };
};
const latest = (params: WSLatestParams): Promise<WSLatestResult> => {
  return _makeRequest<WSLatestResult, WSLatestParams>(
    WSNAME,
    WSVERSION,
    "latest",
    Object.assign({}, params, {
      sharingTimestamp: 0,
    })
  );
};
const upload = (params: WSUploadParams): Promise<WSUploadResult> => {
  return _makeRequest<WSUploadResult, WSUploadParams>(
    WSNAME,
    WSVERSION,
    "upload",
    params
  );
};
const unlock = (params: WSUnlockParams): Promise<void> => {
  return _makeRequest<any, WSUnlockParams>(WSNAME, WSVERSION, "unlock", params);
};
const erase = (params: WSEraseParams): Promise<WSEraseResult> => {
  return _makeRequest<WSEraseResult, WSEraseParams>(
    WSNAME,
    WSVERSION,
    "erase",
    params
  );
};
