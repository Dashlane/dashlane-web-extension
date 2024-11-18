import { makeStoreService, StoreService } from "Store";
import {
  DataEncryptorService,
  makeDataEncryptorService,
  setObfuscatingKey,
} from "Libs/CryptoCenter/DataEncryptorService";
import { makeLocalStorageService } from "Libs/Storage/Local/index";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { CarbonLocalStorage, makeStorageService } from "Libs/Storage";
import { StorageService } from "Libs/Storage/types";
import { makeSessionService } from "User/Services/SessionService";
import { SessionService } from "User/Services/types";
import { makeWSService, WSService } from "Libs/WS";
import { makeKeyDataEncryptorService } from "Libs/CryptoCenter/alter/keyBasedCrypto";
import {
  AutoLoginService,
  makeAutoLoginService,
} from "Libs/RememberMe/AutoLogin";
import {
  makeWebAuthnAuthenticationService,
  WebAuthnAuthenticationService,
} from "Libs/RememberMe/WebAuthnAuthentication";
import { EventBusService, makeEventBusService } from "EventBus";
import { EventLoggerService, makeEventLoggerService } from "Logs/EventLogger";
import { AppSessionStorage } from "Store/types";
import { makeApplicationModulesAccess } from "./ApplicationModules";
import {
  ApplicationModulesAccess,
  ApplicationModulesAccessInitOption,
  ModuleClients,
} from "@dashlane/communication";
export interface CoreServices {
  storeService: StoreService;
  wsService: WSService;
  remoteDataEncryptorService: DataEncryptorService;
  masterPasswordEncryptorService: DataEncryptorService;
  localDataEncryptorService: DataEncryptorService;
  authorizationKeysEncryptorService: DataEncryptorService;
  localStorageService: LocalStorageService;
  storageService: StorageService;
  sessionService: SessionService;
  eventLoggerService: EventLoggerService;
  autoLoginService: AutoLoginService;
  webAuthnAuthenticationService: WebAuthnAuthenticationService;
  eventBusService: EventBusService;
  teamDeviceEncryptedConfigEncryptorService: DataEncryptorService;
  applicationModulesAccess: ApplicationModulesAccess;
  moduleClients: ModuleClients;
}
export enum CarbonServicesTypeEnum {
  "StoreService" = "StoreService",
  "StorageService" = "StorageService",
  "SessionService" = "SessionService",
  "MasterPasswordEncryptorService" = "MasterPasswordEncryptorService",
  "LocalDataEncryptorService" = "LocalDataEncryptorService",
  "RemoteDataEncryptorService" = "RemoteDataEncryptorService",
  "AuthorizationKeysEncryptorService" = "AuthorizationKeysEncryptorService",
  "LocalStorageService" = "LocalStorageService",
  "WSService" = "WSService",
  "AutoLoginService" = "AutoLoginService",
  "WebAuthnAuthenticationService" = "WebAuthnAuthenticationService",
  "EventBusService" = "EventBusService",
  "EventLoggerService" = "EventLoggerService",
  "TeamDeviceEncryptedConfigEncryptorService" = "TeamDeviceEncryptedConfigEncryptorService",
  "ApplicationModulesAccess" = "ApplicationModulesAccess",
}
export interface CarbonService {
  type: CarbonServicesTypeEnum;
  instance: CarbonServicesType;
}
export interface CarbonServices {
  services: CarbonService[];
  getInstance: <T>(type: CarbonServicesTypeEnum) => T;
}
export type CarbonServicesType =
  | StoreService
  | DataEncryptorService
  | SessionService
  | StorageService
  | LocalStorageService
  | WSService
  | AutoLoginService
  | WebAuthnAuthenticationService
  | EventBusService
  | EventLoggerService
  | ApplicationModulesAccess;
