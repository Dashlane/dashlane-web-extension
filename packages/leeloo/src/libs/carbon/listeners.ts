import {
  ABTestingEvent,
  AccountFeatures,
  AdminPermissionLevel,
  CurrentLocationUpdated,
  groupPermissions,
  LocalAccountsListUpdated,
  possibleAdminPermissions,
  ServerSidePairingStatusChanged,
  TeamAdminDataUpdatedEvent,
  UpdatePaymentCardTokenResult,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import * as actions from "./reducer";
import { carbonConnector } from "./connector";
import * as userActions from "../../user/reducer";
import errorAction from "../logs/errorActions";
import { Store } from "../../store/create";
import { Permissions } from "../../user/permissions";
import { checkDirectorySyncKeyRequestAction } from "../../team/directory-sync-key/reducer";
import { selectTeamAdminData } from "./teamAdminData/selectors";
export function listenToBackendEvents(store: Store) {
  carbonConnector.serverSidePairingStatusChanged.on(
    (data: ServerSidePairingStatusChanged) => {
      store.dispatch(actions.serverSidePairingStatusUpdated(data));
    }
  );
  carbonConnector.updatePaymentCardTokenResult.on(
    (result: UpdatePaymentCardTokenResult) => {
      if (result) {
        store.dispatch(errorAction(new Error(result.reason)));
      }
    }
  );
  carbonConnector.localAccountsListUpdated.on(
    (result: LocalAccountsListUpdated) => {
      store.dispatch(actions.localAccountsListUpdated(result.localAccounts));
    }
  );
  carbonConnector.accountFeaturesChanged.on(
    (accountFeatures: AccountFeatures) => {
      store.dispatch(actions.accountFeaturesUpdated(accountFeatures));
    }
  );
  carbonConnector.spaceDataUpdated.on((spaceData) => {
    store.dispatch(actions.spaceDataUpdated(spaceData));
    const { rights } = spaceData;
    if (rights) {
      const permissions: Set<AdminPermissionLevel> = new Set();
      if (rights.isTeamAdmin) {
        possibleAdminPermissions.forEach((p) => permissions.add(p));
      }
      if (rights.isBillingAdmin) {
        permissions.add("BILLING");
      }
      if (rights.isGroupManager) {
        groupPermissions.forEach((p) => permissions.add(p));
      }
      store.dispatch(
        userActions.permissionsLoaded({
          permissions: { tacAccessPermissions: permissions } as Permissions,
        })
      );
    }
  });
  carbonConnector.teamAdminDataUpdated.on(
    (partialTeamAdminData: TeamAdminDataUpdatedEvent) => {
      const { teams } = selectTeamAdminData(store.getState());
      Object.keys(partialTeamAdminData.teams).forEach((teamId: string) => {
        teams[teamId] = Object.assign(
          {},
          teams[teamId],
          partialTeamAdminData.teams[teamId]
        );
      });
      store.dispatch(actions.teamAdminDataUpdated({ teams }));
    }
  );
  carbonConnector.webOnboardingModeUpdated.on(
    (webOnboardingMode: WebOnboardingModeEvent) => {
      store.dispatch(actions.webOnboardingModeUpdate(webOnboardingMode));
    }
  );
  carbonConnector.abTestingChanged.on((abtesting: ABTestingEvent) => {
    store.dispatch(actions.abTestingUpdated(abtesting));
  });
  carbonConnector.currentLocationUpdated.on(
    (currentLocation: CurrentLocationUpdated) => {
      store.dispatch(actions.currentLocationUpdated(currentLocation));
    }
  );
  carbonConnector.checkDirectorySyncKeyRequest.on((event) => {
    store.dispatch(checkDirectorySyncKeyRequestAction(event));
  });
}
