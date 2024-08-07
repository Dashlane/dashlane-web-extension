import { GetLoginStatus } from '@dashlane/communication';
import { BROWSER_MAIN_FRAME_ID } from '../../implementation/abstractions/messaging/common';
import { logException } from '../../implementation/abstractions/logs/exception-logs';
import { AutofillEngineActionsWithOptions, AutofillEngineActionTarget, makeAutofillEngineActionSerializer, } from '../../implementation/abstractions/messaging/action-serializer';
import { isSerializedAutofillEngineCommand } from '../../implementation/abstractions/messaging/command-serializer';
import { PortStore } from '../../implementation/abstractions/messaging/page-to-worker-transport/port-store';
import { AutofillEngineCommandHandlers } from '../../implementation/commands/handlers';
import { createRightClickMenu } from '../../implementation/modules/analysis/user-right-click-on-element-handler';
import { checkFeatureInCarbonFFs, isFeatureFFInStorage, replicateFFInStorage, updateUserDetailsAndAnalysisStatus, } from '../../implementation/modules/analysis/utils';
import { registerBasicAuthListeners } from '../../implementation/modules/autofill/basic-auth';
import { BrowserApi } from '../types/browser/browser-api';
import { AutofillEngineExceptionLogger, AutofillEngineMessageLogger, } from '../types/logger';
import { STORAGE_KEY_FOR_GLOBAL_STATE, STORAGE_KEY_FOR_TAB_STATE_PREFIX, } from './constants';
import { AutofillEngineConnectors, AutofillEngineContext, AutofillEngineInjectedConnectors, GlobalState, initialGlobalState, State, } from './context';
import { makeAutofillEngineActionBroadcaster, makeAutofillEngineActionSender, } from './message';
import { subscribeToAutofillSettingsChange } from './queries/subscribe-to-autofill-settings-change';
import { validateMessageSender } from './security';
import { AutofillEngineStateStorage } from './state';
import { cleanupPersistedStorageKeys } from './storage-cleanup';
import { queryActiveInjectableTabs, queryInjectableTabs } from './tabs';
const storageKeyForTab = (tabId: number) => `${STORAGE_KEY_FOR_TAB_STATE_PREFIX}${tabId}`;
const UNDEFINED_GLOBAL_STATE_ERROR = 'Unexpected undefined global state';
const UNDEFINED_TAB_STATE_ERROR = 'Unexpected undefined tab state';
const INJECT_SCRIPT_ON_START_FF = 'autofill_web_injectScriptOnStart';
const INJECT_SCRIPT_ON_START_FF_DEV = 'autofill_web_injectScriptOnStart_dev';
const INJECT_SCRIPT_ON_START_OPTIONS_KEY = 'options.useInjectScriptOnStart';
const checkInjectScriptOnStartFF = async (browserApi: BrowserApi, messageLogger: AutofillEngineMessageLogger, connectors: AutofillEngineConnectors) => {
    try {
        const isFeatureInCarbon = await checkFeatureInCarbonFFs(connectors, [
            INJECT_SCRIPT_ON_START_FF,
            INJECT_SCRIPT_ON_START_FF_DEV,
        ]);
        const isFeatureInStorage = await isFeatureFFInStorage(browserApi, INJECT_SCRIPT_ON_START_OPTIONS_KEY);
        if (isFeatureInCarbon !== isFeatureInStorage) {
            void replicateFFInStorage(browserApi, messageLogger, {
                key: INJECT_SCRIPT_ON_START_OPTIONS_KEY,
                value: isFeatureInCarbon,
            });
        }
    }
    catch (err) {
        throw new Error(`Error in checkInjectScriptOnStartFF: ${err}`);
    }
};
export async function setupConnectors(injectedConnectors: AutofillEngineInjectedConnectors): Promise<AutofillEngineConnectors> {
    const grapheneClient = await injectedConnectors.grapheneClientPromise;
    return {
        ...injectedConnectors,
        grapheneClient,
    };
}
const buildStateForTab = (tabId: number, stateStorage: AutofillEngineStateStorage, exceptionLogger: AutofillEngineExceptionLogger): State => {
    return {
        global: {
            get: async () => {
                const state = await stateStorage.getState(STORAGE_KEY_FOR_GLOBAL_STATE);
                if (state === undefined) {
                    exceptionLogger(new Error(UNDEFINED_GLOBAL_STATE_ERROR), {
                        fileName: 'start.ts',
                        funcName: 'buildStateForTab',
                        omitPrefix: true,
                    });
                    return {};
                }
                return state;
            },
            set: (newState) => stateStorage.setState(STORAGE_KEY_FOR_GLOBAL_STATE, newState),
        },
        tab: {
            get: async () => {
                const state = await stateStorage.getState(storageKeyForTab(tabId));
                if (state === undefined) {
                    exceptionLogger(new Error(UNDEFINED_TAB_STATE_ERROR), {
                        fileName: 'start.ts',
                        funcName: 'buildStateForTab',
                        omitPrefix: true,
                    });
                    return {};
                }
                return state;
            },
            set: (newState) => stateStorage.setState(storageKeyForTab(tabId), newState),
        },
    };
};
const buildStateForPopup = (stateStorage: AutofillEngineStateStorage, exceptionLogger: AutofillEngineExceptionLogger): State => {
    return {
        global: {
            get: async () => {
                const state = await stateStorage.getState(STORAGE_KEY_FOR_GLOBAL_STATE);
                if (state === undefined) {
                    exceptionLogger(new Error(UNDEFINED_GLOBAL_STATE_ERROR), {
                        fileName: 'start.ts',
                        funcName: 'buildStateForPopup',
                        omitPrefix: true,
                    });
                    return {};
                }
                return state;
            },
            set: (newState) => stateStorage.setState(STORAGE_KEY_FOR_GLOBAL_STATE, newState),
        },
        tab: {
            get: () => {
                throw new Error(`Can't access tab state in a command called from Popup`);
            },
            set: () => {
                throw new Error(`Can't change tab state in a command called from Popup`);
            },
        },
    };
};
const onMessageListener = (args: {
    browserApi: BrowserApi;
    injectedConnectors: AutofillEngineInjectedConnectors;
    openPorts: PortStore;
    stateStorage: AutofillEngineStateStorage;
    messageLogger: AutofillEngineMessageLogger;
    message: unknown;
    port?: chrome.runtime.Port;
    sender?: chrome.runtime.MessageSender;
    sendResponse: (response?: unknown) => void;
}): boolean => {
    const { browserApi, injectedConnectors, openPorts, stateStorage, message, messageLogger, port, sender, sendResponse, } = args;
    const messageSender = port?.sender ?? sender;
    if (!isSerializedAutofillEngineCommand(message) || !messageSender) {
        return false;
    }
    const exceptionLogger: AutofillEngineExceptionLogger = (exception: unknown, log?: {
        funcName: string;
        fileName: string;
        message?: string;
        omitPrefix?: boolean;
    }) => {
        setupConnectors(injectedConnectors).then((connectors) => logException(exception, 'autofillEngineException', connectors, messageLogger, log?.omitPrefix
            ? { ...log }
            : {
                ...log,
                message: `Exception processing command ${message.cmd}`,
            }));
    };
    const handleMessage = async () => {
        let context: AutofillEngineContext;
        let actions: AutofillEngineActionsWithOptions;
        const connectors = await setupConnectors(injectedConnectors);
        if (messageSender.tab?.id) {
            const tabId = messageSender.tab.id;
            if (!*****) {
                messageLogger(`Received command from tab ${tabId} / frame ${messageSender.frameId}`, { content: message });
            }
            context = {
                state: buildStateForTab(tabId, stateStorage, exceptionLogger),
                browserApi,
                command: message,
                connectors,
                grapheneClient: connectors.grapheneClient,
                logException: exceptionLogger,
            };
            actions = makeAutofillEngineActionSerializer(makeAutofillEngineActionSender({
                browserApi,
                messageLogger,
                tabId,
                openPorts,
                sender,
                port,
            }));
        }
        else {
            if (!*****) {
                messageLogger(`Received command from Popup`, { content: message });
            }
            context = {
                state: buildStateForPopup(stateStorage, exceptionLogger),
                browserApi,
                connectors,
                grapheneClient: connectors.grapheneClient,
                logException: exceptionLogger,
            };
            actions = makeAutofillEngineActionSerializer(makeAutofillEngineActionBroadcaster(browserApi, messageLogger, openPorts));
        }
        await validateMessageSender(context, messageSender, message.cmd);
        await AutofillEngineCommandHandlers[message.cmd](context, actions, messageSender, ...message.parameters);
    };
    void handleMessage()
        .catch((exception) => {
        exceptionLogger(exception, {
            fileName: 'start.ts',
            funcName: 'runtimeOnMessageListener',
            message: '',
        });
    })
        .finally(() => sendResponse());
    return true;
};
const onGetUserLoginStatus = async (browserApi: BrowserApi, injectedConnectors: AutofillEngineInjectedConnectors, openPorts: PortStore, messageLogger: AutofillEngineMessageLogger, { loggedIn }: GetLoginStatus): Promise<void> => {
    const connectors = await setupConnectors(injectedConnectors);
    if (loggedIn) {
        subscribeToAutofillSettingsChange(browserApi, connectors, openPorts, messageLogger, connectors.grapheneClient);
        void checkInjectScriptOnStartFF(browserApi, messageLogger, connectors);
    }
    const [tab] = await queryActiveInjectableTabs(browserApi);
    if (tab?.url) {
        const actionSerializer = makeAutofillEngineActionSerializer(makeAutofillEngineActionSender({
            browserApi,
            messageLogger,
            tabId: tab.id ?? 0,
            openPorts,
        }));
        await updateUserDetailsAndAnalysisStatus(connectors, connectors.grapheneClient, actionSerializer, AutofillEngineActionTarget.AllFrames, tab.url, loggedIn);
    }
};
const buildGlobalState = (stateStorage: AutofillEngineStateStorage, exceptionLogger: AutofillEngineExceptionLogger): GlobalState => {
    let isGlobalStateInitialized = false;
    return {
        get: async () => {
            let state = await stateStorage.getState(STORAGE_KEY_FOR_GLOBAL_STATE);
            if (state === undefined) {
                exceptionLogger(new Error(UNDEFINED_GLOBAL_STATE_ERROR), {
                    fileName: 'start.ts',
                    funcName: 'startAutofillEngine',
                });
                return {};
            }
            if (!isGlobalStateInitialized) {
                state = { ...state, ...initialGlobalState };
                await stateStorage.setState(STORAGE_KEY_FOR_GLOBAL_STATE, state);
                isGlobalStateInitialized = true;
            }
            return state;
        },
        set: (newState) => stateStorage.setState(STORAGE_KEY_FOR_GLOBAL_STATE, newState),
    };
};
const tabsOnHighlightedListener = async (browserApi: BrowserApi, injectedConnectors: AutofillEngineInjectedConnectors, openPorts: PortStore, messageLogger: AutofillEngineMessageLogger, highlightInfo: chrome.tabs.TabHighlightInfo): Promise<void> => {
    const connectors = await setupConnectors(injectedConnectors);
    const { loggedIn }: GetLoginStatus = await connectors.carbon.getUserLoginStatus();
    const injectableHighlightedTabs = (await queryInjectableTabs(browserApi)).filter((tab) => tab.url && tab.id && highlightInfo.tabIds.includes(tab.id));
    await Promise.all(injectableHighlightedTabs.map(async (tab) => {
        const sendToTab = makeAutofillEngineActionSender({
            browserApi,
            messageLogger,
            tabId: tab.id ?? 0,
            openPorts,
        });
        const actions = makeAutofillEngineActionSerializer(sendToTab);
        await updateUserDetailsAndAnalysisStatus(connectors, connectors.grapheneClient, actions, AutofillEngineActionTarget.AllFrames, tab.url ?? '', loggedIn);
        actions.updateTabActiveInfo(AutofillEngineActionTarget.AllFrames, true);
    }));
};
export const startAutofillEngine = (browserApi: BrowserApi, injectedConnectors: AutofillEngineInjectedConnectors, stateStorage: AutofillEngineStateStorage, messageLogger: AutofillEngineMessageLogger): void => {
    const exceptionLogger: AutofillEngineExceptionLogger = (exception: unknown, log?: {
        funcName: string;
        fileName: string;
        message?: string;
    }) => {
        setupConnectors(injectedConnectors).then((connectors) => logException(exception, 'autofillEngineException', connectors, messageLogger, log ?? {}));
    };
    try {
        const openPorts = new PortStore();
        void createRightClickMenu(browserApi, messageLogger, exceptionLogger, buildGlobalState(stateStorage, exceptionLogger));
        injectedConnectors.carbon.liveLoginStatus.on(async (loginStatus: GetLoginStatus) => {
            try {
                await onGetUserLoginStatus(browserApi, injectedConnectors, openPorts, messageLogger, loginStatus);
            }
            catch (error) {
                exceptionLogger(error, {
                    message: 'Exception in liveLoginStatus handler',
                    fileName: 'start.ts',
                    funcName: 'startAutofillEngine',
                });
            }
        });
        void injectedConnectors.carbon
            .getUserLoginStatus()
            .then(async (loginStatus: GetLoginStatus) => {
            try {
                await onGetUserLoginStatus(browserApi, injectedConnectors, openPorts, messageLogger, loginStatus);
            }
            catch (error) {
                exceptionLogger(error, {
                    message: 'Exception in getUserLoginStatus promise',
                    fileName: 'start.ts',
                    funcName: 'startAutofillEngine',
                });
            }
        });
        browserApi.contextMenus.onClicked.addListener((info, tab) => {
            if (!*****) {
                messageLogger('Right-click menu was clicked', {
                    timestamp: Date.now(),
                });
            }
            if (!tab?.id) {
                throw new Error('No tab ID while handling a right-click menu interaction');
            }
            makeAutofillEngineActionSerializer(makeAutofillEngineActionSender({
                browserApi,
                messageLogger,
                tabId: tab.id,
                openPorts,
            })).computeContextMenuTargetInfo(AutofillEngineActionTarget.AllFrames, info.frameId ?? BROWSER_MAIN_FRAME_ID);
        });
        browserApi.tabs.onRemoved.addListener((tabId) => {
            stateStorage.setState(storageKeyForTab(tabId), {}).catch((exception) => {
                exceptionLogger(exception, {
                    message: 'Exception in onRemoved handler',
                    fileName: 'start.ts',
                    funcName: 'startAutofillEngine',
                });
            });
        });
        browserApi.tabs.onHighlighted.addListener(async (highlightInfo) => {
            try {
                await tabsOnHighlightedListener(browserApi, injectedConnectors, openPorts, messageLogger, highlightInfo);
            }
            catch (exception) {
                exceptionLogger(exception, {
                    message: 'Exception in onHighlighted handler',
                    fileName: 'start.ts',
                    funcName: 'startAutofillEngine',
                });
            }
        });
        browserApi.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
            openPorts.storePort(port);
            port.onDisconnect.addListener((p) => openPorts.removePort(p));
            port.onMessage.addListener((message: unknown) => {
                try {
                    return onMessageListener({
                        browserApi,
                        injectedConnectors,
                        openPorts,
                        stateStorage,
                        messageLogger,
                        message,
                        port,
                        sendResponse: () => { },
                    });
                }
                catch (exception) {
                    exceptionLogger(exception, {
                        message: 'Exception in onConnect.onMessage handler',
                        fileName: 'start.ts',
                        funcName: 'startAutofillEngine',
                    });
                    return false;
                }
            });
        });
        browserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
            try {
                return onMessageListener({
                    browserApi,
                    injectedConnectors,
                    openPorts,
                    stateStorage,
                    messageLogger,
                    message,
                    sender,
                    sendResponse,
                });
            }
            catch (exception) {
                exceptionLogger(exception, {
                    message: 'Exception in runtime.onMessage handler',
                    fileName: 'start.ts',
                    funcName: 'startAutofillEngine',
                });
                return false;
            }
        });
        registerBasicAuthListeners(browserApi, injectedConnectors, messageLogger);
        void cleanupPersistedStorageKeys();
    }
    catch (exception) {
        exceptionLogger(exception, {
            message: 'Exception while starting autofill-engine',
            fileName: 'start.ts',
            funcName: 'startAutofillEngine',
        });
    }
};
