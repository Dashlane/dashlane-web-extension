import React from 'react';
import { VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { getCurrentSpaceId } from 'libs/webapp';
import { AddPanel } from 'webapp/ids/add/add-panel';
import { getCurrentCountry } from 'webapp/ids/helpers';
import { Header } from 'webapp/ids/form/header';
import { PassportFormFields } from 'webapp/ids/types';
import { PassportForm } from 'webapp/ids/form/documents/passport-form';
interface Props {
    lee: Lee;
    listRoute: string;
}
const I18N_KEYS = {
    SUCCESS_DEFAULT: 'webapp_id_creation_passport_alert_add_success_default',
    TITLE_DEFAULT: 'webapp_id_creation_passport_title_default',
};
const countryToKeys = () => ({
    title: I18N_KEYS.TITLE_DEFAULT,
    success: I18N_KEYS.SUCCESS_DEFAULT,
});
export const PassportAddPanel = ({ lee, listRoute }: Props) => {
    const { translate } = useTranslate();
    const currentCountry = getCurrentCountry(lee.carbon.currentLocation);
    const currentSpaceId = getCurrentSpaceId(lee.globalState) ?? '';
    const initialValues: PassportFormFields = {
        idName: '',
        idNumber: '',
        expirationDate: '',
        issueDate: '',
        country: currentCountry,
        spaceId: currentSpaceId,
        issuePlace: '',
    };
    return (<AddPanel<PassportFormFields> initialValues={initialValues} listRoute={listRoute} reportError={lee.reportError} countryToKeys={countryToKeys} type={VaultItemType.Passport} header={(country) => (<Header title={translate(countryToKeys().title)} country={country} type={VaultItemType.Passport}/>)}>
      {({ values }) => <PassportForm variant="add" country={values.country}/>}
    </AddPanel>);
};
