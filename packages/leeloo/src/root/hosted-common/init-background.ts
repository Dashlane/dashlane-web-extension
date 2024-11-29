import { firstValueFrom } from "rxjs";
import { getApplicationClient } from "../../libs/application-client";
import { browser, os } from "@dashlane/browser-utils";
import { isLeelooPlatform } from "../../libs/platform/helpers";
import { TranslatorInterface } from "../../libs/i18n/types";
import { appAccessKey, appSecretKey } from "./common/app-keys";
import { getCloudflareKeys } from "./common/cloudflare-keys";
import LeelooBackgroundWorkerConstructor from "worker-loader!./background-worker/leeloo-background-worker";
import { PageToWorkerChannel } from "@dashlane/framework-infra";
const createBackgroundWorker = () => {
  const before = __webpack_public_path__;
  if (WORKER_BUILD_PATH) {
    __webpack_public_path__ = WORKER_BUILD_PATH;
  }
  const worker = new LeelooBackgroundWorkerConstructor();
  if (WORKER_BUILD_PATH) {
    __webpack_public_path__ = before;
  }
  return worker;
};
const getStyxKeys = (appBuildType: string) => {
  return {
    styxAccess: "__REDACTED__",
    styxSecret: "__REDACTED__",
  };
};
const getDashlaneAPIOverrides = () => {
  const dashlaneAPIOverrides = {
    DASHLANE_API_HOST_WITH_SCHEME: DASHLANE_API_ADDRESS,
    DASHLANE_WS_HOST_WITH_SCHEME: DASHLANE_WS_ADDRESS,
  };
  return Object.fromEntries(
    Object.entries(dashlaneAPIOverrides).filter(([, value]) => value)
  );
};
const carbonLocaleMapping = {
  "en-context": "en",
  "en-pending": "en",
  "en-pseudo": "en",
};
const getValidCarbonLanguage = (locale: string) =>
  carbonLocaleMapping[locale] || locale;
export function initBackgroundWorker(): Worker {
  return createBackgroundWorker();
}
export async function initBackground(
  backgroundWorker: Worker,
  translator: TranslatorInterface,
  lowLevelChannelToBackground: PageToWorkerChannel,
  appBuildTypeServerOverride?: string
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    try {
      backgroundWorker.addEventListener("error", (e: ErrorEvent) => {
        reject(e);
      });
      backgroundWorker.addEventListener("message", ({ data }) => {
        if (data && data.type === "initFailure") {
          reject(data.error);
        } else if (data && data.type === "initSuccess") {
          resolve();
        }
      });
      const buildType = appBuildTypeServerOverride || APP_BUILD_TYPE;
      const locale = translator.getLocale();
      backgroundWorker.postMessage({
        type: "init",
        platformInfo: {
          browser: browser.getBrowserName(),
          browserVersion: browser.getBrowserVersion(),
          country: browser.getBrowserCountry(),
          os: os.getOSName(),
          osCountry: browser.getBrowserCountry(),
          osVersion: os.getOSVersion(),
          platformName: PLATFORM_NAME,
          appVersion: VERSION,
          lang: getValidCarbonLanguage(locale),
          buildType,
        },
        config: {
          ...getDashlaneAPIOverrides(),
        },
        publicPath: PUBLIC_PATH,
        keys: {
          appAccess: appAccessKey,
          appSecret: appSecretKey,
          ...getStyxKeys(buildType),
          ...(getCloudflareKeys() ?? {}),
        },
        settings: {
          sync: {
            syncWithLocalClients: isLeelooPlatform(),
          },
        },
      });
    } catch (err) {
      reject(err);
    }
  });
  lowLevelChannelToBackground.setConnected();
  const client = getApplicationClient();
  const userSessionSyncStatus$ = client["carbon-legacy"].queries.carbonState({
    path: "userSession.sync.status",
  });
  await firstValueFrom(userSessionSyncStatus$);
}
