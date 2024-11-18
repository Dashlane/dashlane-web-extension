import { WSService } from "Libs/WS/index";
import { EventBusService } from "EventBus";
import { EventLoggerService } from "Logs/EventLogger";
import type { LocalStorageService } from "Libs/Storage/Local/types";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { StoreService } from "Store/index";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { StorageService } from "Libs/Storage/types";
import {
  makeResumedUserSessionService,
  makeUserSessionService,
} from "User/Services/UserSessionService";
import { UserDeviceService } from "User/Services/types";
import {
  makeUserPaymentService,
  UserPaymentService,
} from "User/Services/UserPaymentService";
import type { SessionService, UserSessionService } from "./types";
import {
  sessionIdSelector,
  sessionStartTimeSelector,
} from "Session/session.selectors";
import { setupEncryptorServices } from "User/Services/setup-encryptor-services";
import { ApplicationModulesAccess } from "@dashlane/communication";
import { makeUserDeviceService } from "./UserDeviceService";
import { SessionClient } from "@dashlane/session-contracts";
import { PinCodeClient } from "@dashlane/authentication-contracts";
import { DeviceManagementClient } from "@dashlane/device-contracts";
import { TaskTrackingClient } from "@dashlane/framework-application";
export interface SessionServices {
  applicationModulesAccess: ApplicationModulesAccess;
  sessionClient: SessionClient;
  pinCodeClient: PinCodeClient;
  deviceManagementClient: DeviceManagementClient;
  taskTrackingClient: TaskTrackingClient;
  storeService: StoreService;
  wsService: WSService;
  masterPasswordEncryptorService: DataEncryptorService;
  localDataEncryptorService: DataEncryptorService;
  remoteDataEncryptorService: DataEncryptorService;
  localStorageService: LocalStorageService;
  cryptoService?: ICryptoService;
  storageService: StorageService;
  eventBusService: EventBusService;
  eventLoggerService: EventLoggerService;
  teamDeviceEncryptedConfigEncryptorService: DataEncryptorService;
}
export const makeSessionService = (
  services: SessionServices
): SessionService => {
  let user: UserSessionService = null;
  let device: UserDeviceService = null;
  let payment: UserPaymentService = null;
  const closeUserSessionService = (shouldReloadExtension = true) => {
    if (!user) {
      return Promise.resolve();
    }
    return user.closeSession(shouldReloadExtension);
  };
  const lockUserSessionService = () => {
    if (!user) {
      return Promise.resolve();
    }
    return user.lockSession();
  };
  return {
    isSessionStarted: () => {
      const { storeService } = services;
      const state = storeService.getState();
      return !!sessionStartTimeSelector(state);
    },
    setInstance: (login: string, password: string) => {
      user = makeUserSessionService(services, login, password);
      device = makeUserDeviceService(services);
      payment = makeUserPaymentService(
        services.storeService,
        services.wsService
      );
    },
    close: (shouldReloadExtension = true) => {
      return closeUserSessionService(shouldReloadExtension).then(() => {
        user = null;
        device = null;
        payment = null;
      });
    },
    lock: () => {
      return lockUserSessionService().then(() => {
        user = null;
        device = null;
        payment = null;
      });
    },
    tryRestoreInstance: () => {
      const { storeService } = services;
      const state = storeService.getState();
      if (!sessionIdSelector(state)) {
        setupEncryptorServices(services);
        return;
      }
      user = makeResumedUserSessionService(services);
      device = makeUserDeviceService(services);
      payment = makeUserPaymentService(
        services.storeService,
        services.wsService
      );
    },
    getInstance: () => {
      if (!user) {
        throw new Error(
          "makeSessionService: You must call setInstance(login: string, password: string) before getting the instance"
        );
      }
      return {
        user,
        device,
        payment,
      };
    },
  };
};
