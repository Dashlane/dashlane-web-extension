import {
  FILE_NOT_FOUND_HTTP_STATUS,
  FileNamesList,
  FileNamesStorageKey,
  FileRevisionMapper,
  GetFileMetaDataResponse,
  NO_CURRENT_UPDATE_HTTP_STATUS,
  SERVER_ERROR_HTTP_STATUS,
  UPDATE_AVAILABLE_HTTP_STATUS,
  UpdateAvailableFileMetaData,
} from "@dashlane/communication";
import { isApiError } from "Libs/DashlaneApi";
import {
  getFilesMeta,
  isGetFilesMetaSuccess,
} from "Libs/DashlaneApi/services/file/get-file-meta";
import { CoreServices } from "Services";
import { decipherRemoteFileUpdate } from "RemoteFileUpdates/helpers/remoteFileUpdateCryptoHelpers";
import { StoreService } from "Store";
import {
  deleteFileMetaAction,
  updateFileContentAction,
  updateFileMetaAction,
} from "Session/Store/file/actions";
import {
  persistFileMetaInCipheredLocalStorage,
  readFileFromLocalStorage,
  retrieveFileMetaDataFromCipheredLocalStorage,
  writeFileInLocalStorage,
} from "RemoteFileUpdates/persistRemoteFile";
import {
  FileUpdateInformationMapper,
  FileUpdateReport,
} from "RemoteFileUpdates/type";
import { DownlodableFilesSettings } from "RemoteFileUpdates/constants";
import {
  assertRemoteFileError,
  RemoteFileError,
} from "RemoteFileUpdates/remoteFileErrors";
import { sharingKeysSelector, userLoginSelector } from "Session/selectors";
import { httpGetUsingFetch } from "Libs/Http/getFetch";
import { logReceiveRemoteFileSuccess } from "RemoteFileUpdates/logs";
import { RemoteFileUpdateError } from "@dashlane/hermes";
import { DownloadedFile } from "RemoteFileUpdates/helpers/fileManipulationHelper";
import { ValuesType } from "@dashlane/framework-types";
import type { GetFileMetaV2BodyData } from "@dashlane/server-sdk/v1";
export async function fetchFile(url: string): Promise<ArrayBuffer> {
  try {
    return (
      await httpGetUsingFetch<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      })
    ).data;
  } catch (e) {
    throw new RemoteFileError(RemoteFileUpdateError.DownloadError, e.message);
  }
}
function isServerResponseIndexedWithExpectedKeys(
  obj: GetFileMetaV2BodyData["fileInfos"]
): obj is {
  [Key in (typeof FileNamesList)[number]]: ValuesType<
    GetFileMetaV2BodyData["fileInfos"]
  >;
} {
  for (const key of FileNamesList) {
    if (!(key in obj)) {
      return false;
    }
  }
  return true;
}
async function requestForFileMetaData(
  storeService: StoreService,
  params: FileRevisionMapper
): Promise<FileUpdateInformationMapper | undefined> {
  const result = await getFilesMeta(
    storeService,
    userLoginSelector(storeService.getState()),
    params
  );
  if (isApiError(result)) {
    throw new RemoteFileError(
      RemoteFileUpdateError.ServerError,
      result.message
    );
  } else if (isGetFilesMetaSuccess(result)) {
    const { fileInfos } = result;
    if (!isServerResponseIndexedWithExpectedKeys(fileInfos)) {
      throw new Error("Missing keys in the GetFileMeta response");
    }
    return fileInfos;
  }
  return undefined;
}
async function downloadAndDecipherSingleFile(
  fileName: FileNamesStorageKey,
  metaData: UpdateAvailableFileMetaData,
  storeService: StoreService
): Promise<DownloadedFile> {
  const fetchedFile = await fetchFile(metaData.url);
  if (!metaData.key) {
    return new DownloadedFile(fileName, fetchedFile);
  }
  const decipheredFile = await decipherRemoteFileUpdate(
    fetchedFile,
    metaData,
    sharingKeysSelector(storeService.getState()).privateKey
  );
  return new DownloadedFile(fileName, decipheredFile);
}
function doesFileStatusNeedUpdate(
  response: GetFileMetaDataResponse
): response is UpdateAvailableFileMetaData {
  switch (response.status) {
    case UPDATE_AVAILABLE_HTTP_STATUS:
      return true;
    case NO_CURRENT_UPDATE_HTTP_STATUS:
    case FILE_NOT_FOUND_HTTP_STATUS:
    case SERVER_ERROR_HTTP_STATUS:
    default:
      return false;
  }
}
function persistFileDataInStore(
  services: CoreServices,
  revision: number,
  file: DownloadedFile
): void {
  const { storeService, eventBusService } = services;
  storeService.dispatch(updateFileContentAction({ [file.name]: file }));
  storeService.dispatch(
    updateFileMetaAction({
      [file.name]: revision,
    })
  );
  eventBusService.remoteFileChanged(file.name);
}
async function handleFileProcessing(
  coreService: CoreServices,
  [fileName, fileMetaData]: [FileNamesStorageKey, GetFileMetaDataResponse]
): Promise<FileUpdateReport> {
  const { storeService, eventLoggerService } = coreService;
  if (!doesFileStatusNeedUpdate(fileMetaData)) {
    return { fileName, isUpdated: false, fileMetaData };
  }
  try {
    const file = await downloadAndDecipherSingleFile(
      fileName,
      fileMetaData,
      storeService
    );
    persistFileDataInStore(coreService, fileMetaData.revision, file);
  } catch (e) {
    assertRemoteFileError(eventLoggerService, e);
    return { fileName, isUpdated: false, fileMetaData };
  }
  return { fileName, isUpdated: true, fileMetaData };
}
function downloadAndDecipherFiles(
  filesUpdateInfo: FileUpdateInformationMapper,
  coreService: CoreServices
): Promise<FileUpdateReport[]> {
  return Promise.all(
    Object.entries(filesUpdateInfo).map(
      (fileInfo: [FileNamesStorageKey, GetFileMetaDataResponse]) => {
        return handleFileProcessing(coreService, fileInfo);
      }
    )
  );
}
async function buildGetFilesMetaRequest(
  services: CoreServices,
  initialFilesSettings: DownlodableFilesSettings
): Promise<FileRevisionMapper> {
  const filesMetaDataInStorage =
    await retrieveFileMetaDataFromCipheredLocalStorage(services);
  return Object.entries(initialFilesSettings).reduce(
    (acc: FileRevisionMapper, [fileName, fileSettingsDetail]) => {
      if (
        filesMetaDataInStorage !== null &&
        fileName in filesMetaDataInStorage.files
      ) {
        acc.files[fileName] =
          fileSettingsDetail.revision ?? filesMetaDataInStorage.files[fileName];
      } else {
        acc.files[fileName] = 0;
      }
      return acc;
    },
    { files: {} } as FileRevisionMapper
  );
}
function loadFromLocalStorageFilesContentNotUpdated(
  coreService: CoreServices,
  fileUpdateReport: FileUpdateReport[],
  noneUpdatedFilesRevision: Partial<Pick<FileRevisionMapper, "files">>
) {
  const localStorageInstance = coreService.localStorageService.getInstance();
  return Promise.all(
    fileUpdateReport
      .filter(({ isUpdated }) => !isUpdated)
      .map(async ({ fileName }): Promise<void> => {
        if (!localStorageInstance.isRemoteFileContentExist(fileName)) {
          return;
        }
        const storedFileContent = await readFileFromLocalStorage(
          coreService,
          fileName
        );
        if (storedFileContent === null) {
          return;
        }
        persistFileDataInStore(
          coreService,
          noneUpdatedFilesRevision[fileName],
          storedFileContent
        );
      })
  );
}
async function persistDownloadedFilesInLocalStorage(
  coreService: CoreServices,
  fileUpdateReports: FileUpdateReport[]
): Promise<Array<[FileNamesStorageKey, boolean]>> {
  const { eventLoggerService } = coreService;
  return await Promise.all(
    fileUpdateReports
      .filter(({ isUpdated }) => isUpdated)
      .map(async ({ fileName }): Promise<[FileNamesStorageKey, boolean]> => {
        try {
          await writeFileInLocalStorage(coreService, fileName);
          logReceiveRemoteFileSuccess(eventLoggerService);
          return [fileName, true];
        } catch (e) {
          assertRemoteFileError(eventLoggerService, e);
          return [fileName, false];
        }
      })
  );
}
export const downloadRemoteFileHandler = async (
  services: CoreServices,
  params: DownlodableFilesSettings
) => {
  const { storeService } = services;
  const getFilesMetaRequest = await buildGetFilesMetaRequest(services, params);
  try {
    const filesUpdateInformation = await requestForFileMetaData(
      storeService,
      getFilesMetaRequest
    );
    if (
      filesUpdateInformation &&
      Object.keys(filesUpdateInformation).length !== 0
    ) {
      const fileUpdateReport = await downloadAndDecipherFiles(
        filesUpdateInformation,
        services
      );
      const persistanceReport = await persistDownloadedFilesInLocalStorage(
        services,
        fileUpdateReport
      );
      const fileMetaToDelete = persistanceReport
        .filter(([_, isPersist]) => !isPersist)
        .map(([fileName, _]) => fileName);
      storeService.dispatch(deleteFileMetaAction(fileMetaToDelete));
      await loadFromLocalStorageFilesContentNotUpdated(
        services,
        fileUpdateReport,
        getFilesMetaRequest.files
      );
      await persistFileMetaInCipheredLocalStorage(services);
    }
  } catch (e) {
    assertRemoteFileError(services.eventLoggerService, e);
  }
};
