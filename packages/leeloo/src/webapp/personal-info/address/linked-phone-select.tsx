import React from 'react';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import DetailSelect, { Option } from 'libs/dashlane-style/select-field/detail';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
interface LinkedPhoneOption extends Option {
    value: string;
}
interface Props {
    handleChange: (eventOrValue: React.ChangeEvent<any> | any) => void;
    linkedPhoneId?: string;
    disabled?: boolean;
}
export const LinkedPhoneSelect = ({ linkedPhoneId, handleChange, disabled = false, }: Props) => {
    const { translate } = useTranslate();
    const phonesQueryResult = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Phone],
    });
    if (phonesQueryResult.status !== DataStatus.Success) {
        return null;
    }
    const phones = phonesQueryResult.data.phonesResult.items;
    const linkedPhoneOptions: LinkedPhoneOption[] = [
        {
            value: '',
            label: translate('webapp_personal_info_edition_address_phone_number_other'),
        },
        ...phones.map((phone) => ({
            value: phone.id,
            label: `${phone.itemName} ${phone.phoneNumber}`,
            selectedLabel: (<span>
          <span className={styles.phoneName}>{phone.itemName}</span>{' '}
          {phone.phoneNumber}
        </span>),
        })),
    ];
    const currentLinkedPhoneOption = linkedPhoneOptions.find((item) => item.value === linkedPhoneId) ??
        linkedPhoneOptions[0];
    return (<DetailSelect label={translate('webapp_personal_info_edition_address_phone_number_label')} placeholder="" dataName="linkedPhoneId" defaultOption={currentLinkedPhoneOption} options={linkedPhoneOptions} onChange={handleChange} disabled={disabled}/>);
};
