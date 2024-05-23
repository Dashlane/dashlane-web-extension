import * as React from 'react';
import { Country } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import DetailField from 'libs/dashlane-style/detail-field';
import { PanelTransitionTimeout } from 'libs/router/Routes/PanelTransitionRoute';
import { FieldSpacer } from 'libs/dashlane-style/field-spacer/field-spacer';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { countriesUsingExpiry } from 'webapp/ids/form/countries-using-expiry';
import { I18N_KEYS_COMMON } from 'webapp/ids/form/common-fields-translations';
import { CopyTextField, CountryAndStateField, DateField, SpaceField, TextInputField, } from 'webapp/ids/form/fields';
const I18N_KEYS = {
    ...I18N_KEYS_COMMON,
    STATE_LABEL: 'webapp_id_form_field_label_state',
};
interface Props {
    variant: 'add' | 'edit';
    handleCopy?: (success: boolean, error: Error | undefined) => void;
    handleError: (error: Error) => void;
    country: Country;
}
const DriverLicenseFormComponent = ({ variant, handleCopy, handleError, country, }: Props) => {
    const { translate } = useTranslate();
    const focusField = React.useRef<DetailField>(null);
    const { shouldShowTrialDiscontinuedDialog: isDisabled } = useTrialDiscontinuedDialogContext();
    React.useEffect(variant === 'add'
        ? () => {
            const focusTimeout = setTimeout(() => {
                focusField.current?.focus();
            }, PanelTransitionTimeout);
            return () => clearTimeout(focusTimeout);
        }
        : () => { }, []);
    return (<>
      <TextInputField name="idName" label={translate(I18N_KEYS.NAME_LABEL)} placeholder={translate(I18N_KEYS.NAME_PLACEHOLDER)} ref={focusField} disabled={!!isDisabled}/>
      <CopyTextField name="idNumber" label={translate(I18N_KEYS.ID_NUMBER_LABEL)} placeholder={translate(I18N_KEYS.ID_NUMBER_PLACEHOLDER)} handleCopy={variant === 'edit' ? handleCopy : undefined} disabled={!!isDisabled}/>
      <DateField name="issueDate" label={translate(I18N_KEYS.ISSUE_DATE_LABEL)} disabled={!!isDisabled}/>
      <DateField name="expirationDate" label={translate(countriesUsingExpiry.has(country)
            ? I18N_KEYS.EXPIRATION_DATE_LABEL_UK
            : I18N_KEYS.EXPIRATION_DATE_LABEL_US)} disabled={!!isDisabled}/>
      <CountryAndStateField countryFieldLabel={translate(I18N_KEYS.COUNTRY_LABEL)} stateFieldLabel={translate(I18N_KEYS.STATE_LABEL)} handleError={handleError} disabled={!!isDisabled}/>
      <FieldSpacer height={24}/>
      <SpaceField name="spaceId" disabled={!!isDisabled}/>
    </>);
};
export const DriverLicenseForm = React.memo(DriverLicenseFormComponent);
