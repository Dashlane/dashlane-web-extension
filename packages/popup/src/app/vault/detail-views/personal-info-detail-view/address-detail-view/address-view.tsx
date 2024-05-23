import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { AddressDetailHeader } from './address-header';
import { AddressDetailForm } from './address-form';
interface Props {
    onClose: () => void;
    itemId: string;
}
const AddressDetailViewComponent = ({ onClose, itemId }: Props) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Address],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemAddressDetails);
    }, []);
    if (status !== DataStatus.Success || !data.addressesResult.items.length) {
        return null;
    }
    const address = data.addressesResult.items[0];
    return (<>
      <AddressDetailHeader name={address.itemName} id={address.id} onClose={onClose}/>
      <AddressDetailForm address={address}/>
    </>);
};
export const AddressDetailView = memo(AddressDetailViewComponent);
