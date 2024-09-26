import {
  ApplicationModulesAccess,
  BreachesUpdaterStatus,
  ExceptionCriticality,
} from "@dashlane/communication";
import { StoreService } from "Store";
import { WSService } from "Libs/WS";
import { sendExceptionLog } from "Logs/Exception";
import { ukiSelector } from "Authentication";
import { userLoginSelector } from "Session/selectors";
import { makeFeatureFlipsSelectors } from "Feature/selectors";
import { getChangesFromIncomingBreaches } from "DataManagement/Breaches/AppServices/get-changes-from-incoming-breaches";
import { BreachesUpdaterChanges } from "DataManagement/Breaches/AppServices/types";
import {
  BreachRepository,
  CredentialRepository,
} from "DataManagement/Breaches/Repositories/interfaces";
import { BreachVault } from "DataManagement/Breaches/Repositories/breach-vault";
import { CredentialVault } from "DataManagement/Breaches/Repositories/credential-vault";
import { BreachesWS } from "DataManagement/Breaches/Gateways/breaches-ws";
import { BreachesGateway } from "DataManagement/Breaches/Gateways/interfaces";
import { IncomingBreach } from "DataManagement/Breaches/Gateways/types";
import { updateBreachesUpdaterStatus } from "Session/Store/personalData/actions";
import { updateBreachRefreshTimestamp } from "Session/Store/breachRefreshMetadata/actions";
import { lastBreachRefreshTimestampSelector } from "../selectors";
class BreachesUpdater {
  public constructor(
    private storeService: StoreService,
    private applicationModulesAccess: ApplicationModulesAccess,
    private credentialVault: CredentialRepository,
    private breachVault: BreachRepository,
    private gateway: BreachesGateway
  ) {}
  public async refresh(options: { forceRefresh: boolean }): Promise<{
    vaultSyncNeeded: boolean;
  }> {
    try {
      if (this.refreshInProgress) {
        return { vaultSyncNeeded: false };
      }
      this.refreshInProgress = true;
      this.storeService.dispatch(
        updateBreachesUpdaterStatus(BreachesUpdaterStatus.SYNCING)
      );
      const force = Boolean(options && options.forceRefresh);
      const skip =
        !(await this.isFeatureFlipped()) ||
        !this.isSessionOpened() ||
        !this.isRefreshNeeded(force);
      if (skip) {
        this.storeService.dispatch(
          updateBreachesUpdaterStatus(BreachesUpdaterStatus.SKIPPED)
        );
        this.refreshInProgress = false;
        return { vaultSyncNeeded: false };
      }
      const { breachVault, credentialVault } = this;
      const publicResult = await this.fetchLatestPublicBreaches();
      const privateResult = await this.fetchLatestPrivateBreaches();
      this.resetTimer();
      const credentials = credentialVault.getAllCredentials();
      const vaultBreaches = breachVault.getAllBreaches();
      const incomingBreaches = [
        ...publicResult.breaches,
        ...privateResult.breaches,
      ];
      const changes = getChangesFromIncomingBreaches(
        credentials,
        vaultBreaches,
        incomingBreaches
      );
      await breachVault.applyChangesFromSync(
        changes,
        publicResult.revision,
        privateResult.refreshDate
      );
      const vaultSyncNeeded = this.isVaultSyncNeeded(changes);
      this.storeService.dispatch(
        updateBreachesUpdaterStatus(
          vaultSyncNeeded
            ? BreachesUpdaterStatus.UPDATED
            : BreachesUpdaterStatus.UNCHANGED
        )
      );
      return {
        vaultSyncNeeded,
      };
    } catch (exception) {
      this.storeService.dispatch(
        updateBreachesUpdaterStatus(BreachesUpdaterStatus.ERROR)
      );
      const errorMsg = `[Breaches] - refresh: ${exception}`;
      const error = new Error(errorMsg);
      sendExceptionLog({ error, code: ExceptionCriticality.WARNING });
      return { vaultSyncNeeded: false };
    } finally {
      this.refreshInProgress = false;
    }
  }
  private static BREACHES_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
  private static BREACHES_REFRESH_FEATURE_FLIP = "breachesFetchWeb";
  private refreshInProgress = false;
  private async isFeatureFlipped() {
    const { applicationModulesAccess } = this;
    const features = await makeFeatureFlipsSelectors(
      applicationModulesAccess
    ).featureFlipsSelector();
    return (
      Boolean(features) &&
      features[BreachesUpdater.BREACHES_REFRESH_FEATURE_FLIP]
    );
  }
  private isSessionOpened() {
    const { storeService } = this;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    const uki = ukiSelector(state);
    return Boolean(uki && login);
  }
  private isRefreshNeeded(forceRefresh: boolean) {
    const state = this.storeService.getState();
    const lastRefreshTimestamp = lastBreachRefreshTimestampSelector(state);
    return (
      forceRefresh ||
      Date.now() - lastRefreshTimestamp >=
        BreachesUpdater.BREACHES_REFRESH_INTERVAL_MS
    );
  }
  private resetTimer() {
    this.storeService.dispatch(updateBreachRefreshTimestamp(Date.now()));
  }
  private isVaultSyncNeeded(changes: BreachesUpdaterChanges) {
    return changes.updates.length + changes.deletions.length > 0;
  }
  private async fetchLatestPublicBreaches() {
    const revision = this.breachVault.getLatestPublicBreachesRevision();
    return this.gateway.getLatestPublicBreaches(revision);
  }
  private async fetchLatestPrivateBreaches() {
    const lastRefreshDate = this.breachVault.getPrivateBreachesRefreshDate();
    let breaches: IncomingBreach[] = [];
    let refreshDate: number | undefined = undefined;
    try {
      const privateBreachesResult = await this.gateway.getLatestPrivateBreaches(
        lastRefreshDate
      );
      if (privateBreachesResult) {
        breaches = privateBreachesResult.breaches;
        refreshDate = privateBreachesResult.refreshDate;
      }
    } catch (exception) {
      const errorMsg =
        `[Breaches] - refresh:` + ` fetchPrivateBreaches error: ${exception}`;
      const error = new Error(errorMsg);
      sendExceptionLog({ error, code: ExceptionCriticality.WARNING });
    }
    return {
      breaches,
      refreshDate,
    };
  }
}
let updater: BreachesUpdater | null = null;
export const getInstance = (
  applicationModulesAccess: ApplicationModulesAccess,
  storeService: StoreService,
  wsService: WSService
): BreachesUpdater => {
  if (updater === null) {
    updater = new BreachesUpdater(
      storeService,
      applicationModulesAccess,
      new CredentialVault(storeService),
      new BreachVault(storeService),
      new BreachesWS(wsService, storeService)
    );
  }
  return updater;
};
export const clearInstance = () => {
  updater = null;
};
