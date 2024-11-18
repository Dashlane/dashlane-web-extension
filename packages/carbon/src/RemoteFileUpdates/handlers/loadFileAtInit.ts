import { FileNamesStorageKey } from "@dashlane/communication";
import { FILE_SETTINGS } from "RemoteFileUpdates/constants";
import { readFileFromLocalStorage } from "RemoteFileUpdates/persistRemoteFile";
import { assertRemoteFileError } from "RemoteFileUpdates/remoteFileErrors";
import { CoreServices } from "Services";
import { updateFileContentAction } from "Session/Store/file/actions";
export async function loadFileContentAtInit(
  coreService: CoreServices,
  fileName: FileNamesStorageKey
): Promise<boolean> {
  const file = await readFileFromLocalStorage(
    coreService,
    fileName as FileNamesStorageKey
  );
  if (file === null) {
    return false;
  }
  coreService.storeService.dispatch(
    updateFileContentAction({
      [fileName]: file,
    })
  );
  return true;
}
export function loadFilesAtInit(coreService: CoreServices) {
  Object.keys(FILE_SETTINGS).forEach(async (fileName) => {
    if (!FILE_SETTINGS[fileName].isLoadedWhileLoggedOut) {
      return;
    }
    try {
      const isFileLoaded = await loadFileContentAtInit(
        coreService,
        fileName as FileNamesStorageKey
      );
      if (isFileLoaded) {
        coreService.eventBusService.remoteFileChanged(fileName);
      }
    } catch (e) {
      assertRemoteFileError(coreService.eventLoggerService, e);
    }
  });
}
