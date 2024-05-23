import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import DetailField from 'libs/dashlane-style/detail-field';
import { PanelTransitionTimeout } from 'libs/router/Routes/PanelTransitionRoute';
import { FieldSpacer } from 'libs/dashlane-style/field-spacer/field-spacer';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { I18N_KEYS_COMMON } from 'webapp/ids/form/common-fields-translations';
import { CopyTextField, CountryField, SpaceField, TextInputField, } from 'webapp/ids/form/fields';
const I18N_KEYS = {
    ...I18N_KEYS_COMMON
};
interface Props {
    variant: 'add' | 'edit';
    handleCopy?: (success: boolean, error: Error | undefined) => void;
}
const SocialSecurityIdFormComponent = ({ variant, handleCopy }: Props) => {
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
      <TextInputField name="idName" label={translate(I18N_KEYS.NAME_LABEL)} placeholder={translate(I18N_KEYS.NAME_PLACEHOLDER)} ref={focusField} disabled={!!isDisabled}/>
      <CopyTextField name="idNumber" label={translate(I18N_KEYS.ID_NUMBER_LABEL)} placeholder={translate(I18N_KEYS.ID_NUMBER_PLACEHOLDER)} handleCopy={variant === 'edit' ? handleCopy : undefined} disabled={!!isDisabled}/>
      <CountryField name="country" label={translate(I18N_KEYS.COUNTRY_LABEL)} disabled={!!isDisabled}/>
      <FieldSpacer height={24}/>
      <SpaceField name="spaceId" disabled={!!isDisabled}/>
    </>);
};
export const SocialSecurityIdForm = React.memo(SocialSecurityIdFormComponent);
