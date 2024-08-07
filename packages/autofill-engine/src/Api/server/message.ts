import { AutofillEngineActionTarget, SerializedAutofillEngineAction, } from '../../implementation/abstractions/messaging/action-serializer';
import { BROWSER_MAIN_FRAME_ID } from '../../implementation/abstractions/messaging/common';
import { PortStore } from '../../implementation/abstractions/messaging/page-to-worker-transport/port-store';
import { BrowserApi } from '../types/browser/browser-api';
import { AutofillEngineMessageLogger } from '../types/logger';
import { queryInjectableTabs } from './tabs';
export const makeAutofillEngineActionSender = (args: {
    browserApi: BrowserApi;
    messageLogger: AutofillEngineMessageLogger;
    tabId: number;
    openPorts: PortStore;
    port?: chrome.runtime.Port;
    sender?: chrome.runtime.MessageSender;
}) => (action: SerializedAutofillEngineAction, target: AutofillEngineActionTarget): void => {
    const { browserApi, messageLogger, tabId, openPorts, port, sender } = args;
    const messageSender = port?.sender ?? sender;
    const options: chrome.tabs.MessageSendOptions = {};
    switch (target) {
        case AutofillEngineActionTarget.SenderFrame:
            if (!messageSender) {
                throw new Error('No sender provided, target SenderFrame is invalid');
            }
            options.frameId = messageSender.frameId;
            break;
        case AutofillEngineActionTarget.MainFrame:
            options.frameId = BROWSER_MAIN_FRAME_ID;
            break;
        case AutofillEngineActionTarget.AllFrames:
            break;
    }
    if (!*****) {
        messageLogger(`Sending action to tab ${tabId} / ${target}` +
            (target === AutofillEngineActionTarget.SenderFrame
                ? `(${options.frameId})`
                : ''), {
            timestamp: Date.now(),
            content: action,
        });
    }
    if (port && target === AutofillEngineActionTarget.SenderFrame) {
        port.postMessage(action);
    }
    else {
        browserApi.tabs.sendMessage(tabId, action, options);
        openPorts
            .getPorts(tabId, options.frameId)
            .forEach((aPort) => aPort.postMessage(action));
    }
};
export const makeAutofillEngineActionBroadcaster = (browserApi: BrowserApi, messageLogger: (message: string, details: Record<string, unknown>) => void, openPorts: PortStore) => async (action: SerializedAutofillEngineAction, target: AutofillEngineActionTarget): Promise<void> => {
    const options: chrome.tabs.MessageSendOptions = {};
    switch (target) {
        case AutofillEngineActionTarget.SenderFrame:
            throw new Error('target SenderFrame is invalid');
        case AutofillEngineActionTarget.MainFrame:
            options.frameId = BROWSER_MAIN_FRAME_ID;
            break;
        case AutofillEngineActionTarget.AllFrames:
            break;
    }
    if (!*****) {
        messageLogger(`Sending action to all tabs / ${target}`, {
            content: action,
        });
    }
    const tabs = await queryInjectableTabs(browserApi);
    tabs.forEach((tab) => {
        if (tab.id) {
            browserApi.tabs.sendMessage(tab.id, action, options, () => {
                if (browserApi.runtime.lastError?.message ===
                    'Error: Could not establish connection. Receiving end does not exist.') {
                }
                else {
                    throw new Error(browserApi.runtime.lastError?.message);
                }
            });
            openPorts
                .getPorts(tab.id, options.frameId)
                .forEach((aPort) => aPort.postMessage(action));
        }
    });
};
