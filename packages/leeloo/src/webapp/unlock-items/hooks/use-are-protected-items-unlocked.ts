import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
import { useIsMPlessUser } from "../../account/security-settings/hooks/use-is-mpless-user";
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
