import { IconType } from "@dashlane/communication";
import { Observable, Subject, Subscription } from "rxjs";
import { concatMap, share } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { StoreService } from "Store";
import {
  breachesSelector,
  breachSelector,
} from "DataManagement/Breaches/selectors";
import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { LocalStorageService } from "Libs/Storage/Local/types";
import Debugger from "Logs/Debugger";
import { IconsGateway } from "DataManagement/Icons/Gateways/interfaces";
import { iconsCacheSelector } from "DataManagement/Icons/selectors";
import { richIconsSettingSelector } from "Session/selectors";
import {
  clearIconsCache,
  iconsRefreshed,
  iconsUpdated,
} from "Session/Store/Icons/actions";
import { assertUnreachable } from "Helpers/assert-unreachable";
import {
  fetchIconsForAllItems,
  fetchIconsForBreaches,
  fetchIconsForCredentials,
} from "DataManagement/Icons/AppServices/update-icons";
import { sendExceptionLog } from "Logs/Exception";
import { isIconsCacheValid } from "DataManagement/Icons/AppServices/refresh-icons";
import { reportDataUpdate } from "Session/SessionCommunication";
import extension from "Connector/ExtensionCarbonConnector";
import { defaultIconTypes } from "./types";
enum OperationType {
  BreachesOperation = "breachesOperation",
  CredentialsOperation = "credentialsOperation",
  RefreshOperation = "refreshOperation",
}
type RefreshOperation = {
  id: string;
  type: OperationType.RefreshOperation;
  iconTypes: IconType[];
};
type BreachesOperation = {
  id: string;
  breachesIds: string[];
  iconTypes: IconType[];
  type: OperationType.BreachesOperation;
};
type CredentialsOperation = {
  id: string;
  credentialIds: string[];
  iconTypes: IconType[];
  type: OperationType.CredentialsOperation;
};
type Operation = BreachesOperation | CredentialsOperation | RefreshOperation;
type OperationResult = {
  id: string;
  success: boolean;
};
const getCredentialsUpdateHandler =
  (storeService: StoreService, iconsGateway: IconsGateway) =>
  async ({ credentialIds, iconTypes }: CredentialsOperation) => {
    const state = storeService.getState();
    const credentials = credentialIds
      .map((id) => credentialSelector(state, id))
      .filter((credential) => !!credential);
    const icons = await fetchIconsForCredentials(
      state,
      iconsGateway,
      credentials,
      iconTypes
    );
    const extensionConnector = extension();
    if (extensionConnector && icons.length > 0) {
      storeService.dispatch(iconsUpdated(icons));
      reportDataUpdate(storeService);
    }
  };
const getBreachesUpdateHandler =
  (storeService: StoreService, iconsGateway: IconsGateway) =>
  async ({ breachesIds, iconTypes }: BreachesOperation) => {
    const state = storeService.getState();
    const breaches = breachesIds
      .map((id) => breachSelector(state, id))
      .filter((breach) => !!breach);
    const icons = await fetchIconsForBreaches(
      state,
      iconsGateway,
      breaches,
      iconTypes
    );
    if (icons.length > 0) {
      storeService.dispatch(iconsUpdated(icons));
    }
  };
const getRefreshIconsHandler =
  (storeService: StoreService, iconsGateway: IconsGateway) =>
  async ({ iconTypes }: RefreshOperation) => {
    const state = storeService.getState();
    const areRichIconsEnabled = richIconsSettingSelector(state);
    if (!areRichIconsEnabled) {
      storeService.dispatch(clearIconsCache());
      return;
    }
    const iconsCache = iconsCacheSelector(state);
    if (isIconsCacheValid(iconsCache)) {
      return;
    }
    const credentials = credentialsSelector(state);
    const breaches = breachesSelector(state);
    const icons = await fetchIconsForAllItems(
      iconsGateway,
      credentials,
      breaches,
      iconTypes
    );
    storeService.dispatch(iconsRefreshed(icons));
    const extensionConnector = extension();
    if (extensionConnector) {
      reportDataUpdate(storeService);
    }
  };
