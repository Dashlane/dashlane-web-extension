import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  SecureFileDownloadProgressView,
  SecureFilesQuota,
  SecureFileUploadProgress,
} from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import {
  getSecureFileDownloadSelector,
  secureFilesQuotaSelector,
  secureFileUploadSelector,
} from "./selectors";
export const getFileDownloadProgress$ = (
  downloadKey: string
): StateOperator<SecureFileDownloadProgressView | undefined> => {
  const selector = getSecureFileDownloadSelector(downloadKey);
  return pipe(map(selector), distinctUntilChanged());
};
export const getFileUploadProgress$ = (): StateOperator<
  SecureFileUploadProgress | undefined
> => {
  return pipe(map(secureFileUploadSelector), distinctUntilChanged());
};
export const secureFilesQuota$ = (): StateOperator<SecureFilesQuota> =>
  pipe(map(secureFilesQuotaSelector), distinctUntilChanged());
