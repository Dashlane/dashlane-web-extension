import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { IdentityDetailForm } from './identity-detail-form';
import { IdentityDetailHeader } from './identity-detail-header';
interface IdentityDetailViewComponentProps {
    onClose: () => void;
    itemId: string;
}
const IdentityDetailViewComponent = ({ onClose, itemId, }: IdentityDetailViewComponentProps) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Identity],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemEmailDetails);
    }, []);
    if (status !== DataStatus.Success || !data.identitiesResult.items.length) {
        return null;
    }
    const identity = data.identitiesResult.items[0];
    return (<>
      <IdentityDetailHeader identity={identity} onClose={onClose}/>
      <IdentityDetailForm identity={identity}/>
    </>);
};
export const IdentityDetailView = memo(IdentityDetailViewComponent);
