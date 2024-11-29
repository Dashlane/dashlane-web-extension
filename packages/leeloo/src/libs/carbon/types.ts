import {
  ABTestingEvent,
  AccountFeatures,
  AdminData,
  CurrentLocationUpdated,
  LocalAccountInfo,
  ServerSidePairingStatus,
  Space,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
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
  accountFeatures: AccountFeatures;
  hasLoadedLocalAccountListAFirstTime: boolean;
  hasNoSessionToResume: boolean;
  localAccounts: LocalAccountInfo[] | null;
  spaceData: SpaceData;
  teamAdminData: TeamAdminData;
  webOnboardingMode: WebOnboardingModeEvent;
}
