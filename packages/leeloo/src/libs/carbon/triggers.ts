import * as communication from "@dashlane/communication";
import { carbonConnector } from "./connector";
export type GlobalDispatcher = (action: { type: string }) => void;
export const createUserGroup = (
  dispatchGlobal: GlobalDispatcher,
  params: {
    name: string;
    teamId: number;
  }
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    carbonConnector.createUserGroup(params).then(({ error }) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};
export const deleteUserGroup = (params: {
  groupId: string;
  revision: number;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    carbonConnector.deleteUserGroup(params).then(({ error }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
export const renameUserGroup = (params: {
  groupId: string;
  revision: number;
  name: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    carbonConnector.renameUserGroup(params).then(({ error }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
export const inviteMembers = (
  params: communication.InviteUserGroupMembersRequest
): Promise<communication.InviteUserGroupMembersResult> => {
  return carbonConnector.inviteUserGroupMembers(params);
};
export const teamUpdated = (params: communication.TeamUpdatedRequest) => {
  return new Promise<void>((resolve, reject) => {
    carbonConnector
      .teamUpdated(params)
      .then(({ errors }: communication.TeamUpdatedResponse) => {
        if (errors) {
          reject(errors);
        } else {
          resolve();
        }
      });
  });
};
export const getMasterPasswordResetDemandList = (
  params: communication.ListMasterPasswordResetDemandsRequest
): Promise<communication.MasterPasswordResetDemand[]> => {
  return new Promise((resolve, reject) => {
    carbonConnector
      .getMasterPasswordResetDemandList(params)
      .then(({ demands, error }) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve(demands);
      });
  });
};
export const setTeamSettings = (
  params: communication.SetTeamSettingsRequest
): Promise<void> => {
  return new Promise((resolve, reject) => {
    carbonConnector
      .setTeamSettings(params)
      .then(({ error }) => (error ? reject(error) : resolve()));
  });
};
export const checkIfMasterPasswordIsValid = (
  param: communication.CheckIfMasterPasswordIsValid
): Promise<boolean> => {
  return new Promise((resolve) => {
    carbonConnector
      .checkIfMasterPasswordIsValid(param)
      .then((response) => resolve(response.isMasterPasswordValid));
  });
};
export const acceptMasterPasswordResetDemand = (
  params: communication.AcceptMasterPasswordResetDemandRequest
): Promise<void> => {
  return new Promise((resolve, reject) => {
    carbonConnector
      .acceptMasterPasswordResetDemand(params)
      .then(({ error }) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve();
      });
  });
};
export const declineMasterPasswordResetDemand = (
  params: communication.DeclineMasterPasswordResetDemandRequest
): Promise<void> => {
  return new Promise((resolve, reject) => {
    carbonConnector
      .declineMasterPasswordResetDemand(params)
      .then(({ error }) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve();
      });
  });
};
export const getTeamMembers = (
  params: communication.GetTeamMembersRequest
): Promise<communication.TeamMemberInfo[]> => {
  return new Promise((resolve, reject) => {
    carbonConnector
      .getMembers(params)
      .then((response: communication.GetTeamMembersResult) => {
        if (response.success) {
          return resolve(response.members);
        } else {
          return reject(response.error);
        }
      });
  });
};
export const addTeamAdmin = (params: communication.AddTeamAdminRequest) => {
  return new Promise<void>((resolve, reject) => {
    carbonConnector
      .addTeamAdmin(params)
      .then(({ error }: communication.AddTeamAdminResult) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
  });
};
export const removeTeamAdmin = (
  params: communication.RemoveTeamAdminRequest
) => {
  return new Promise<void>((resolve, reject) => {
    carbonConnector
      .removeTeamAdmin(params)
      .then(({ error }: communication.RemoveTeamAdminResult) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
  });
};
export const checkDirectorySyncKeyResponse = (
  params: communication.CheckDirectorySyncKeyRequest,
  response: communication.CheckDirectorySyncKeyResponseStatus
) => {
  return carbonConnector.checkDirectorySyncKeyResponse({ ...params, response });
};
export const queryStaticDataCollections = (
  params: communication.QueryStaticDataCollectionsRequest
): Promise<communication.StaticDataResult[]> => {
  return new Promise((resolve, reject) => {
    const queriesCount = params.queries.length;
    carbonConnector
      .queryStaticDataCollections(params)
      .then(({ error, results }) => {
        if (error) {
          return reject(error);
        }
        if (results.length !== queriesCount) {
          return reject(
            new Error(
              "Unexpected response from carbonConnector.queryStaticDataCollections: invalid number of collections"
            )
          );
        }
        return resolve(results);
      });
  });
};
export const shareItem = (
  itemId: string,
  permission: communication.MemberPermission,
  recipients: communication.Recipient[]
) => {
  return carbonConnector.shareItem({
    itemId,
    permission,
    recipients,
  });
};
