import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { SecureFileUploadProgress } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { secureFileUploadSelector } from "./selectors";
export const getFileUploadProgress$ = (): StateOperator<
  SecureFileUploadProgress | undefined
> => {
  return pipe(map(secureFileUploadSelector), distinctUntilChanged());
};
