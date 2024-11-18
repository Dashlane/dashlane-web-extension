import {
  RecoverUserDataError,
  RecoverUserDataResult,
  RecoveryApiErrorType,
  RecoverySessionCredential,
} from "@dashlane/communication";
import { ukiSelector } from "Authentication";
import { deflateUtf16, inflateUtf16 } from "Libs/CryptoCenter";
import { makeDataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import {
  arrayBufferToText,
  base64ToBuffer,
  bufferToBase64,
} from "Libs/CryptoCenter/Helpers/Helper";
import { generateAESKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { makeAsymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
import {
  ARGON2_DEFAULT_PAYLOAD,
  getCryptoConfig,
  parseCipheredData,
  parsePayload,
} from "Libs/CryptoCenter/transportable-data";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { UserLocalDataService } from "Libs/Storage/User";
import { WSService } from "Libs/WS";
import { GetSetupRequisitesData, Recipient } from "Libs/WS/Recovery/types";
import { sendExceptionLog } from "Logs/Exception";
import {
  accountRecoveryOptInSelector,
  activeSpacesSelector,
  masterPasswordSelector,
  recoveryKeySelector,
  userLoginSelector,
} from "Session/selectors";
import { isSSOUserSelector } from "Session/sso.selectors";
import { saveRecoverySessionData } from "Session/Store/recovery/actions";
import { updateLocalKey } from "Session/Store/session/actions";
import {
  recoveryDataSelector,
  recoveryInProgressSelector,
} from "Session/recovery.selectors";
import { PersistData } from "Session/types";
import { State, StoreService } from "Store";
import { isRecoveryEnabledSelector } from "Team/selectors";
import { CoreServices } from "Services";
import { setupAccountRecoveryForDevice } from "./recovery-setup";
import {
  recoveryHashFromPersonalSettingsSelector,
  recoveryHashFromPremiumStatusSelector,
} from "Recovery/selectors";
interface RecoveryBaseParams {
  teamId: number;
  login: string;
  uki: string;
}
function getWSRecoveryBaseParams(
  storeService: StoreService
): RecoveryBaseParams {
  const state = storeService.getState();
  const activeSpaces = activeSpacesSelector(state);
  const teamSpace = activeSpaces[0];
  const teamIdString = teamSpace?.teamId;
  if (!teamIdString) {
    throw new Error(
      `[getSetupRequisitesData] - user should be part of a team to activate Account Recovery`
    );
  }
  const teamId = Number(teamIdString);
  const login = userLoginSelector(state);
  const uki = ukiSelector(state);
  if (!login || !uki) {
    throw new Error(`[getSetupRequisitesData] - missing login or uki`);
  }
  return {
    teamId,
    login,
    uki,
  };
}
export async function getSetupRequisitesData(
  storeService: StoreService,
  wsService: WSService
): Promise<GetSetupRequisitesData> {
  try {
    const { teamId, login, uki } = getWSRecoveryBaseParams(storeService);
    const { content } = await wsService.recovery.getSetupRequisites({
      login,
      uki,
      teamId,
    });
    return content;
  } catch (error) {
    throw new Error(
      `[getSetupRequisitesData] - getSetupRequisites failed with error ${error}`
    );
  }
}
interface GetRecoveryKey {
  recoveryKeyBufferClear: ArrayBuffer;
  recoveryKeyBase64Clear: string;
  recoveryKeyRawClear: string;
}
export async function getRecoveryKey(
  storeService: StoreService
): Promise<GetRecoveryKey> {
  const state = storeService.getState();
  let recoveryKeyBase64Clear = recoveryKeySelector(state);
  let recoveryKeyBufferClear;
  if (!recoveryKeyBase64Clear) {
    recoveryKeyBufferClear = await generateAESKey();
    recoveryKeyBase64Clear = bufferToBase64(recoveryKeyBufferClear);
  } else {
    recoveryKeyBufferClear = base64ToBuffer(recoveryKeyBase64Clear);
  }
  return {
    recoveryKeyBufferClear,
    recoveryKeyBase64Clear,
    recoveryKeyRawClear: atob(recoveryKeyBase64Clear),
  };
}
interface EncryptRecoveryDataParams {
  storeService: StoreService;
  encryptionKey: string;
  data: ArrayBuffer;
}
export async function encryptRecoveryData({
  storeService,
  encryptionKey,
  data,
}: EncryptRecoveryDataParams): Promise<string> {
  const emptyServerKey = "";
  const dataEncryptorService = makeDataEncryptorService(storeService);
  const cryptoConfig = getCryptoConfig(storeService);
  dataEncryptorService.setInstance(
    { raw: encryptionKey },
    emptyServerKey,
    cryptoConfig
  );
  const encryptedData = await dataEncryptorService.getInstance().encrypt(data);
  dataEncryptorService.close();
  return encryptedData;
}
interface DecryptRecoveryData {
  storeService: StoreService;
  encryptedData: string;
  encryptionKey: string;
}
async function decryptRecoveryData({
  storeService,
  encryptedData,
  encryptionKey,
}: DecryptRecoveryData): Promise<ArrayBuffer> {
  const emptyServerKey = "";
  const dataEncryptorService = makeDataEncryptorService(storeService);
  const { cryptoConfig } = parsePayload(ARGON2_DEFAULT_PAYLOAD);
  dataEncryptorService.setInstance(
    { raw: encryptionKey },
    emptyServerKey,
    cryptoConfig
  );
  const recoveryDataArrayBuffer = await dataEncryptorService
    .getInstance()
    .decrypt(encryptedData, { logging: true });
  dataEncryptorService.close();
  return recoveryDataArrayBuffer;
}
interface AdminProtectedSymmetricalKey {
  login: string;
  key: string;
}
export async function getAdminProtectedSymmetricalKeys(
  recipients: Recipient[],
  serverProtectedSymmetricalKey: string
): Promise<AdminProtectedSymmetricalKey[]> {
  const cryptoService = makeAsymmetricEncryption();
  const adminProtectedKeys = [];
  for (const recipient of recipients) {
    const { login, publicKey } = recipient;
    const key = await cryptoService.encrypt(
      publicKey,
      serverProtectedSymmetricalKey
    );
    adminProtectedKeys.push({
      login,
      key,
    });
  }
  return adminProtectedKeys;
}
export async function sendAdminProtectedSymmetricalKeys(
  storeService: StoreService,
  wsService: WSService,
  adminProtectedSymmetricalKeys: AdminProtectedSymmetricalKey[]
): Promise<void> {
  try {
    const recoveryClientKeys = JSON.stringify(adminProtectedSymmetricalKeys);
    const { teamId, login, uki } = getWSRecoveryBaseParams(storeService);
    await wsService.recovery.setRecoveryClientKeys({
      login,
      uki,
      recoveryClientKeys,
      teamId,
    });
    return;
  } catch (error) {
    throw new Error(
      `[sendAdminProtectedSymmetricalKeys] - setRecoveryClientKeys failed with error ${error}`
    );
  }
}
export async function resetAdminProtectedSymmetricalKeys(
  storeService: StoreService,
  wsService: WSService
): Promise<void> {
  try {
    const { teamId, login, uki } = getWSRecoveryBaseParams(storeService);
    const emptyRecoveryClientKeys = JSON.stringify([]);
    await wsService.recovery.setRecoveryClientKeys({
      login,
      uki,
      recoveryClientKeys: emptyRecoveryClientKeys,
      teamId,
    });
    return;
  } catch (error) {
    throw new Error(
      `[resetAdminProtectedSymmetricalKeys] - setRecoveryClientKeys failed with error ${error}`
    );
  }
}
export async function encryptUkiAndPrivateKey(
  recoveryUki: string,
  privateKey: string,
  masterPassword: string,
  storeService: StoreService
): Promise<string> {
  const recoveryDataJSON = JSON.stringify({
    recoveryUki,
    privateKey,
  });
  const recoveryDataBuffer = deflateUtf16(recoveryDataJSON);
  const recoveryDataEncrypted = await encryptRecoveryData({
    storeService,
    encryptionKey: masterPassword,
    data: recoveryDataBuffer,
  });
  return recoveryDataEncrypted;
}
export async function sendRecoveryRequestToAdmin(
  storeService: StoreService,
  wsService: WSService
): Promise<void> {
  try {
    const state = storeService.getState();
    const login = userLoginSelector(state);
    const { recoveryUki, publicKey } = recoveryDataSelector(state);
    if (!login || !recoveryUki || !publicKey) {
      throw new Error("Missing recoveryUki or publicKey");
    }
    await wsService.recovery.request({
      login,
      uki: recoveryUki,
      publicKey,
    });
    return;
  } catch (error) {
    throw new Error(
      `[sendAccountRecoveryRequest] - failed with error ${error}`
    );
  }
}
export function isARAvailableForUser(state: State): boolean {
  const isSSOUser = isSSOUserSelector(state);
  const isFeatureOptInForTeam = isRecoveryEnabledSelector(state);
  return !isSSOUser && isFeatureOptInForTeam;
}
export function isARFeatureActivatedForUser(state: State): boolean {
  const isARAvailable = isARAvailableForUser(state);
  const isAccountRecoveryOptIn = accountRecoveryOptInSelector(state);
  return isARAvailable && isAccountRecoveryOptIn;
}
async function shouldSetupAccountRecovery(
  storeService: StoreService,
  localStorageService: LocalStorageService
): Promise<boolean> {
  const state = storeService.getState();
  const isFeatureActivatedForUser = isARFeatureActivatedForUser(state);
  if (!isFeatureActivatedForUser) {
    return Promise.resolve(false);
  }
  const { persistData } = storeService.getAccountInfo();
  if (persistData === PersistData.PERSIST_DATA_NO) {
    return Promise.resolve(false);
  }
  const hasRecoveryKeyInSettings = !!recoveryKeySelector(state);
  const hasRecoveryKeyInLocalStorage = !!(await localStorageService
    .getInstance()
    .doesRecoveryLocalKeyExist());
  if (hasRecoveryKeyInSettings && hasRecoveryKeyInLocalStorage) {
    const lastStoredHash = recoveryHashFromPersonalSettingsSelector(state);
    const lastUpdatedHash = recoveryHashFromPremiumStatusSelector(state);
    return lastStoredHash !== lastUpdatedHash;
  }
  return true;
}
async function shouldCleanAccountRecovery(
  storeService: StoreService,
  localStorageService: LocalStorageService
): Promise<boolean> {
  const state = storeService.getState();
  const isFeatureActivatedForUser = isARFeatureActivatedForUser(state);
  const localStorage = localStorageService.getInstance();
  const hasRecoveryKeyInLocalStorage =
    !!(await localStorage.doesRecoveryLocalKeyExist());
  const hasRecoverySessionCredentialInLocalStorage =
    !!(await localStorage.doesRecoverySessionCredentialExist());
  const hasRecoveryDataInStorage =
    hasRecoveryKeyInLocalStorage || hasRecoverySessionCredentialInLocalStorage;
  return !isFeatureActivatedForUser && hasRecoveryDataInStorage;
}
export async function triggerCleanOrSetupAccountRecovery(
  services: CoreServices
): Promise<void> {
  const { storeService, localStorageService, wsService } = services;
  const state = storeService.getState();
  const isRecoveryInProgress = recoveryInProgressSelector(state);
  if (isRecoveryInProgress) {
    return;
  }
  await localStorageService.getInstance().cleanRecoveryData();
  const shouldTriggerARSetup = await shouldSetupAccountRecovery(
    storeService,
    localStorageService
  );
  if (shouldTriggerARSetup) {
    await setupAccountRecoveryForDevice(
      storeService,
      localStorageService,
      wsService
    );
    return;
  }
  const shouldTriggerARCleanup = await shouldCleanAccountRecovery(
    storeService,
    localStorageService
  );
  if (shouldTriggerARCleanup) {
    await localStorageService.getInstance().cleanRecoverySetupData();
  }
}
export interface RecoveryLocalData {
  recoveryUki: string;
  privateKey: string;
}
export async function retrieveRecoveryUkiFromStorage(
  storeService: StoreService,
  localStorageService: LocalStorageService,
  masterPassword: string
): Promise<string> {
  try {
    const encryptedData = await localStorageService
      .getInstance()
      .getRecoveryData();
    const bytes = await decryptRecoveryData({
      storeService,
      encryptedData,
      encryptionKey: masterPassword,
    });
    const recoveryDataJSON = inflateUtf16(bytes);
    const { recoveryUki } = JSON.parse(recoveryDataJSON) as RecoveryLocalData;
    return recoveryUki;
  } catch (error) {
    const augmentedMessages = `retrieveRecoveryUkiFromStorage failed with error ${error.message}`;
    throw new Error(augmentedMessages);
  }
}
export const recoveryFlowError = (
  code: RecoveryApiErrorType,
  message: string
): RecoverUserDataError => {
  const augmentedError = new Error(`[AccountRecovery]: ${code} ${message}`);
  sendExceptionLog({ error: augmentedError });
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
export async function validateInitialData(
  state: State,
  localInstance: UserLocalDataService
): Promise<RecoverUserDataResult> {
  if (
    !(await localInstance.doesRecoveryLocalKeyExist()) ||
    !(await localInstance.doesRecoveryDataExist()) ||
    !(await localInstance.doesRecoverySessionCredentialExist())
  ) {
    return recoveryFlowError(
      RecoveryApiErrorType.RecoverUserDataFailed,
      "Missing local data"
    );
  }
  const { userServerProtectedSymmetricalKey, recoveryServerKeyBase64 } =
    recoveryDataSelector(state);
  if (!userServerProtectedSymmetricalKey || !recoveryServerKeyBase64) {
    return recoveryFlowError(
      RecoveryApiErrorType.RecoveryRequestFailed,
      "missing payload"
    );
  }
  return { success: true };
}
export async function extractPrivateKeyFromRecoveryData(
  services: CoreServices,
  masterPassword: string,
  addLogHistory: (message: string) => void
): Promise<string> {
  const { localStorageService, storeService } = services;
  const localInstance = localStorageService.getInstance();
  addLogHistory(`extractPrivateKeyFromRecoveryData - getRecoveryData`);
  const encryptedData = await localInstance.getRecoveryData();
  const platformInfo = storeService.getPlatformInfo();
  addLogHistory(`[extra] platform: ${platformInfo.platformName}`);
  addLogHistory(
    `[extra] browser: ${platformInfo.browser} @ ${platformInfo.browserVersion}`
  );
  const dataBuffer = base64ToBuffer(encryptedData);
  const dashlaneSecureData = parseCipheredData(new Uint8Array(dataBuffer));
  addLogHistory(
    `[extra] cryptoConfig derivation: ${JSON.stringify(
      dashlaneSecureData.cryptoConfig
    )}`
  );
  addLogHistory(`extractPrivateKeyFromRecoveryData - decryptRecoveryData`);
  const bytes = await decryptRecoveryData({
    storeService,
    encryptedData,
    encryptionKey: masterPassword,
  });
  addLogHistory(`extractPrivateKeyFromRecoveryData - inflateUtf16 data`);
  const recoveryDataJSON = inflateUtf16(bytes);
  addLogHistory(`extractPrivateKeyFromRecoveryData - parse JSON data`);
  const { recoveryUki, privateKey } = JSON.parse(
    recoveryDataJSON
  ) as RecoveryLocalData;
  storeService.dispatch(saveRecoverySessionData({ recoveryUki }));
  return privateKey;
}
export async function extractRecoveryKey(
  storeService: StoreService,
  serverProtectedSymmetricalKeyBase64: string,
  addLogHistory: (message: string) => void
): Promise<string> {
  const state = storeService.getState();
  const { recoveryServerKeyBase64 } = recoveryDataSelector(state);
  if (!recoveryServerKeyBase64) {
    throw new Error(`Missing payload`);
  }
  const recoveryServerKey = atob(recoveryServerKeyBase64);
  const platformInfo = storeService.getPlatformInfo();
  addLogHistory(`[extra] platform: ${platformInfo.platformName}`);
  addLogHistory(
    `[extra] browser: ${platformInfo.browser} @ ${platformInfo.browserVersion}`
  );
  const dataBuffer = base64ToBuffer(serverProtectedSymmetricalKeyBase64);
  const dashlaneSecureData = parseCipheredData(new Uint8Array(dataBuffer));
  addLogHistory(
    `[extra] cryptoConfig derivation: ${JSON.stringify(
      dashlaneSecureData.cryptoConfig
    )}`
  );
  addLogHistory(`extractRecoveryKey - decryptRecoveryData`);
  const recoveryKeyArrayBuffer = await decryptRecoveryData({
    storeService,
    encryptedData: serverProtectedSymmetricalKeyBase64,
    encryptionKey: recoveryServerKey,
  });
  addLogHistory(`extractRecoveryKey - arrayBufferToText`);
  return arrayBufferToText(recoveryKeyArrayBuffer);
}
export async function extractLocalKey(
  services: CoreServices,
  recoveryKey: string,
  addLogHistory: (message: string) => void
): Promise<string> {
  const { storeService, localStorageService } = services;
  const localInstance = localStorageService.getInstance();
  addLogHistory(`extractLocalKey - getRecoveryLocalKey`);
  const localKeyEncrypted = await localInstance.getRecoveryLocalKey();
  const platformInfo = services.storeService.getPlatformInfo();
  addLogHistory(`[extra] platform: ${platformInfo.platformName}`);
  addLogHistory(
    `[extra] browser: ${platformInfo.browser} @ ${platformInfo.browserVersion}`
  );
  const dataBuffer = base64ToBuffer(localKeyEncrypted);
  const dashlaneSecureData = parseCipheredData(new Uint8Array(dataBuffer));
  addLogHistory(
    `[extra] cryptoConfig derivation: ${JSON.stringify(
      dashlaneSecureData.cryptoConfig
    )}`
  );
  addLogHistory(`extractLocalKey - decryptRecoveryData`);
  const localKeyArray = await decryptRecoveryData({
    storeService,
    encryptedData: localKeyEncrypted,
    encryptionKey: recoveryKey,
  });
  addLogHistory(`extractLocalKey - inflateUtf16 localKey`);
  return inflateUtf16(localKeyArray);
}
export async function prepareLocalDataEncryptorService(
  services: CoreServices,
  localKeyRawClear: string
): Promise<void> {
  const { localDataEncryptorService, storeService } = services;
  const serverKey = services.storeService.getUserSession().serverKey;
  const cryptoConfig = getNoDerivationCryptoConfig();
  localDataEncryptorService.setInstance(
    { raw: localKeyRawClear },
    serverKey,
    cryptoConfig
  );
  await localDataEncryptorService.getInstance().prepareCrypto();
  storeService.dispatch(updateLocalKey(localKeyRawClear));
}
export async function storeSessionCredentialForRecovery(
  storeService: StoreService,
  localStorageService: LocalStorageService
): Promise<void> {
  const state = storeService.getState();
  const masterPassword = masterPasswordSelector(state);
  if (isARFeatureActivatedForUser(state) && masterPassword) {
    const sessionCredential: RecoverySessionCredential = {
      masterPassword,
      recoveryKey: null,
    };
    const base64StringSessionCredential = btoa(
      JSON.stringify(sessionCredential)
    );
    await localStorageService
      .getInstance()
      .storeRecoverySessionCredential(base64StringSessionCredential);
  }
}
