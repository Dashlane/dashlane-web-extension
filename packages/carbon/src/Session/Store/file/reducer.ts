import {
  DeleteFileMetaAction,
  FileActionsType,
  RemoteFileUpdatesActions,
  UpdateFileContentAction,
  UpdateFileMetaAction,
} from "./actions";
import { RemoteFileState } from "./types";
type FileReducerFunctor<T extends RemoteFileUpdatesActions> = (
  state: RemoteFileState,
  action: T
) => RemoteFileState;
function sliceObjectProps<T extends Record<string, unknown>>(
  obj: T,
  keys: string[]
): Partial<T> {
  const copy = {
    ...obj,
  };
  for (const key of keys) {
    if (key in copy) {
      delete copy[key];
    }
  }
  return copy;
}
export const defaultRemoteFileState = (): RemoteFileState => ({
  fileMetaData: {},
  fileContentState: {},
});
const updateFilesMeta: FileReducerFunctor<UpdateFileMetaAction> = (
  state,
  action
) => ({
  ...state,
  fileMetaData: {
    ...state.fileMetaData,
    files: {
      ...state.fileMetaData.files,
      ...action.filesMeta,
    },
  },
});
const updateFilesContent: FileReducerFunctor<UpdateFileContentAction> = (
  state,
  action
) => ({
  ...state,
  fileContentState: {
    ...state.fileContentState,
    ...action.filesContent,
  },
});
const deleteFileMeta: FileReducerFunctor<DeleteFileMetaAction> = (
  state,
  action
) => ({
  ...state,
  fileMetaData: {
    files: sliceObjectProps(state.fileMetaData.files, action.fileNames),
  },
});
export const remoteFileReducer: FileReducerFunctor<
  RemoteFileUpdatesActions | null
> = (state = defaultRemoteFileState(), action) => {
  switch (action?.type) {
    case FileActionsType.UpdateFileMeta:
      return updateFilesMeta(state, action);
    case FileActionsType.UpdateFileContent:
      return updateFilesContent(state, action);
    case FileActionsType.DeleteFileMeta:
      return deleteFileMeta(state, action);
    default:
      break;
  }
  return state;
};
