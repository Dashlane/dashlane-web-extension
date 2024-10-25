import type { AccountInfo, CancelPremiumSubscription, DeviceInfo, DomainInfo, GetUki, Invoice, PasswordGenerationSettings, PersonalSettings, WebsiteOptions, } from "@dashlane/communication";
import { Trigger } from "@dashlane/hermes";
import { Enum } from "typescript-string-enums";
import Debugger, { logError } from "Logs/Debugger";
import * as SessionCommunication from "Session/SessionCommunication";
import { getWebsiteInfo } from "Session/Store/personalSettings";
import * as ExceptionLog from "Logs/Exception";
import * as GeneratedPassword from "DataManagement/GeneratedPassword";
import { refreshPremiumStatus } from "Session/PremiumController";
import { StoreService } from "Store/index";
import { SessionService } from "User/Services/types";
import { isSaveCredentialDisabledOnDomain, signalSaveCredentialDisabled, } from "DataManagement/Settings/index";
import { WSService } from "Libs/WS/index";
import { triggerABTestingChanged } from "Device/DeviceCommunication";
import { secureDeviceName } from "Device/secure-device-name";
import { ukiSelector } from "Authentication/selectors";
import { premiumStatusSelector } from "Session/selectors";
import { StorageService } from "Libs/Storage/types";
import { validateMasterPassword } from "Session/performValidation";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { CurrentUserInfo, getCurrentUserInfo } from "./utils";
import { getNodePremiumStatusSpaceData } from "Store/helpers/spaceData";
import { SpaceData } from "./Store/spaceData";
export interface SessionController {
    askWebsiteInfo: (url: string) => WebsiteOptions;
    cancelPremiumSubscription: () => Promise<CancelPremiumSubscription>;
    changeDeviceName: (deviceId: string, updateName: string) => void;
    closeSession: () => Promise<void>;
    lockSession: () => Promise<void>;
    deactivateDevice: (deviceId: string) => void;
    generateAndSavePassword: (domain: string) => string;
    generatePassword: (settings: PasswordGenerationSettings) => string;
    getAndTriggerRefreshAccountInfo: () => Promise<AccountInfo>;
    getAccountInfo: () => Promise<AccountInfo>;
    getCurrentUserInfo: () => CurrentUserInfo;
    getDevicesList: () => Promise<DeviceInfo[]>;
    getInvoices: () => Promise<Invoice[]>;
    getPasswordGenerationSettings: () => PasswordGenerationSettings;
    getPersonalSettings: () => Promise<PersonalSettings>;
    getUki: () => GetUki;
    isSaveCredentialDisabled: (domainInfo: DomainInfo) => boolean;
    signalSaveCredentialDisabled: (domainInfo: DomainInfo) => void;
    resumeSession: () => Promise<boolean>;
    saveGeneratedPassword: (password: string, url: string) => void;
    sessionForceSync: (trigger?: Trigger) => Promise<void>;
    updateCardToken: (tokenId: string, stripeAccount: string) => void;
    validateMasterPassword: (masterPassword: string) => Promise<boolean>;
}
export interface SessionControllerServices {
    storeService: StoreService;
    storageService: StorageService;
    sessionService: SessionService;
    wsService: WSService;
    masterPasswordEncryptorService: DataEncryptorService;
}
export const makeSessionController = (services: SessionControllerServices): SessionController => {
    const sessionController: SessionController = {
        askWebsiteInfo: (url: string) => askWebsiteInfo(services.storeService, url),
        cancelPremiumSubscription: () => cancelPremiumSubscription(services.storeService, services.sessionService, services.wsService),
        changeDeviceName: (deviceId: string, updateName: string) => changeDeviceName(services.storeService, services.sessionService, deviceId, updateName),
        closeSession: () => closeSession(services.sessionService),
        lockSession: () => lockSession(services.sessionService),
        deactivateDevice: (deviceId: string) => deactivateDevice(services.storeService, services.sessionService, deviceId),
        generateAndSavePassword: (url: string) => generateAndSavePassword(services.storeService, services.sessionService, url),
        generatePassword: (settings: PasswordGenerationSettings) => generatePassword(services.storeService, settings),
        getAccountInfo: () => getAccountInfo(services.storeService),
        getAndTriggerRefreshAccountInfo: () => getAndTriggerRefreshAccountInfo(services.storeService, services.sessionService, services.wsService),
        getPasswordGenerationSettings: () => getPasswordGenerationSettings(services.storeService),
        getCurrentUserInfo: () => getCurrentUserInfo(services.storeService),
        getDevicesList: () => getDevicesList(services.storeService, services.sessionService),
        getInvoices: () => getInvoices(services.storeService, services.sessionService),
        getPersonalSettings: () => getPersonalSettings(services.storeService),
        getUki: () => getUki(services.storeService),
        isSaveCredentialDisabled: (domainInfo: DomainInfo) => isSaveCredentialDisabledOnDomain(services.storeService, domainInfo),
        signalSaveCredentialDisabled: (domainInfo: DomainInfo) => signalSaveCredentialDisabled(services.storeService, services.sessionService, domainInfo),
        resumeSession: () => resumeSession(services.storeService, services.storageService, services.sessionService, services.wsService),
        saveGeneratedPassword: (password: string, url: string) => saveGeneratedPassword(services.storeService, services.sessionService, password, url),
        sessionForceSync: (trigger: Trigger = Trigger.Manual) => sessionForceSync(services.sessionService, trigger),
        updateCardToken: (tokenId: string, stripeAccount: string) => updateCardToken(services.storeService, services.sessionService, services.wsService, tokenId, stripeAccount),
        validateMasterPassword: (masterPassword: string) => validateMasterPassword(services.storeService, services.masterPasswordEncryptorService, masterPassword),
    };
    return sessionController;
};
const defaultAccountInfo: AccountInfo = {
    premiumStatus: {
        statusCode: null,
    },
};
function getAccountInfo(storeService: StoreService): Promise<AccountInfo> {
    const state = storeService.getState();
    const premiumStatus = premiumStatusSelector(state);
    return Promise.resolve({
        premiumStatus,
    });
}
export async function getAndTriggerRefreshAccountInfo(storeService: StoreService, sessionService: SessionService, wsService: WSService): Promise<AccountInfo> {
    if (!storeService.isAuthenticated()) {
        return defaultAccountInfo;
    }
    try {
        const accountInfoAndNodePremiumStatusSpaceData = await getRefreshedAccountInfoAndNodePremiumStatusSpaceData(storeService, sessionService, wsService);
        const accountInfo = accountInfoAndNodePremiumStatusSpaceData.accountInfo;
        return accountInfo;
    }
    catch (error) {
        Debugger.error("Error during getRefreshedAccountInfo", error);
        const premiumStatusState = premiumStatusSelector(storeService.getState());
        const premiumStatus = premiumStatusState
            ? { premiumStatus: premiumStatusState }
            : {};
        return {
            ...defaultAccountInfo,
            ...premiumStatus,
        };
    }
}
async function getRefreshedAccountInfoAndNodePremiumStatusSpaceData(storeService: StoreService, sessionService: SessionService, wsService: WSService): Promise<{
    accountInfo: AccountInfo;
    nodePremiumStatusSpaceData: SpaceData;
}> {
    const { user } = sessionService.getInstance();
    const premiumStatusPromise = refreshPremiumStatus(storeService, wsService, storeService.getUserLogin(), ukiSelector(storeService.getState())).then(() => {
        return {
            premiumStatus: storeService.getLocalSettings().premiumStatus,
            nodePremiumStatusSpaceData: getNodePremiumStatusSpaceData(storeService),
        };
    });
    try {
        await user.fetchAccountInfo();
    }
    catch (error) {
        logError(error);
        ExceptionLog.sendExceptionLog({ error });
    }
    const premiumStatuses = await premiumStatusPromise;
    const { premiumStatus, nodePremiumStatusSpaceData } = premiumStatuses;
    if (!premiumStatus) {
        throw new Error("premium info should exist");
    }
    return {
        accountInfo: {
            premiumStatus,
        },
        nodePremiumStatusSpaceData,
    };
}
export async function sessionForceSync(sessionService: SessionService, trigger: Trigger = Trigger.Manual): Promise<void> {
    await sessionService.getInstance().user.attemptSync(trigger);
}
function closeSession(sessionService: SessionService): Promise<void> {
    Debugger.log("SessionController/closeSession called");
    return sessionService.close();
}
function lockSession(sessionService: SessionService): Promise<void> {
    return sessionService.lock();
}
function getUki(storeService: StoreService): GetUki {
    return {
        uki: ukiSelector(storeService.getState()),
    };
}
function getDevicesList(storeService: StoreService, sessionService: SessionService): Promise<DeviceInfo[]> {
    if (storeService.isAuthenticated()) {
        return sessionService
            .getInstance()
            .device.fetchDevicesList()
            .catch((error: Error) => {
            Debugger.log("Error while fetching Devices list", error);
            return [];
        });
    }
    return Promise.resolve([]);
}
function deactivateDevice(storeService: StoreService, sessionService: SessionService, deviceId: string) {
    if (storeService.isAuthenticated()) {
        return sessionService
            .getInstance()
            .device.deactivateDevice(deviceId)
            .catch((error: Error) => {
            const message = `[SessionController] - deactivateDevice: ${error}`;
            const augmentedError = new Error(message);
            Debugger.log(augmentedError);
            ExceptionLog.sendExceptionLog({ error: augmentedError });
        });
    }
    return Promise.resolve(null);
}
function changeDeviceName(storeService: StoreService, sessionService: SessionService, deviceId: string, updateName: string) {
    if (storeService.isAuthenticated()) {
        const securedUpdateName = secureDeviceName(updateName);
        return sessionService
            .getInstance()
            .device.changeDeviceName(deviceId, securedUpdateName)
            .catch((error: Error) => {
            const message = `[SessionController] - changeDeviceName: ${error}`;
            const augmentedError = new Error(message);
            Debugger.log(augmentedError);
            ExceptionLog.sendExceptionLog({ error: augmentedError });
        });
    }
    return Promise.resolve(null);
}
function getInvoices(storeService: StoreService, sessionService: SessionService): Promise<Invoice[]> {
    if (storeService.isAuthenticated()) {
        return sessionService
            .getInstance()
            .payment.fetchInvoices()
            .catch((error) => {
            const message = `[SessionController] - getInvoices: ${error}`;
            const augmentedError = new Error(message);
            Debugger.log(augmentedError);
            ExceptionLog.sendExceptionLog({ error: augmentedError });
            return null;
        });
    }
    return Promise.resolve(null);
}
async function cancelPremiumSubscription(storeService: StoreService, sessionService: SessionService, wsService: WSService): Promise<CancelPremiumSubscription> {
    if (!storeService.isAuthenticated()) {
        return { success: false };
    }
    try {
        await sessionService.getInstance().payment.cancelPremiumSubscription();
        getRefreshedAccountInfoAndNodePremiumStatusSpaceData(storeService, sessionService, wsService).catch((_) => { });
        return { success: true };
    }
    catch (error) {
        const originalMessage = error.message;
        const message = `[SessionController] - cancelPremiumSubscription: ${error}`;
        const augmentedError = new Error(message);
        Debugger.log(augmentedError);
        ExceptionLog.sendExceptionLog({ error: augmentedError });
        return {
            success: false,
            reason: originalMessage,
        };
    }
}
async function updateCardToken(storeService: StoreService, sessionService: SessionService, wsService: WSService, tokenId: string, stripeAccount: string): Promise<void> {
    try {
        if (!storeService.isAuthenticated()) {
            return;
        }
        const { payment } = sessionService.getInstance();
        const result = await payment.updatePaymentCard(tokenId, stripeAccount);
        SessionCommunication.updatePaymentCardTokenResult(result);
        getRefreshedAccountInfoAndNodePremiumStatusSpaceData(storeService, sessionService, wsService).catch((_) => { });
    }
    catch (error) {
        const originalMessage = error.message;
        const message = `[SessionController] - updateCardToken: ${error}`;
        const augmentedError = new Error(message);
        Debugger.log(augmentedError);
        ExceptionLog.sendExceptionLog({ error: augmentedError });
        SessionCommunication.updatePaymentCardTokenResult({
            success: false,
            reason: originalMessage,
        });
    }
}
export function resumeSession(storeService: StoreService, storageService: StorageService, sessionService: SessionService, wsService: WSService) {
    triggerABTestingChanged(storeService.***());
    SessionCommunication.sendLocationInfo(storeService.getPlatform().location);
    if (storeService.isAuthenticated()) {
        return getAndTriggerRefreshAccountInfo(storeService, sessionService, wsService).then(() => {
            SessionCommunication.triggerSessionOpened(storeService, storageService);
            return true;
        });
    }
    return Promise.resolve(null);
}
export function generateAndSavePassword(storeService: StoreService, sessionService: SessionService, url: string): string {
    return GeneratedPassword.generateAndSavePassword(storeService, sessionService, url);
}
export function getPasswordGenerationSettings(storeService: StoreService): PasswordGenerationSettings {
    return GeneratedPassword.getDefaultPasswordGenerationSettings(storeService.getPersonalSettings());
}
export function generatePassword(storeService: StoreService, settings: PasswordGenerationSettings): string {
    return GeneratedPassword.generatePassword(storeService.getPersonalSettings(), settings);
}
export function saveGeneratedPassword(storeService: StoreService, sessionService: SessionService, password: string, url: string) {
    return GeneratedPassword.saveGeneratedPassword(storeService, sessionService, password, url);
}
export function askWebsiteInfo(storeService: StoreService, url: string): WebsiteOptions {
    return getWebsiteInfo(storeService, url);
}
export const AutofillProtectionStatus = Enum("UNPROTECTED", "LOCKED", "UNLOCKED");
export type AutofillProtectionStatus = Enum<typeof AutofillProtectionStatus>;
function getPersonalSettings(storeService: StoreService): Promise<PersonalSettings> {
    return Promise.resolve(storeService.getPersonalSettings());
}
export function refeshAccountInfo(storeService: StoreService, sessionService: SessionService, wsService: WSService) {
    getRefreshedAccountInfoAndNodePremiumStatusSpaceData(storeService, sessionService, wsService).catch((_) => { });
}
