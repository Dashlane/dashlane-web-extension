import { useCallback, useRef } from "react";
import { SecureFileResultErrorCode } from "@dashlane/communication";
import { useModuleCommands } from "@dashlane/framework-react";
import { getFailure, isSuccess } from "@dashlane/framework-types";
import {
  Action,
  ItemType as TrackingItemType,
  UserUpdateVaultItemAttachmentEvent,
} from "@dashlane/hermes";
import {
  DeleteSecureFileCommandErrors,
  secureFilesApi,
} from "@dashlane/vault-contracts";
import { logEvent } from "../../../libs/logs/logEvent";
const UI_RECOVERABLE_FUNCTIONAL_ERRORS = [
  DeleteSecureFileCommandErrors.NO_REMOTE_FILE,
  DeleteSecureFileCommandErrors.SECURE_FILE_QUOTA_UPDATE,
];
export function useSecureFileDelete(
  parentTrackingItemType: TrackingItemType,
  errorCallback: (code: SecureFileResultErrorCode) => unknown,
  successCallback?: (id: string) => unknown
) {
  const successCallbackRef = useRef(successCallback);
  successCallbackRef.current = successCallback;
  const errorCallbackRef = useRef(errorCallback);
  errorCallbackRef.current = errorCallback;
  const { deleteSecureFile } = useModuleCommands(secureFilesApi);
  const deleteFile = useCallback(
    async (id) => {
      const deleteSecureFileResult = await deleteSecureFile({ id }).catch(
        () => null
      );
      const uiSuccess =
        deleteSecureFileResult &&
        (isSuccess(deleteSecureFileResult) ||
          UI_RECOVERABLE_FUNCTIONAL_ERRORS.includes(
            getFailure(deleteSecureFileResult).tag
          ));
      if (uiSuccess) {
        successCallbackRef.current?.(id);
        logEvent(
          new UserUpdateVaultItemAttachmentEvent({
            attachmentAction: Action.Delete,
            itemId: id,
            itemType: parentTrackingItemType,
          })
        );
      } else {
        errorCallbackRef.current(SecureFileResultErrorCode.INTERNAL_ERROR);
      }
    },
    [deleteSecureFile, parentTrackingItemType]
  );
  return deleteFile;
}
