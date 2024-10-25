import { DeviceInfo } from "@dashlane/communication";
import { UserPaymentService } from "User/Services/UserPaymentService";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import type { SyncArgs } from "Libs/Backup/types";
import { Trigger } from "@dashlane/hermes";
export interface AccountInfoResult {
  userAnalyticsId: string;
  deviceAnalyticsId: string;
  publicUserId: string;
}
export interface UserSessionService {
  accountExistsLocally: () => Promise<boolean>;
  closeSession: (shouldReloadExtension?: boolean) => Promise<void>;
  lockSession: () => Promise<void>;
  refreshContactInfo: () => Promise<void>;
  fetchSubscriptionCode: () => Promise<string>;
  fetchAccountInfo: () => Promise<AccountInfoResult>;
  getSyncArgs: () => SyncArgs;
  loadSessionData: () => Promise<void>;
  loadNonResumableSessionData: () => Promise<void>;
  persistAllData: () => Promise<void>;
  persistLocalSettings: () => Promise<void>;
  persistPersonalData: () => Promise<void>;
  persistPersonalSettings: () => Promise<void>;
  persistTeamAdminData: () => Promise<void>;
  persistLocalKey: (localKey: string) => Promise<void>;
  refreshSessionData: () => Promise<void>;
  sync: (trigger?: Trigger) => Promise<ClearTransaction[] | undefined>;
  attemptSync: (trigger?: Trigger) => Promise<ClearTransaction[] | undefined>;
  requestNewSync: (
    trigger?: Trigger
  ) => Promise<ClearTransaction[] | undefined>;
  startPeriodic2FAInfoRefresh: () => void;
  stopPeriodic2FAInfoRefresh: () => void;
}
export interface UserSessionServices {
  user: UserSessionService;
  device: UserDeviceService;
  payment: UserPaymentService;
}
export interface SessionService {
  isSessionStarted: () => boolean;
  setInstance: (login: string, password: string) => void;
  getInstance: () => UserSessionServices;
  tryRestoreInstance: () => void;
  close: (shouldReloadExtension?: boolean) => Promise<void>;
  lock: () => Promise<void>;
}
export interface UserDeviceService {
  changeDeviceName: (
    deviceId: string,
    updatedDeviceName: string
  ) => Promise<void>;
  deactivateDevice: (deviceId: string) => Promise<void>;
  fetchDevicesList: () => Promise<DeviceInfo[]>;
}
