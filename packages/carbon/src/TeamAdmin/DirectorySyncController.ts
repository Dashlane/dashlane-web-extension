import { WSService } from "Libs/WS/index";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
import * as directorySyncService from "TeamAdmin/Services/DirectorySyncService";
import { ISharingServices } from "Sharing/2/Services";
import { getCurrentUserInfo } from "Session/utils";
export interface DirectorySyncControllerServices {
  storeService: StoreService;
  localStorageService: LocalStorageService;
  wsService: WSService;
  sessionService: SessionService;
  sharingService: ISharingServices;
}
export interface DirectorySyncController {
  directorySyncForAllTeams: () => Promise<any>[];
  keyValidatedByTacAdmin: (teamId: string, publicKey: string) => void;
  keyRejectedByTacAdmin: (teamId: string, requestId: number) => Promise<void>;
}
export const makeDirectorySyncController = (
  services: DirectorySyncControllerServices
): DirectorySyncController => {
  const {
    storeService,
    localStorageService,
    wsService,
    sessionService,
    sharingService,
  } = services;
  return {
    directorySyncForAllTeams: () =>
      directorySyncService.directorySyncForAllTeams(
        storeService,
        wsService,
        sessionService
      ),
    keyValidatedByTacAdmin: (teamId, publicKey) =>
      keyValidatedByTacAdmin(
        sharingService,
        storeService,
        localStorageService,
        wsService,
        sessionService,
        teamId,
        publicKey
      ),
    keyRejectedByTacAdmin: (teamId, requestId) =>
      directorySyncService.keyRejectedByTacAdmin(
        storeService,
        wsService,
        teamId,
        requestId
      ),
  };
};
function keyValidatedByTacAdmin(
  sharingService: ISharingServices,
  storeService: StoreService,
  localStorageService: LocalStorageService,
  wsService: WSService,
  sessionService: SessionService,
  teamId: string,
  publicKey: string
) {
  const adminData = storeService.getTeamAdminData().teams[teamId];
  const currentUserInfo = getCurrentUserInfo(storeService);
  const saveDirectorySyncKey = () =>
    directorySyncService.saveDirectorySyncKey(
      sharingService,
      storeService,
      localStorageService,
      currentUserInfo,
      adminData,
      teamId,
      publicKey
    );
  const retryDirectorySyncForTeam = () =>
    directorySyncService.directorySyncForTeam(
      storeService,
      wsService,
      sessionService,
      teamId
    );
  return saveDirectorySyncKey()
    .then(retryDirectorySyncForTeam)
    .catch(() => {});
}
