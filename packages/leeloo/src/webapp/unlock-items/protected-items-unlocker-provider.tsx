import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { ProtectedItemsUnlockerManager } from "./protected-items-unlocker-manager";
import { useAreProtectedItemsUnlocked } from "./hooks/use-are-protected-items-unlocked";
import { ProtectedItemsUnlockerProps, UnlockRequest } from "./types";
export const ProtectedItemsUnlockerContext =
  createContext<ProtectedItemsUnlockerProps>({
    openProtectedItemsUnlocker: () => {},
    areProtectedItemsUnlocked: false,
    protectedItemsUnlockerShown: false,
  });
export const ProtectedItemsUnlockerProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [unlockRequest, setUnlockRequest] = useState<UnlockRequest | null>(
    null
  );
  const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
  const unlockerShown = unlockRequest !== null;
  const contextValue = useMemo(
    () => ({
      areProtectedItemsUnlocked,
      openProtectedItemsUnlocker: setUnlockRequest,
      protectedItemsUnlockerShown: unlockerShown,
    }),
    [areProtectedItemsUnlocked, unlockerShown]
  );
  return (
    <ProtectedItemsUnlockerContext.Provider value={contextValue}>
      {children}
      {unlockRequest ? (
        <ProtectedItemsUnlockerManager
          unlockRequest={unlockRequest}
          setUnlockRequest={setUnlockRequest}
        />
      ) : null}
    </ProtectedItemsUnlockerContext.Provider>
  );
};
