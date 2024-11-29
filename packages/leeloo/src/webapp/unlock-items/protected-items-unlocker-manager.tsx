import * as React from "react";
import { ProtectedItemsUnlockRequest, UnlockRequest } from "./types";
import { ProtectedItemsUnlockerDialog } from "./components/protected-items-unlocker-dialog";
export interface Props {
  unlockRequest: UnlockRequest;
  setUnlockRequest: (request: null | UnlockRequest) => void;
}
export const ProtectedItemsUnlockerManager = ({
  unlockRequest,
  setUnlockRequest,
}: ProtectedItemsUnlockRequest): React.ReactElement => {
  return (
    <ProtectedItemsUnlockerDialog
      unlockRequest={unlockRequest}
      setUnlockRequest={setUnlockRequest}
    />
  );
};
