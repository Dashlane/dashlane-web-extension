import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { DataStatus } from "../types";
import { carbonConnector } from "../../../carbonConnector";
import { useIsMPlessUser } from "../account/useIsMPLessAccount";
import { useEffect, useState } from "react";
export function useAreProtectedItemsUnlocked(): boolean {
  const [unlocked, setUnlocked] = useState(false);
  const isMPLessUser = useIsMPlessUser();
  const lockDate = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.vaultLockDate,
      },
      liveConfig: {
        live: carbonConnector.liveVaultLockDate,
      },
    },
    []
  );
  const shouldSkipPrompt =
    isMPLessUser.isMPLessUser ||
    (lockDate.status === DataStatus.Success && !lockDate.data);
  const whenToLock =
    lockDate.status === DataStatus.Success && !!lockDate.data
      ? lockDate.data - Date.now()
      : -1;
  useEffect(() => {
    if (shouldSkipPrompt) {
      setUnlocked(true);
      return;
    }
    if (whenToLock < 0) {
      setUnlocked(false);
      return;
    }
    setUnlocked(true);
    const timerId = setTimeout(() => {
      setUnlocked(false);
    }, whenToLock);
    return () => {
      clearTimeout(timerId);
    };
  }, [whenToLock, shouldSkipPrompt]);
  return unlocked;
}