export class IconsUpdater {
  private _operation$ = new Subject<Operation>();
  private _operationResults$: Observable<OperationResult>;
  private subs: Set<Subscription> = new Set();
  constructor(
    private localStorageService: LocalStorageService,
    private storeService: StoreService,
    private gateway: IconsGateway
  ) {
    this.setupOperationsHandling();
  }
  public handleRefreshIcons = async (): Promise<boolean> => {
    const id = uuidv4();
    const resultPromise = new Promise<boolean>((resolve) => {
      const sub = this._operationResults$.subscribe((event) => {
        if (event.id === id) {
          resolve(event.success);
          sub.unsubscribe();
          this.subs.delete(sub);
        }
      });
      this.subs.add(sub);
    });
    this.triggerRefreshOperation(id);
    return await resultPromise;
  };
  public handleCredentialUpdates = async (
    credentialIds: string[]
  ): Promise<boolean> => {
    const id = uuidv4();
    const resultPromise = new Promise<boolean>((resolve) => {
      const sub = this._operationResults$.subscribe((event) => {
        if (event.id === id) {
          resolve(event.success);
          sub.unsubscribe();
          this.subs.delete(sub);
        }
      });
      this.subs.add(sub);
    });
    this.triggerCredentialsOperation(id, credentialIds);
    return await resultPromise;
  };
  public handleBreachesUpdates = async (
    breachesIds: string[]
  ): Promise<boolean> => {
    const id = uuidv4();
    const resultPromise = new Promise<boolean>((resolve) => {
      const sub = this._operationResults$.subscribe((event) => {
        if (event.id === id) {
          resolve(event.success);
          sub.unsubscribe();
          this.subs.delete(sub);
        }
      });
      this.subs.add(sub);
    });
    this.triggerBreachesOperation(id, breachesIds);
    return await resultPromise;
  };
  public teardown() {
    this.subs.forEach((s) => s.unsubscribe());
  }
  private triggerCredentialsOperation = (
    id: string,
    credentialIds: string[],
    iconTypes: IconType[] = defaultIconTypes
  ) => {
    this._operation$.next({
      credentialIds,
      id,
      type: OperationType.CredentialsOperation,
      iconTypes,
    });
  };
  private triggerBreachesOperation = (
    id: string,
    breachesIds: string[],
    iconTypes: IconType[] = defaultIconTypes
  ) => {
    this._operation$.next({
      breachesIds,
      id,
      type: OperationType.BreachesOperation,
      iconTypes,
    });
  };
  private triggerRefreshOperation = (
    id: string,
    iconTypes: IconType[] = defaultIconTypes
  ) => {
    this._operation$.next({
      id,
      type: OperationType.RefreshOperation,
      iconTypes,
    });
  };
  private handleOperation = async <O extends Operation>(
    handler: (operation: O) => Promise<void>,
    operation: O
  ): Promise<OperationResult> => {
    const { type, id } = operation;
    const baseResult = { id, type };
    const storageInstance = this.localStorageService.getInstance();
    const state = this.storeService.getState();
    try {
      await handler(operation);
      await storageInstance.storeIcons(iconsCacheSelector(state));
      return {
        ...baseResult,
        success: true,
      };
    } catch (error) {
      const message = `[Icons Updater] - handle operation: operation ${operation.type} failed with ${error}`;
      Debugger.error(message);
      const augmentedError = new Error(message);
      sendExceptionLog({ error: augmentedError });
      console.error(augmentedError);
      return {
        ...baseResult,
        success: false,
      };
    }
  };
  private onOperation = async (
    operation: Operation
  ): Promise<OperationResult> => {
    switch (operation.type) {
      case OperationType.CredentialsOperation:
        return this.handleOperation(
          getCredentialsUpdateHandler(this.storeService, this.gateway),
          operation
        );
      case OperationType.BreachesOperation:
        return this.handleOperation(
          getBreachesUpdateHandler(this.storeService, this.gateway),
          operation
        );
      case OperationType.RefreshOperation:
        return this.handleOperation(
          getRefreshIconsHandler(this.storeService, this.gateway),
          operation
        );
      default:
        return assertUnreachable(operation);
    }
  };
  private setupOperationsHandling = (): void => {
    const handler$ = this._operation$.pipe(
      concatMap(this.onOperation),
      share()
    );
    const sub = handler$.subscribe();
    this.subs.add(sub);
    this._operationResults$ = handler$;
  };
}
