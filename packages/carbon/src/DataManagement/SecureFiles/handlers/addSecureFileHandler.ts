import {
  AddSecureFileRequest,
  AddSecureFileResult,
  SecureFileInfo,
  SecureFileResultErrorCode,
} from "@dashlane/communication";
import { v4 as uuidv4 } from "uuid";
import { CoreServices } from "Services";
import { ukiSelector } from "Authentication";
import { userIdSelector } from "Session/selectors";
import {
  encryptAES256,
  signHashHmacSHA256,
} from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { hashAndSplitKey } from "Libs/CryptoCenter/Primitives/Hash";
import {
  convertDashlaneSecureDataFlexibleToTransportableData,
  DashlaneSecureDataFlexible,
  parsePayload,
} from "Libs/CryptoCenter/transportable-data/index";
import {
  bufferToBase64,
  concatBuffers,
} from "Libs/CryptoCenter/Helpers/Helper";
import {
  WSSecureFileGetUploadLinkResult,
  WSSecureFileGetUploadLinkResultSuccess,
} from "Libs/WS/SecureFile";
import { getRandomValues } from "Libs/CryptoCenter/Helpers/WebCryptoWrapper";
import { generateIV } from "Libs/CryptoCenter/legacy/DashlaneSecureData";
import {
  secureFileStartCipheringAction,
  secureFileStartUploadAction,
  secureFileUploadChunkAction,
  secureFileUploadClearAction,
  secureFileUploadDoneAction,
  secureFileUploadErrorAction,
} from "Session/Store/secureFileStorage";
import { WSError } from "Libs/WS/Errors";
import { validateSecureFile } from "../services/validateSecureFile";
const ERROR_RESULT: AddSecureFileResult = {
  success: false,
  error: {
    code: SecureFileResultErrorCode.SERVER_ERROR,
  },
};
const CHUNK_SIZE = Math.pow(1024, 2) / 2;
const DELAY = 1000;
const mapErrorCode = (errorCode: string): SecureFileResultErrorCode => {
  switch (errorCode) {
    case SecureFileResultErrorCode.MAX_CONTENT_LENGTH_EXCEEDED:
      return SecureFileResultErrorCode.MAX_CONTENT_LENGTH_EXCEEDED;
    case SecureFileResultErrorCode.QUOTA_EXCEEDED:
    case SecureFileResultErrorCode.SOFT_QUOTA_EXCEEDED:
    case SecureFileResultErrorCode.HARD_QUOTA_EXCEEDED:
      return SecureFileResultErrorCode.QUOTA_EXCEEDED;
    default:
      return SecureFileResultErrorCode.SERVER_ERROR;
  }
};
const getError = (error: Error | WSError): AddSecureFileResult => {
  if ("getAdditionalInfo" in error) {
    return {
      success: false,
      error: {
        code: mapErrorCode(error.getAdditionalInfo().webServiceSubMessage),
      },
    };
  }
  return ERROR_RESULT;
};
const createSecureFileInfo = (
  rawDataBuffer: ArrayBuffer,
  cryptoKey: ArrayBuffer,
  secureFileDataBuffer: ArrayBuffer,
  fileName: string,
  fileType: string,
  owner: string
): SecureFileInfo => {
  const id = `{${uuidv4()}}`;
  const currentDate = Math.floor(Date.now() / 1000);
  return {
    kwType: "KWSecureFileInfo",
    Id: id,
    LastBackupTime: 0,
    CryptoKey: bufferToBase64(cryptoKey),
    DownloadKey: "",
    Filename: fileName,
    LocalSize: rawDataBuffer.byteLength,
    RemoteSize: secureFileDataBuffer.byteLength,
    Type: fileType,
    CreationDatetime: currentDate,
    UserModificationDatetime: currentDate,
    Owner: owner,
  };
};
export async function createSecureFile(
  rawDataBuffer: ArrayBuffer,
  fileName: string,
  fileType: string,
  owner: string
) {
  try {
    const { cryptoConfig } = parsePayload("__REDACTED__");
    const cryptoKey = getRandomValues(32);
    const keys = await hashAndSplitKey(cryptoKey);
    const iv = generateIV();
    const encryptedBinaryData = await encryptAES256({
      key: keys.aes,
      iv,
      clearData: rawDataBuffer,
    });
    const hmac256 = await signHashHmacSHA256({
      key: keys.hmac,
      data: concatBuffers(iv, encryptedBinaryData),
    });
    const secureDataFlexible: DashlaneSecureDataFlexible = {
      salt: null,
      iv,
      hash: hmac256,
      cipheredContent: encryptedBinaryData,
      cryptoConfig,
    };
    const secureFileDataBuffer =
      convertDashlaneSecureDataFlexibleToTransportableData(secureDataFlexible);
    const secureFileInfo = createSecureFileInfo(
      rawDataBuffer,
      cryptoKey,
      secureFileDataBuffer,
      fileName,
      fileType,
      owner
    );
    return {
      success: true,
      secureFileDataBuffer,
      secureFileInfo,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
async function uploadToS3(
  secureFileDataBuffer: ArrayBuffer,
  uploadParams: WSSecureFileGetUploadLinkResultSuccess
): Promise<boolean> {
  try {
    const url = uploadParams.content.url;
    const formData = new FormData();
    for (const key of Object.keys(uploadParams.content.fields)) {
      formData.append(key, uploadParams.content.fields[key]);
    }
    formData.append("key", `${uploadParams.content.key}`);
    formData.append("acl", `${uploadParams.content.acl}`);
    formData.append("file", new Blob([secureFileDataBuffer]));
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    return response.status === 204;
  } catch (error) {
    return false;
  }
}
export async function addSecureFileHandler(
  { wsService, storeService }: CoreServices,
  params: AddSecureFileRequest
): Promise<AddSecureFileResult> {
  const login = userIdSelector(storeService.getState());
  if (!validateSecureFile(params.fileName, params.fileType)) {
    return {
      success: false,
      error: {
        code: SecureFileResultErrorCode.INVALID_FILE_TYPE,
      },
    };
  }
  storeService.dispatch(
    secureFileStartUploadAction(params.serializedContent.length)
  );
  storeService.dispatch(secureFileStartCipheringAction());
  let content = undefined;
  try {
    const unserializedContent = JSON.parse(params.serializedContent as string);
    content = new Uint8Array(unserializedContent).buffer;
  } catch (e) {
    return {
      success: false,
      error: {
        code: SecureFileResultErrorCode.INTERNAL_ERROR,
      },
    };
  }
  const { secureFileDataBuffer, secureFileInfo } = await createSecureFile(
    content,
    params.fileName,
    params.fileType,
    login
  );
  const interval = setInterval(() => {
    storeService.dispatch(secureFileUploadChunkAction(CHUNK_SIZE));
  }, DELAY);
  let getUploadLink: WSSecureFileGetUploadLinkResult = null;
  try {
    getUploadLink = await wsService.secureFile.getUploadLink({
      contentLength: secureFileInfo.RemoteSize,
      secureFileInfoId: secureFileInfo.Id,
      login,
      uki: ukiSelector(storeService.getState()),
    });
  } catch (error) {
    clearInterval(interval);
    storeService.dispatch(secureFileUploadErrorAction());
    return getError(error);
  }
  if (getUploadLink.code === 200) {
    secureFileInfo.DownloadKey = getUploadLink.content.key;
    if (!(await uploadToS3(secureFileDataBuffer, getUploadLink))) {
      clearInterval(interval);
      return ERROR_RESULT;
    }
    clearInterval(interval);
    storeService.dispatch(secureFileUploadDoneAction());
    storeService.dispatch(secureFileUploadClearAction());
    return {
      success: true,
      secureFileInfo,
    };
  }
  clearInterval(interval);
  storeService.dispatch(secureFileUploadErrorAction());
  return ERROR_RESULT;
}
