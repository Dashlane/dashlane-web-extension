import {
  AcceptMasterPasswordResetDemandRequest,
  AcceptMasterPasswordResetDemandResult,
  DeclineMasterPasswordResetDemandRequest,
  DeclineMasterPasswordResetDemandResult,
  ListMasterPasswordResetDemandsRequest,
  ListMasterPasswordResetDemandsResponse,
  MasterPasswordResetRequest,
  MasterPasswordResetResult,
} from "@dashlane/communication";
import { makeAsymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
import { Debugger } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception/index";
import { StoreService } from "Store/index";
import { CurrentUserInfo, getCurrentUserInfo } from "Session/utils";
import { WSService } from "Libs/WS/index";
import { updateTeamAdminData } from "TeamAdmin/Services/UserGroupManagementSetupService/teamAdminData";
export interface RecoveryController {
  getMasterPasswordResetDemandList: (
    listMPResetDemandsRequest: ListMasterPasswordResetDemandsRequest
  ) => Promise<ListMasterPasswordResetDemandsResponse>;
  acceptMasterPasswordResetDemand: (
    acceptMPResetDemandRequest: AcceptMasterPasswordResetDemandRequest
  ) => Promise<AcceptMasterPasswordResetDemandResult>;
  declineMasterPasswordResetDemand: (
    declineMPResetDemandRequest: DeclineMasterPasswordResetDemandRequest
  ) => Promise<DeclineMasterPasswordResetDemandResult>;
}
export const makeRecoveryController = (
  storeService: StoreService,
  wsService: WSService
): RecoveryController => {
  return {
    getMasterPasswordResetDemandList: (listMPResetDemandsRequest) =>
      getMasterPasswordResetDemandList(
        storeService,
        wsService,
        getCurrentUserInfo(storeService),
        listMPResetDemandsRequest
      ),
    acceptMasterPasswordResetDemand: (acceptMPResetDemandRequest) =>
      acceptMasterPasswordResetDemand(
        wsService,
        getCurrentUserInfo(storeService),
        acceptMPResetDemandRequest
      ),
    declineMasterPasswordResetDemand: (declineMPResetDemandRequest) =>
      declineMasterPasswordResetDemand(
        wsService,
        getCurrentUserInfo(storeService),
        declineMPResetDemandRequest
      ),
  };
};
function reportError(
  message: string,
  error: Error,
  action: MasterPasswordResetRequest
): MasterPasswordResetResult {
  sendExceptionLog({ error });
  Debugger.log(message, error);
  return {
    error: {
      message: error.message,
      action,
    },
  };
}
function getMasterPasswordResetDemandList(
  storeService: StoreService,
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  listMPResetDemandsRequest: ListMasterPasswordResetDemandsRequest
): Promise<ListMasterPasswordResetDemandsResponse> {
  const teamId = listMPResetDemandsRequest.teamId;
  return wsService.recovery
    .getPendingRequests({
      login: currentUserInfo.login,
      uki: currentUserInfo.uki,
      teamId: teamId,
    })
    .then((demands) => {
      const teamAdminData = storeService.getTeamAdminData();
      const nextTeamAdminData = Object.assign({}, teamAdminData);
      const filteredDemands = demands.filter(
        (demands) => demands.login !== currentUserInfo.login
      );
      if (nextTeamAdminData.teams[teamId]) {
        nextTeamAdminData.teams[teamId].notifications = {
          accountRecoveryRequests: filteredDemands,
        };
        updateTeamAdminData(storeService, nextTeamAdminData);
      }
      return { demands: filteredDemands };
    })
    .catch((error: Error) => {
      const reportedError = reportError(
        "Master Password Reset: Error while getPendingRequests",
        error,
        listMPResetDemandsRequest
      );
      return {
        demands: [],
        error: reportedError.error,
      };
    });
}
function acceptMasterPasswordResetDemand(
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  acceptMPResetDemandRequest: AcceptMasterPasswordResetDemandRequest
): Promise<AcceptMasterPasswordResetDemandResult> {
  const cryptoService = makeAsymmetricEncryption();
  return (
    cryptoService.decrypt(
      currentUserInfo.privateKey,
      acceptMPResetDemandRequest.recoveryKey
    ) as Promise<string>
  )
    .then((decryptedRecoveryKey) =>
      cryptoService.encrypt(
        acceptMPResetDemandRequest.userPublicKey,
        decryptedRecoveryKey
      )
    )
    .then((encryptedRecoveryKey) => {
      return wsService.recovery.acceptRequest({
        login: currentUserInfo.login,
        uki: currentUserInfo.uki,
        sourceLogin: acceptMPResetDemandRequest.login,
        payload: encryptedRecoveryKey,
      });
    })
    .then(() => {
      return {};
    })
    .catch((error: Error) => {
      return reportError(
        "Master Password Reset: Error while acceptRequest",
        error,
        acceptMPResetDemandRequest
      );
    });
}
function declineMasterPasswordResetDemand(
  wsService: WSService,
  currentUserInfo: CurrentUserInfo,
  declineMPResetDemandRequest: DeclineMasterPasswordResetDemandRequest
): Promise<DeclineMasterPasswordResetDemandResult> {
  return wsService.recovery
    .refuseRequest({
      login: currentUserInfo.login,
      uki: currentUserInfo.uki,
      sourceLogin: declineMPResetDemandRequest.login,
    })
    .then(() => {
      return {};
    })
    .catch((error: Error) => {
      return reportError(
        "Master Password Reset: Error while refuseRequest",
        error,
        declineMPResetDemandRequest
      );
    });
}
