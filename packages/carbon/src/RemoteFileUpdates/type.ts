import {
  FileNamesStorageKey,
  GetFileMetaDataResponse,
} from "@dashlane/communication";
export interface FilesToWatch {
  automaticFileUpdate: Readonly<string[]>;
  manualFileUpdate: Readonly<{
    [fileName: string]: number;
  }>;
}
export type FileUpdateReport = {
  fileName: FileNamesStorageKey;
  isUpdated: boolean;
  fileMetaData: GetFileMetaDataResponse;
};
export type FileUpdateInformationMapper = {
  [fileName in FileNamesStorageKey]: GetFileMetaDataResponse;
};
