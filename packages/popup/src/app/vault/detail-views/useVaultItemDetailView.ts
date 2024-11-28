import { useContext } from "react";
import { VaultItemDetailViewContext } from "./vault-item-detail-view-provider";
export const useVaultItemDetailView = () => {
  return useContext(VaultItemDetailViewContext);
};