export const carbonServices = (options: {
  storageLayer: CarbonLocalStorage;
  sessionStorage?: AppSessionStorage;
  wsService?: (storeService: StoreService) => WSService;
  masterPasswordEncryptorService?: () => DataEncryptorService;
  localDataEncryptorService?: () => DataEncryptorService;
  remoteDataEncryptorService?: () => DataEncryptorService;
  authorizationKeysEncryptorService?: () => DataEncryptorService;
  teamDeviceEncryptedConfigEncryptorService?: () => DataEncryptorService;
  createClients: ApplicationModulesAccessInitOption;
}): CarbonServices => {
  const storeService = makeStoreService({
    sessionStorage: options.sessionStorage,
    store: undefined,
  });
  const eventBusService = makeEventBusService();
  const masterPasswordEncryptorService = options.masterPasswordEncryptorService
    ? options.masterPasswordEncryptorService()
    : makeDataEncryptorService(storeService);
  const localDataEncryptorService = options.localDataEncryptorService
    ? options.localDataEncryptorService()
    : makeDataEncryptorService(storeService);
  const remoteDataEncryptorService = options.remoteDataEncryptorService
    ? options.remoteDataEncryptorService()
    : makeDataEncryptorService(storeService);
  const teamDeviceEncryptedConfigEncryptorService =
    options.teamDeviceEncryptedConfigEncryptorService
      ? options.teamDeviceEncryptedConfigEncryptorService()
      : makeDataEncryptorService(storeService);
  const autoLoginEncryptorService = makeKeyDataEncryptorService();
  const webAuthnAuthenticationEncryptorService =
    makeDataEncryptorService(storeService);
  const wsService = Object.assign(
    {},
    makeWSService(),
    options.wsService ? options.wsService(storeService) : {}
  );
  const storageService = makeStorageService();
  storageService.setInstance(options.storageLayer);
  const authorizationKeysEncryptorService =
    options.authorizationKeysEncryptorService
      ? options.authorizationKeysEncryptorService()
      : makeKeyDataEncryptorService();
  setObfuscatingKey(authorizationKeysEncryptorService);
  const localStorageService = makeLocalStorageService({
    masterPasswordEncryptorService,
    localDataEncryptorService,
    authorizationKeysEncryptorService,
    autoLoginEncryptorService,
    webAuthnAuthenticationEncryptorService,
    storageService,
    storeService,
  });
  const eventLoggerService = makeEventLoggerService({
    storeService,
    storageService,
  });
  const applicationModulesAccess = makeApplicationModulesAccess(
    options.createClients
  );
  const moduleClients = applicationModulesAccess.createClients();
  const sessionClient = moduleClients.session;
  const sessionService = makeSessionService({
    applicationModulesAccess,
    masterPasswordEncryptorService,
    localDataEncryptorService,
    remoteDataEncryptorService,
    storeService,
    localStorageService,
    storageService,
    wsService,
    eventBusService,
    eventLoggerService,
    teamDeviceEncryptedConfigEncryptorService,
    sessionClient,
    deviceManagementClient: moduleClients.deviceManagement,
    pinCodeClient: moduleClients.pinCode,
    taskTrackingClient: moduleClients.taskTracking,
  });
  const autoLoginService = makeAutoLoginService({
    autoLoginEncryptorService,
    localStorageService,
    wsService,
    authorizationKeysEncryptorService,
    storeService,
    sessionClient,
  });
  const webAuthnAuthenticationService = makeWebAuthnAuthenticationService({
    webAuthnAuthenticationEncryptorService,
    storeService,
    localStorageService,
    authorizationKeysEncryptorService,
    sessionClient,
  });
  return {
    services: [
      {
        type: CarbonServicesTypeEnum.WSService,
        instance: wsService,
      },
      {
        type: CarbonServicesTypeEnum.StoreService,
        instance: storeService,
      },
      {
        type: CarbonServicesTypeEnum.StorageService,
        instance: storageService,
      },
      {
        type: CarbonServicesTypeEnum.LocalStorageService,
        instance: localStorageService,
      },
      {
        type: CarbonServicesTypeEnum.SessionService,
        instance: sessionService,
      },
      {
        type: CarbonServicesTypeEnum.AuthorizationKeysEncryptorService,
        instance: authorizationKeysEncryptorService,
      },
      {
        type: CarbonServicesTypeEnum.AutoLoginService,
        instance: autoLoginService,
      },
      {
        type: CarbonServicesTypeEnum.WebAuthnAuthenticationService,
        instance: webAuthnAuthenticationService,
      },
      {
        type: CarbonServicesTypeEnum.EventBusService,
        instance: eventBusService,
      },
      {
        type: CarbonServicesTypeEnum.MasterPasswordEncryptorService,
        instance: masterPasswordEncryptorService,
      },
      {
        type: CarbonServicesTypeEnum.RemoteDataEncryptorService,
        instance: remoteDataEncryptorService,
      },
      {
        type: CarbonServicesTypeEnum.LocalDataEncryptorService,
        instance: localDataEncryptorService,
      },
      {
        type: CarbonServicesTypeEnum.EventLoggerService,
        instance: eventLoggerService,
      },
      {
        type: CarbonServicesTypeEnum.TeamDeviceEncryptedConfigEncryptorService,
        instance: teamDeviceEncryptedConfigEncryptorService,
      },
      {
        type: CarbonServicesTypeEnum.ApplicationModulesAccess,
        instance: applicationModulesAccess,
      },
    ],
    getInstance: function <T>(type: CarbonServicesTypeEnum) {
      const service = this.services.find((thisService: CarbonService) => {
        return thisService.type === type;
      });
      if (service === undefined) {
        throw new Error("Service " + type + " not defined");
      }
      return service.instance as T;
    },
  };
};
export const getCoreServices = (
  carbonServices: CarbonServices
): CoreServices => {
  const storeService = carbonServices.getInstance<StoreService>(
    CarbonServicesTypeEnum.StoreService
  );
  const remoteDataEncryptorService =
    carbonServices.getInstance<DataEncryptorService>(
      CarbonServicesTypeEnum.RemoteDataEncryptorService
    );
  const masterPasswordEncryptorService =
    carbonServices.getInstance<DataEncryptorService>(
      CarbonServicesTypeEnum.MasterPasswordEncryptorService
    );
  const localDataEncryptorService =
    carbonServices.getInstance<DataEncryptorService>(
      CarbonServicesTypeEnum.LocalDataEncryptorService
    );
  const authorizationKeysEncryptorService =
    carbonServices.getInstance<DataEncryptorService>(
      CarbonServicesTypeEnum.AuthorizationKeysEncryptorService
    );
  const localStorageService = carbonServices.getInstance<LocalStorageService>(
    CarbonServicesTypeEnum.LocalStorageService
  );
  const storageService = carbonServices.getInstance<StorageService>(
    CarbonServicesTypeEnum.StorageService
  );
  const sessionService = carbonServices.getInstance<SessionService>(
    CarbonServicesTypeEnum.SessionService
  );
  const wsService = carbonServices.getInstance<WSService>(
    CarbonServicesTypeEnum.WSService
  );
  const autoLoginService = carbonServices.getInstance<AutoLoginService>(
    CarbonServicesTypeEnum.AutoLoginService
  );
  const webAuthnAuthenticationService =
    carbonServices.getInstance<WebAuthnAuthenticationService>(
      CarbonServicesTypeEnum.WebAuthnAuthenticationService
    );
  const eventBusService = carbonServices.getInstance<EventBusService>(
    CarbonServicesTypeEnum.EventBusService
  );
  const eventLoggerService = carbonServices.getInstance<EventLoggerService>(
    CarbonServicesTypeEnum.EventLoggerService
  );
  const teamDeviceEncryptedConfigEncryptorService =
    carbonServices.getInstance<DataEncryptorService>(
      CarbonServicesTypeEnum.TeamDeviceEncryptedConfigEncryptorService
    );
  const applicationModulesAccess =
    carbonServices.getInstance<ApplicationModulesAccess>(
      CarbonServicesTypeEnum.ApplicationModulesAccess
    );
  const moduleClients = applicationModulesAccess.createClients();
  return {
    storeService,
    remoteDataEncryptorService,
    masterPasswordEncryptorService,
    localDataEncryptorService,
    authorizationKeysEncryptorService,
    localStorageService,
    storageService,
    sessionService,
    wsService,
    autoLoginService,
    webAuthnAuthenticationService,
    eventBusService,
    eventLoggerService,
    teamDeviceEncryptedConfigEncryptorService,
    applicationModulesAccess,
    moduleClients,
  };
};
