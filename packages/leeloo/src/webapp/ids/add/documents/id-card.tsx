import React from 'react';
import { VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { getCurrentSpaceId } from 'libs/webapp';
import { AddPanel } from 'webapp/ids/add/add-panel';
import { getCurrentCountry } from 'webapp/ids/helpers';
import { Header } from 'webapp/ids/form/header';
import { IdCardFormFields } from 'webapp/ids/types';
import { IdCardForm } from 'webapp/ids/form/documents/id-card-form';
interface Props {
    lee: Lee;
    listRoute: string;
}
const I18N_KEYS = {
    SUCCESS_DEFAULT: "webapp_id_creation_idcard_alert_add_success_default",
    TITLE_DEFAULT: 'webapp_id_creation_idcard_title_default',
};
const countryToKeys = () => ({
    title: I18N_KEYS.TITLE_DEFAULT,
    success: I18N_KEYS.SUCCESS_DEFAULT,
});
export const IdCardAddPanel = ({ lee, listRoute }: Props) => {
    const { translate } = useTranslate();
    const currentCountry = getCurrentCountry(lee.carbon.currentLocation);
    const currentSpaceId = getCurrentSpaceId(lee.globalState) ?? '';
    const initialValues: IdCardFormFields = {
        idName: '',
        idNumber: '',
        expirationDate: '',
        issueDate: '',
        country: currentCountry,
        spaceId: currentSpaceId,
    };
    return (<AddPanel<IdCardFormFields> initialValues={initialValues} listRoute={listRoute} reportError={lee.reportError} countryToKeys={countryToKeys} header={(country) => (<Header title={translate(countryToKeys().title)} country={country} type={VaultItemType.IdCard}/>)} type={VaultItemType.IdCard}>
      {({ values }) => <IdCardForm variant="add" country={values.country}/>}
    </AddPanel>);
};
