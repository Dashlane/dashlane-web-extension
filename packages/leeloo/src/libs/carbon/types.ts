import { ABTestingEvent, AccountFeatures, AccountInfo, AdminData, CurrentLocationUpdated, LocalAccountInfo, ServerSidePairingStatus, Space, WebOnboardingModeEvent, } from '@dashlane/communication';
import { DeviceInfo } from 'webapp/account/device-management/types';
export type SpaceData = {
    spaces: Space[];
};
type TeamId = string;
export type TeamAdminData = {
    teams: Record<TeamId, AdminData>;
};
export interface State {
    abtesting: ABTestingEvent;
    currentLocation: CurrentLocationUpdated;
    loginStatus: {
        loggedIn: boolean;
        login: string;
        needsSSOMigration?: boolean;
    };
    serverSidePairingStatus: ServerSidePairingStatus;
    devices: DeviceInfo[];
    accountInfo: AccountInfo;
    accountFeatures: AccountFeatures;
    hasLoadedLocalAccountListAFirstTime: boolean;
    hasNoSessionToResume: boolean;
    localAccounts: LocalAccountInfo[] | null;
    spaceData: SpaceData;
    teamAdminData: TeamAdminData;
    webOnboardingMode: WebOnboardingModeEvent;
}
