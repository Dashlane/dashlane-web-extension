import {
  FileNamesStorageKey,
  FileRevisionMapper,
} from "@dashlane/communication";
import { PersistData } from "Session/types";
import { fileMetaUpdateSelector, fileSelector } from "./selectors";
import { FILE_SETTINGS } from "./constants";
import { RemoteFileError } from "./remoteFileErrors";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { RemoteFileUpdateError } from "@dashlane/hermes";
import { StorageService } from "Libs/Storage/types";
import { CoreServices } from "Services";
import { DownloadedFile } from "./helpers/fileManipulationHelper";
const NOT_INITIALIZED_LOCAL_STORAGE_ERROR =
  "LocalStorageService is not initalized";
const assertOrThrowStorageInitialisation = (storage: unknown) => {
  if (!storage) {
    throw new RemoteFileError(
      RemoteFileUpdateError.LocalStorageError,
      NOT_INITIALIZED_LOCAL_STORAGE_ERROR
    );
  }
};
export async function persistFileMetaInCipheredLocalStorage({
  localStorageService,
  storeService,
}: CoreServices): Promise<void> {
  localStorageService.getInstance();
  const { persistData, isAuthenticated } = storeService.getAccountInfo();
  if (!isAuthenticated || persistData === PersistData.PERSIST_DATA_NO) {
    return;
  }
  assertOrThrowStorageInitialisation(localStorageService);
  const userLocalStorage = localStorageService.getInstance();
  try {
    await userLocalStorage.storeRemoteFileMeta(
      fileMetaUpdateSelector(storeService.getState())
    );
  } catch {
    throw new RemoteFileError(
      RemoteFileUpdateError.LocalStorageError,
      "Cannot persist file metadata in local storage"
    );
  }
}
export async function persistSingleFileContentInCipheredLocalStorage(
  { localStorageService, storeService }: CoreServices,
  fileName: FileNamesStorageKey
): Promise<void> {
  const { persistData, isAuthenticated } = storeService.getAccountInfo();
  const storage = localStorageService.getInstance();
  if (!isAuthenticated || persistData === PersistData.PERSIST_DATA_NO) {
    return;
  }
  assertOrThrowStorageInitialisation(storage);
  const file = await fileSelector(storeService.getState(), fileName);
  try {
    await storage.storeRemoteFileContent(fileName, file.toBase64String());
  } catch (e) {
    throw new RemoteFileError(
      RemoteFileUpdateError.LocalStorageError,
      `Cannot persist ${fileName} content in local storage`
    );
  }
}
export async function persistSingleFileInNonCipheredLocalStorage(
  { storeService, storageService }: CoreServices,
  fileName: FileNamesStorageKey
): Promise<void> {
  const { persistData, isAuthenticated } = storeService.getAccountInfo();
  if (!isAuthenticated || persistData === PersistData.PERSIST_DATA_NO) {
    return;
  }
  const localStorage = storageService.getLocalStorage();
  assertOrThrowStorageInitialisation(localStorage);
  const file = await fileSelector(storeService.getState(), fileName);
  try {
    await localStorage.writeItem(fileName, file.toBase64String());
  } catch (e) {
    throw new RemoteFileError(
      RemoteFileUpdateError.LocalStorageError,
      `Cannot persist ${fileName} content in local storage`
    );
  }
}
export async function retrieveFileMetaDataFromCipheredLocalStorage({
  localStorageService,
}: CoreServices): Promise<FileRevisionMapper | null> {
  const localStorageInstance = localStorageService.getInstance();
  assertOrThrowStorageInitialisation(localStorageInstance);
  const doesFileMetaExists =
    await localStorageInstance.isRemoteFileMetaDataExist();
  return doesFileMetaExists
    ? await localStorageInstance.getRemoteFileMeta()
    : Promise.resolve(null);
}
export async function retrieveFileContentFromCipheredLocalStorage(
  localStorageService: LocalStorageService,
  fileName: FileNamesStorageKey
): Promise<DownloadedFile | null> {
  const localStorageInstance = localStorageService.getInstance();
  assertOrThrowStorageInitialisation(localStorageInstance);
  const doesFileContentExists =
    await localStorageInstance.isRemoteFileContentExist(fileName);
  return doesFileContentExists
    ? DownloadedFile.fromBase64Str(
        fileName,
        await localStorageInstance.getRemoteFileContent(fileName)
      )
    : Promise.resolve(null);
}
export async function retrieveFileContentFromNonCipheredLocalStorage(
  storageService: StorageService,
  fileName: string
): Promise<DownloadedFile | null> {
  const asyncStorage = storageService.getLocalStorage();
  assertOrThrowStorageInitialisation(asyncStorage);
  const doesFileNameExists = await asyncStorage.itemExists(fileName);
  return doesFileNameExists
    ? DownloadedFile.fromBase64Str(
        fileName,
        (await asyncStorage.readItem(fileName)) as string
      )
    : Promise.resolve(null);
}
export function readFileFromLocalStorage(
  coreService: CoreServices,
  fileName: FileNamesStorageKey
): Promise<DownloadedFile | null> {
  return FILE_SETTINGS[fileName].isLoadedWhileLoggedOut
    ? retrieveFileContentFromNonCipheredLocalStorage(
        coreService.storageService,
        fileName
      )
    : retrieveFileContentFromCipheredLocalStorage(
        coreService.localStorageService,
        fileName
      );
}
export function writeFileInLocalStorage(
  coreService: CoreServices,
  fileName: FileNamesStorageKey
): Promise<void> {
  return FILE_SETTINGS[fileName].isLoadedWhileLoggedOut
    ? persistSingleFileInNonCipheredLocalStorage(coreService, fileName)
    : persistSingleFileContentInCipheredLocalStorage(coreService, fileName);
}
