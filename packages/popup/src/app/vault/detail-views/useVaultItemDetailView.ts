import { useContext } from 'react';
import { VaultItemDetailViewContext } from 'src/app/vault/detail-views/vault-item-detail-view-provider';
export const useVaultItemDetailView = () => {
    return useContext(VaultItemDetailViewContext);
};
