import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { PhoneDetailHeader } from './phone-header';
import { PhoneDetailForm } from './phone-form';
interface Props {
    onClose: () => void;
    itemId: string;
}
const PhoneDetailViewComponent = ({ onClose, itemId }: Props) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Phone],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemPhoneDetails);
    }, []);
    if (status !== DataStatus.Success || !data.phonesResult.items.length) {
        return null;
    }
    const phone = data.phonesResult.items[0];
    return (<>
      <PhoneDetailHeader name={phone.itemName} id={phone.id} onClose={onClose}/>
      <PhoneDetailForm phone={phone}/>
    </>);
};
export const PhoneDetailView = memo(PhoneDetailViewComponent);
