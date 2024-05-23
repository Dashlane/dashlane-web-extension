import React from 'react';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'src/libs/i18n/useTranslate';
import Input from 'src/components/inputs/common/input/input';
interface Props {
    linkedPhoneId: string;
}
export const LinkedPhoneInput = ({ linkedPhoneId }: Props) => {
    const { translate } = useTranslate();
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Phone],
        ids: [linkedPhoneId],
    });
    if (status !== DataStatus.Success || !data.phonesResult.items.length) {
        return null;
    }
    return (<Input id="addressLinkedPhone" inputType="text" label={translate('tab/all_items/personal_info/address/detail_view/label/address_linked_phone')} value={data.phonesResult.items[0].phoneNumber} readonly/>);
};
