import { FileNamesStorageKey } from "@dashlane/communication";
import { Action } from "Store";
import { FileContentState } from "./types";
export enum FileActionsType {
  UpdateFileMeta = "UPDATE_FILE_META",
  UpdateFileContent = "UPDATE_FILE_CONTENT",
  DeleteFileMeta = "DELETE_FILE_META",
}
export interface FilesAction<T extends FileActionsType> extends Action {
  type: T;
}
export interface UpdateFileMetaAction
  extends FilesAction<FileActionsType.UpdateFileMeta> {
  filesMeta: Record<string, number>;
}
export const updateFileMetaAction = (
  filesMeta: Record<string, number>
): UpdateFileMetaAction => ({
  type: FileActionsType.UpdateFileMeta,
  filesMeta,
});
export interface UpdateFileContentAction
  extends FilesAction<FileActionsType.UpdateFileContent> {
  filesContent: FileContentState;
}
export const updateFileContentAction = (
  filesContent: FileContentState
): UpdateFileContentAction => ({
  type: FileActionsType.UpdateFileContent,
  filesContent,
});
export interface DeleteFileMetaAction
  extends FilesAction<FileActionsType.DeleteFileMeta> {
  fileNames: FileNamesStorageKey[];
}
export const deleteFileMetaAction = (
  fileNames: FileNamesStorageKey[]
): DeleteFileMetaAction => ({
  type: FileActionsType.DeleteFileMeta,
  fileNames,
});
export type RemoteFileUpdatesActions =
  | UpdateFileMetaAction
  | UpdateFileContentAction
  | DeleteFileMetaAction;
