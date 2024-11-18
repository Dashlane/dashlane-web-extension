import { AutoLoginService } from "Libs/RememberMe/AutoLogin";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { EventBusService } from "EventBus";
import { StoreService } from "Store/index";
import { SessionService } from "User/Services/types";
import { WSService } from "Libs/WS/index";
import { StorageService } from "Libs/Storage/types";
import { EventLoggerService } from "Logs/EventLogger";
import { ModuleClients } from "@dashlane/communication";
export interface LoginServices {
  storeService: StoreService;
  sessionService: SessionService;
  masterPasswordEncryptorService: DataEncryptorService;
  localDataEncryptorService: DataEncryptorService;
  remoteDataEncryptorService: DataEncryptorService;
  authorizationKeysEncryptorService: DataEncryptorService;
  wsService: WSService;
  localStorageService: LocalStorageService;
  autoLoginService: AutoLoginService;
  storageService: StorageService;
  eventBusService: EventBusService;
  eventLoggerService: EventLoggerService;
  moduleClients: ModuleClients;
}
