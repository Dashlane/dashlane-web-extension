import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import DetailField from 'libs/dashlane-style/detail-field';
import { PanelTransitionTimeout } from 'libs/router/Routes/PanelTransitionRoute';
import { FieldSpacer } from 'libs/dashlane-style/field-spacer/field-spacer';
import { I18N_KEYS_COMMON } from 'webapp/ids/form/common-fields-translations';
import { CopyTextField, CountryField, SpaceField, TeledeclarantNumberField, } from 'webapp/ids/form/fields';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
const I18N_KEYS = {
    ...I18N_KEYS_COMMON,
    TELEDECLARANT_NUMBER_LABEL: 'webapp_id_form_field_label_teledeclarant_number',
    TELEDECLARANT_NUMBER_PLACEHOLDER: 'webapp_id_form_field_placeholder_teledeclarant_number',
    TAX_NUMBER_LABEL_DEFAULT: 'webapp_id_form_field_label_tax_number'
};
interface Props {
    variant: 'add' | 'edit';
    handleCopy?: (success: boolean, error: Error | undefined) => void;
}
const FiscalIdFormComponent = ({ variant, handleCopy }: Props) => {
    const { translate } = useTranslate();
    const { shouldShowTrialDiscontinuedDialog: isDisabled } = useTrialDiscontinuedDialogContext();
    const focusField = React.useRef<DetailField>(null);
    React.useEffect(variant === 'add'
        ? () => {
            const focusTimeout = setTimeout(() => {
                focusField.current?.focus();
            }, PanelTransitionTimeout);
            return () => clearTimeout(focusTimeout);
        }
        : () => { }, []);
    return (<>
      <CopyTextField name="fiscalNumber" label={translate(I18N_KEYS.TAX_NUMBER_LABEL_DEFAULT)} placeholder={translate(I18N_KEYS.ID_NUMBER_PLACEHOLDER)} handleCopy={variant === 'edit' ? handleCopy : undefined} ref={focusField} disabled={!!isDisabled}/>
      <TeledeclarantNumberField name="teledeclarantNumber" label={translate(I18N_KEYS.TELEDECLARANT_NUMBER_LABEL)} placeholder={translate(I18N_KEYS.TELEDECLARANT_NUMBER_PLACEHOLDER)} handleCopy={variant === 'edit' ? handleCopy : undefined} disabled={!!isDisabled}/>
      <CountryField name="country" label={translate(I18N_KEYS.COUNTRY_LABEL)} disabled={!!isDisabled}/>
      <FieldSpacer height={24}/>
      <SpaceField name="spaceId" disabled={!!isDisabled}/>
    </>);
};
export const FiscalIdForm = React.memo(FiscalIdFormComponent);
