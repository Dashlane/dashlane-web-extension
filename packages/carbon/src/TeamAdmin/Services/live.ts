import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { AdminProvisioningKeyData } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import {
  administrableUserGroupsSelector,
  getAdministrableUserGroupSelector,
} from "TeamAdmin/Services/selectors";
import { adminProvisioningKeySelector } from "./EncryptionService/adminProvisioningKey/adminProvisioningKeySelector";
export function administrableUserGroups$(): StateOperator<UserGroupDownload[]> {
  const selector = administrableUserGroupsSelector;
  return pipe(map(selector), distinctUntilChanged());
}
export function administrableUserGroup$(
  groupId: string
): StateOperator<UserGroupDownload> {
  const selector = getAdministrableUserGroupSelector(groupId);
  return pipe(map(selector), distinctUntilChanged());
}
export const adminProvisioningKey$ =
  (): StateOperator<AdminProvisioningKeyData> => {
    return pipe(map(adminProvisioningKeySelector), distinctUntilChanged());
  };
