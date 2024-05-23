import { ABTestingEvent, AccountFeatures, AccountInfo, AdminPermissionLevel, ChangeDeviceNameResult, CurrentLocationUpdated, DeactivateDeviceResult, groupPermissions, LocalAccountsListUpdated, LoginStatusChanged, possibleAdminPermissions, ServerSidePairingStatusChanged, Space, TeamAdminDataUpdatedEvent, UpdatePaymentCardTokenResult, WebOnboardingModeEvent, } from '@dashlane/communication';
import * as actions from './reducer';
import { carbonConnector } from './connector';
import { SpaceData, State } from './types';
import * as userActions from 'user/reducer';
import errorAction from 'libs/logs/errorActions';
import { Store } from 'store/create';
import { Permissions } from 'user/permissions';
import { checkDirectorySyncKeyRequestAction } from 'team/directory-sync-key/reducer';
import { startRoutines, stopRoutines } from './routines';
import { selectTeamAdminData } from 'libs/carbon/teamAdminData/selectors';
export const listenToCarbonEvents = (store: Store): void => {
    carbonConnector.loginStatusChanged.on((data: LoginStatusChanged) => {
        let state: Partial<State> = {
            loginStatus: data,
        };
        if (data.loggedIn) {
            carbonConnector.getUki(null).then(({ uki }: {
                uki: string;
            }) => {
                store.dispatch(userActions.loginAndUkiLoaded({
                    uki,
                    login: data.login,
                }));
            });
            startRoutines(store);
        }
        else {
            stopRoutines();
            const { abtesting, localAccounts, currentLocation } = store.getState().carbon;
            state = Object.assign({}, actions.emptyState, {
                abtesting,
                localAccounts,
                currentLocation,
            });
            store.dispatch(userActions.userLoggedOut());
        }
        if (!data.needsSSOMigration) {
            store.dispatch(actions.loginStatusUpdated(state));
        }
    });
    carbonConnector.serverSidePairingStatusChanged.on((data: ServerSidePairingStatusChanged) => {
        store.dispatch(actions.serverSidePairingStatusUpdated(data));
    });
    carbonConnector.deactivateDeviceResult.on((result: DeactivateDeviceResult) => {
        if (!result.success) {
            return;
        }
        store.dispatch(actions.deviceDeactivationConfirmed(result.devicesList));
    });
    carbonConnector.updatePaymentCardTokenResult.on((result: UpdatePaymentCardTokenResult) => {
        if (result) {
            store.dispatch(errorAction(new Error(result.reason)));
        }
    });
    carbonConnector.changeDeviceNameResult.on((result: ChangeDeviceNameResult) => {
        if (result.success) {
            store.dispatch(actions.devicesListUpdated(result.devicesList));
        }
    });
    carbonConnector.localAccountsListUpdated.on((result: LocalAccountsListUpdated) => {
        store.dispatch(actions.localAccountsListUpdated(result.localAccounts));
    });
    carbonConnector.accountInfoChanged.on(({ accountInfo, spaceData, }: {
        accountInfo: AccountInfo;
        spaceData: SpaceData;
    }) => {
        if (spaceData?.spaces) {
            const { spaces } = spaceData;
            const rights = spaces.reduce((result: {
                isTeamAdmin: boolean;
                isBillingAdmin: boolean;
                isGroupManager: boolean;
            }, space: Space) => {
                const { isTeamAdmin, isBillingAdmin, isGroupManager } = space.details;
                return {
                    isTeamAdmin: isTeamAdmin || result.isTeamAdmin,
                    isBillingAdmin: isBillingAdmin || result.isBillingAdmin,
                    isGroupManager: Boolean(isGroupManager) || result.isGroupManager,
                };
            }, { isTeamAdmin: false, isBillingAdmin: false, isGroupManager: false });
            const permissions: Set<AdminPermissionLevel> = new Set();
            if (rights.isTeamAdmin) {
                possibleAdminPermissions.forEach((p) => permissions.add(p));
            }
            if (rights.isBillingAdmin) {
                permissions.add('BILLING');
            }
            if (rights.isGroupManager) {
                groupPermissions.forEach((p) => permissions.add(p));
            }
            store.dispatch(userActions.permissionsLoaded({
                permissions: { tacAccessPermissions: permissions } as Permissions,
            }));
        }
        store.dispatch(actions.accountInfoUpdated(accountInfo));
    });
    carbonConnector.accountFeaturesChanged.on((accountFeatures: AccountFeatures) => {
        store.dispatch(actions.accountFeaturesUpdated(accountFeatures));
    });
    carbonConnector.spaceDataUpdated.on((spaceData) => {
        store.dispatch(actions.spaceDataUpdated(spaceData));
    });
    carbonConnector.teamAdminDataUpdated.on((partialTeamAdminData: TeamAdminDataUpdatedEvent) => {
        const { teams } = selectTeamAdminData(store.getState());
        Object.keys(partialTeamAdminData.teams).forEach((teamId: string) => {
            teams[teamId] = Object.assign({}, teams[teamId], partialTeamAdminData.teams[teamId]);
        });
        store.dispatch(actions.teamAdminDataUpdated({ teams }));
    });
    carbonConnector.webOnboardingModeUpdated.on((webOnboardingMode: WebOnboardingModeEvent) => {
        store.dispatch(actions.webOnboardingModeUpdate(webOnboardingMode));
    });
    carbonConnector.abTestingChanged.on((abtesting: ABTestingEvent) => {
        store.dispatch(actions.abTestingUpdated(abtesting));
    });
    carbonConnector.currentLocationUpdated.on((currentLocation: CurrentLocationUpdated) => {
        store.dispatch(actions.currentLocationUpdated(currentLocation));
    });
    carbonConnector.checkDirectorySyncKeyRequest.on((event) => {
        store.dispatch(checkDirectorySyncKeyRequestAction(event));
    });
};
