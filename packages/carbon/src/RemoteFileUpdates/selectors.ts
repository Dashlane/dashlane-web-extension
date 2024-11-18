import { FileMetaDataState } from "@dashlane/communication";
import { RemoteFileState } from "Session/Store/file/types";
import { State } from "Store";
import { DownloadedFile } from "./helpers/fileManipulationHelper";
const remoteFileSelector = (state: State): RemoteFileState =>
  state.device.remoteFile;
export const fileMetaUpdateSelector = (state: State): FileMetaDataState =>
  remoteFileSelector(state).fileMetaData;
export const fileSelector = (state: State, fileName: string): DownloadedFile =>
  remoteFileSelector(state).fileContentState[fileName];
export const fileContentStrSelector = (
  state: State,
  fileName: string
): string => fileSelector(state, fileName).toString();
