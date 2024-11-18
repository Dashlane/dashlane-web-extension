import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { FileMetaDataState } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { fileMetaUpdateSelector } from "./selectors";
export const fileMetaUpdate$ = (): StateOperator<FileMetaDataState> =>
  pipe(map(fileMetaUpdateSelector), distinctUntilChanged());
