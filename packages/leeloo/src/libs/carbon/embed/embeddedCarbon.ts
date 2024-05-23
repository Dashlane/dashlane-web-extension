import { browser, os } from '@dashlane/browser-utils';
import { DashlaneAPISchemes, DashlaneAPISchemesNames } from '@dashlane/carbon';
import { createEventBus } from 'ts-event-bus';
import { isLeelooPlatform } from 'libs/platform/helpers';
import { CarbonEvents, carbonEvents } from 'libs/carbon/connector/events';
import { WorkerChannel } from './workerChannel';
import { appAccessKey, appSecretKey } from './app-keys';
import CarbonWorkerConstructor from 'worker-loader!./carbonWorker';
import { getCloudflareKeys } from 'libs/cloudflare-keys';
const createCarbonWorker = () => {
    const before = __webpack_public_path__;
    if (WORKER_BUILD_PATH) {
        __webpack_public_path__ = WORKER_BUILD_PATH;
    }
    const worker = new CarbonWorkerConstructor();
    if (WORKER_BUILD_PATH) {
        __webpack_public_path__ = before;
    }
    return worker;
};
const getStyxKeys = (appBuildType: string) => {
    if (appBuildType === 'DEV' || appBuildType === 'QA') {
        return {
            styxAccess: '*****',
            styxSecret: '*****',
        };
    }
    return {
        styxAccess: '*****',
        styxSecret: '*****',
    };
};
const getDashlaneAPIOverrides = (): Partial<DashlaneAPISchemes> => {
    const dashlaneAPIOverrides = {
        [DashlaneAPISchemesNames.DASHLANE_API_HOST_WITH_SCHEME]: DASHLANE_API_ADDRESS,
        [DashlaneAPISchemesNames.DASHLANE_WS_HOST_WITH_SCHEME]: DASHLANE_WS_ADDRESS,
    };
    return Object.fromEntries(Object.entries(dashlaneAPIOverrides).filter(([, value]) => value));
};
const carbonLocaleMapping = {
    'en-context': 'en',
    'en-pending': 'en',
    'en-pseudo': 'en',
};
const getValidCarbonLanguage = (locale: string) => carbonLocaleMapping[locale] || locale;
let carbonWorker: Worker;
const carbonChannel = new WorkerChannel({
    type: 'CarbonLeeloo',
    isHost: false,
    timeout: 10 * 60 * 1000,
});
export const getEmbeddedCarbonConnector = (): CarbonEvents => {
    return createEventBus({
        events: carbonEvents,
        channels: [carbonChannel],
    });
};
export const loadEmbeddedCarbon = (): Promise<Worker> => {
    return new Promise((resolve, reject) => {
        require.ensure([], () => {
            try {
                carbonWorker = createCarbonWorker();
                carbonChannel.setWorker(carbonWorker);
                resolve(carbonWorker);
            }
            catch (err) {
                reject(err);
            }
        }, 'carbon');
    });
};
export const initEmbeddedCarbon = (locale: string, appBuildType?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        require.ensure([], async () => {
            try {
                carbonWorker.addEventListener('error', (e: ErrorEvent) => {
                    reject(e);
                });
                carbonWorker.addEventListener('message', ({ data }) => {
                    if (data && data.type === 'initFailure') {
                        reject(data.error);
                    }
                    else if (data && data.type === 'initSuccess') {
                        resolve();
                    }
                });
                const transfered: Transferable[] = [];
                const buildType = appBuildType || APP_BUILD_TYPE;
                carbonWorker.postMessage({
                    type: 'init',
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
                        userABTestNames: ['web_winback_test'],
                        buildType,
                    },
                }, transfered);
            }
            catch (err) {
                reject(err);
            }
        }, 'carbon');
    });
};
