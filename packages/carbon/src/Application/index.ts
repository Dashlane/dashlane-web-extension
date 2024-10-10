import { v4 as uuidv4 } from "uuid";
import {
  getCommonAppSetting,
  initApplicationSettings,
  storeCommonAppSetting,
} from "Application/ApplicationSettings";
import { InitOptions } from "init-options";
import { CarbonServices, getCoreServices } from "Services/index";
import { loadAnonymousPartnerId } from "Session/Store/sdk/actions";
import { StoreService } from "Store";
import { sendExceptionLog } from "Logs/Exception";
import { initAuthentication } from "Authentication/Services/initAuthentication";
import { setPlatformInfo } from "Application/platform-info";
import { initializeAppSessionId } from "Application/session-id";
import { generate64BytesKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { base64BufferToText } from "Libs/CryptoCenter/Helpers/Helper";
import { StorageService } from "Libs/Storage/types";
import { InitMode } from "Sdk/Default/types";
export default async function initCarbonApplication(
  storeService: StoreService,
  storageService: StorageService,
  initMode: InitMode,
  { platformInfo, settings }: Pick<InitOptions, "platformInfo" | "settings">
) {
  try {
    console.log(`[background/carbon] Initializing Carbon application settings`);
    initializeAppSessionId(storeService);
    setPlatformInfo(platformInfo);
    await initApplicationSettings(storageService, storeService, initMode, {
      settings,
    });
    await ensureAnonymousComputerId();
    await ensureInstallationId();
    await ensureEventLoggerQueueKey();
  } catch (error) {
    console.error(
      `[background/carbon] Failed initializing Carbon application`,
      error
    );
    throw error;
  }
}
export const initAuthenticatedCarbonApplication = async (
  options: InitOptions,
  services: CarbonServices,
  initMode: InitMode
) => {
  if (initMode === InitMode.FirstInit) {
    await setSdkAuthentication(options, services);
  }
  const { storageService, storeService } = getCoreServices(services);
  await initCarbonApplication(storeService, storageService, initMode, options);
  return services;
};
export async function ensureDeviceId() {
  let deviceId = getCommonAppSetting("deviceId");
  if (!deviceId) {
    await storeCommonAppSetting("deviceId", createDeviceId());
    deviceId = getCommonAppSetting("deviceId");
  }
  return deviceId;
}
function ensureAnonymousComputerId() {
  const anonymousComputerId: string = getCommonAppSetting(
    "anonymousComputerId"
  );
  if (!anonymousComputerId) {
    return storeCommonAppSetting(
      "anonymousComputerId",
      createAnonymousComputerId()
    );
  }
}
function ensureInstallationId() {
  const installationId: string = getCommonAppSetting("installationId");
  if (!installationId) {
    return storeCommonAppSetting("installationId", uuidv4());
  }
  return Promise.resolve();
}
async function ensureEventLoggerQueueKey() {
  const eventLoggerQueueKey: string = getCommonAppSetting(
    "eventLoggerQueueKey"
  );
  if (!eventLoggerQueueKey) {
    const keyBuffer = await generate64BytesKey();
    const keyRaw = base64BufferToText(keyBuffer);
    return storeCommonAppSetting("eventLoggerQueueKey", keyRaw);
  }
}
function createDeviceId() {
  return uuidv4().replace(/-/g, "");
}
function createAnonymousComputerId() {
  return uuidv4();
}
const setSdkAuthentication = async (
  options: InitOptions,
  services: CarbonServices
) => {
  try {
    console.log(`[background/carbon] Initializing SDK authentication`);
    const coreServices = getCoreServices(services);
    const { storeService } = coreServices;
    if (options.anonymousPartnerId) {
      storeService.dispatch(loadAnonymousPartnerId(options.anonymousPartnerId));
    }
    await initAuthentication(coreServices, options.keys);
  } catch (error) {
    console.error(
      `[background/carbon] Failed initializing SDK authentication`,
      error
    );
    const message = `[Application] - setSdkAuthentication: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
  }
};
