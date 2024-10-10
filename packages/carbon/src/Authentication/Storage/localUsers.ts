import {
  makeDataEncryptorService,
  setObfuscatingKey,
} from "Libs/CryptoCenter/DataEncryptorService";
import { loadLocalUsersAuthenticationData } from "Authentication/Store/localUsers/actions";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception";
import { logError } from "Logs/Debugger";
import { CarbonError } from "Libs/Error";
import { localUsersAuthenticationDataSelector } from "Authentication/selectors";
import {
  utf8ChunkDecode,
  utf8ChunkEncode,
} from "Libs/CryptoCenter/Helpers/Helper";
import { StorageService } from "Libs/Storage/types";
import { StoreService } from "Store";
import { makeKeyDataEncryptorService } from "Libs/CryptoCenter/alter/keyBasedCrypto";
import { deflatedUtf8ToUtf16, utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
const base64 = require("base-64");
const LOCAL_USERS_AUTHENTICATION_DATA_STORAGE_KEY = "authentication.localusers";
export const persistLocalUsersAuthenticationData = async (
  storageService: StorageService,
  storeService: StoreService
) => {
  try {
    const asyncStorage = storageService.getLocalStorage();
    const dataEncryptorService = makeKeyDataEncryptorService();
    setObfuscatingKey(dataEncryptorService);
    const data = localUsersAuthenticationDataSelector(storeService.getState());
    const clearDataStr = JSON.stringify(data);
    const utfEncodedData = utf8ChunkEncode(clearDataStr);
    const base64EncodedData = base64.encode(utfEncodedData);
    const bytes = utf16ToDeflatedUtf8(base64EncodedData, {
      skipUtf8Encoding: true,
    });
    const cipheredDataStr = await dataEncryptorService
      .getInstance()
      .encrypt(bytes);
    await asyncStorage.writeItem(
      LOCAL_USERS_AUTHENTICATION_DATA_STORAGE_KEY,
      cipheredDataStr
    );
  } catch (error) {
    const tag = "Auth";
    const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
      tag,
      "persistLocalUsersAuthenticationData"
    );
    logError({
      tag: [tag],
      message: `${augmentedError}`,
      details: { error },
    });
    sendExceptionLog({ error: augmentedError });
  }
};
export const loadLocalUsersAuthenticationDataFromStorage = async (
  services: CoreServices
) => {
  try {
    const { storageService, storeService } = services;
    const asyncStorage = storageService.getLocalStorage();
    const dataEncryptorService = makeDataEncryptorService(storeService);
    setObfuscatingKey(dataEncryptorService);
    const cipheredDataStr = await asyncStorage.readItem(
      LOCAL_USERS_AUTHENTICATION_DATA_STORAGE_KEY
    );
    if (!cipheredDataStr) {
      return;
    }
    if (typeof cipheredDataStr !== "string") {
      throw new Error(
        "value of authentication.localusers is expected to be a string"
      );
    }
    const bytes = await dataEncryptorService
      .getInstance()
      .decrypt(cipheredDataStr);
    const base64Str = deflatedUtf8ToUtf16(bytes, {
      skipUtf8Decoding: true,
    });
    const utf8EncodedStr = base64.decode(base64Str);
    let clearDataStr = utf8EncodedStr;
    try {
      clearDataStr = utf8ChunkDecode(utf8EncodedStr);
    } catch (_error) {}
    const data = JSON.parse(clearDataStr);
    storeService.dispatch(loadLocalUsersAuthenticationData(data));
  } catch (error) {
    const tag = "Auth";
    const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
      tag,
      "loadLocalUsersAuthenticationDataFromStorage"
    );
    logError({
      tag: [tag],
      message: `${augmentedError}`,
      details: { error },
    });
    sendExceptionLog({ error: augmentedError });
  }
};
