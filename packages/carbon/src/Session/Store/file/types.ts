import {
  FileMetaDataState,
  FileNamesStorageKey,
} from "@dashlane/communication";
import { DownloadedFile } from "RemoteFileUpdates/helpers/fileManipulationHelper";
export interface FileContentState {
  [fileName: string]: DownloadedFile;
}
export type FileContentStorage = {
  [fileName in FileNamesStorageKey]: DownloadedFile;
};
export interface RemoteFileState {
  fileMetaData: FileMetaDataState;
  fileContentState: Partial<FileContentState>;
}
