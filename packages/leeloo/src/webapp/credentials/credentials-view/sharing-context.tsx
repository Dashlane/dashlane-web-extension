import { createContext, ReactNode, useContext, useMemo } from "react";
import { useModuleQueries } from "@dashlane/framework-react";
import {
  Permission,
  sharingItemsApi,
  SharingStatus,
} from "@dashlane/sharing-contracts";
import { useCredentialsContext } from "./credentials-context";
interface Context {
  sharingStatus: Record<string, SharingStatus>;
  isSharingEnabled: boolean;
  isSharingAllowed: boolean;
  itemsPermission: Record<string, Permission | undefined>;
}
const SharingContext = createContext<Context>({} as Context);
interface Provider {
  children: ReactNode;
}
const SharingProvider = ({ children }: Provider) => {
  const { credentialIds: ids } = useCredentialsContext();
  const {
    getSharingStatusForItems: sharingStatus,
    getPermissionForItems: itemsPermission,
    sharingEnabled,
    isSharingAllowed,
  } = useModuleQueries(
    sharingItemsApi,
    {
      getSharingStatusForItems: {
        queryParam: {
          itemIds: ids,
        },
      },
      getPermissionForItems: {
        queryParam: {
          itemIds: ids,
        },
      },
      isSharingAllowed: {},
      sharingEnabled: {},
    },
    [ids]
  );
  const contextValue = useMemo(() => {
    return {
      sharingStatus: sharingStatus.data ?? {},
      itemsPermission: itemsPermission.data ?? {},
      isSharingEnabled: sharingEnabled.data ?? false,
      isSharingAllowed: isSharingAllowed.data ?? false,
    };
  }, [
    isSharingAllowed.data,
    itemsPermission.data,
    sharingEnabled.data,
    sharingStatus.data,
  ]);
  return (
    <SharingContext.Provider value={contextValue}>
      {children}
    </SharingContext.Provider>
  );
};
const useSharingContext = (): Context => {
  const context = useContext(SharingContext);
  if (!context) {
    throw new Error("useSharingContext must be used within a SharingProvider");
  }
  return context;
};
export { SharingProvider, useSharingContext };
