import { ChangeEvent, Fragment, KeyboardEvent, useCallback, useState, } from 'react';
import { jsx, Paragraph } from '@dashlane/design-system';
import { TeamPolicyUpdates } from '@dashlane/team-admin-contracts';
import ConfirmationDialog from 'libs/dashlane-style/dialogs/confirm-with-master-password';
import SwitchWithFeedback from 'libs/dashlane-style/switch';
import useTranslate from 'libs/i18n/useTranslate';
import { checkIfMasterPasswordIsValid as carbonCheckIfMasterPasswordIsValid } from 'libs/carbon/triggers';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { SettingField, SettingFieldProps } from '../types';
export type PolicySwitchFieldProps = SettingFieldProps & {
    field: SettingField;
};
const I18N_KEYS = {
    BUTTON_SAVE_LABEL: 'team_settings_button_save_label',
    SAVING_LABEL: 'team_settings_saving_label',
    BUTTON_EDIT_LABEL: 'team_settings_button_edit_label',
    SAVE_SUCCESS_LABEL: 'team_settings_save_success_label',
    SWITCH_DEFAULT_ERROR: '_common_generic_error',
};
export const PolicySwitchField = ({ field, editSettings, checkForAuthenticationError, policies, }: PolicySwitchFieldProps) => {
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const [dialogIsVisible, setDialogIsVisible] = useState(false);
    const [masterPasswordFieldValue, setMasterPasswordFieldValue] = useState('');
    const [isMasterPasswordInvalid, setIsMasterPasswordInvalid] = useState(false);
    const confirm = field.value ?? false ? field.confirmDisable : field.confirmEnable;
    const setup = field.value ? field.confirmDisable : field.confirmEnable;
    const handleSwitchToggle = useCallback(async () => {
        if (!editSettings || checkForAuthenticationError?.()) {
            return;
        }
        const policyUpdates = {} as TeamPolicyUpdates;
        if (field.feature) {
            const toggledValue = field.value !== undefined ? !field.value : false;
            policyUpdates[field.feature] = field.serializer
                ? field.serializer(toggledValue)
                : toggledValue;
            if (!toggledValue) {
                field.constraintsFromOtherFields?.requiredFor?.forEach((required) => required.reset?.(policyUpdates));
            }
        }
        try {
            await editSettings(policyUpdates);
        }
        catch (error) {
            const content = error.data?.content ||
                (error.code === 429 && { error: 'too_many_requests' }) ||
                (error.message === 'not_authorized' && {
                    error: 'not_authorized',
                }) ||
                {};
            const message = field.getErrorMessageForKey?.(content.error);
            reportTACError(error, message);
        }
    }, [checkForAuthenticationError, editSettings, field, reportTACError]);
    const hideConfirmationDialog = useCallback(() => {
        setDialogIsVisible(false);
        setMasterPasswordFieldValue('');
        setIsMasterPasswordInvalid(false);
    }, []);
    const showConfirmationDialog = useCallback(() => {
        setDialogIsVisible(true);
        setMasterPasswordFieldValue('');
        setIsMasterPasswordInvalid(false);
        return Promise.resolve();
    }, []);
    const checkIfMasterPasswordIsValid = useCallback(async () => {
        const isMasterPasswordValid = await carbonCheckIfMasterPasswordIsValid({
            masterPassword: masterPasswordFieldValue ?? '',
        });
        setIsMasterPasswordInvalid(!isMasterPasswordValid);
        if (!isMasterPasswordValid) {
            return Promise.resolve();
        }
        hideConfirmationDialog();
        return handleSwitchToggle();
    }, [handleSwitchToggle, hideConfirmationDialog, masterPasswordFieldValue]);
    const handleMasterPasswordFieldChanged = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setMasterPasswordFieldValue(event.target.value);
        setIsMasterPasswordInvalid(false);
    }, []);
    const handleKeyPressed = useCallback((event: KeyboardEvent): void => {
        if (event.key === 'Enter' && masterPasswordFieldValue) {
            checkIfMasterPasswordIsValid();
        }
    }, [checkIfMasterPasswordIsValid, masterPasswordFieldValue]);
    const saveValueFunction = useCallback(async () => {
        if (field.customSwitchHandler) {
            await field.customSwitchHandler();
        }
        else if (confirm) {
            await showConfirmationDialog();
        }
        else {
            await handleSwitchToggle();
        }
    }, [confirm, field, handleSwitchToggle, showConfirmationDialog]);
    return (<>
      <SwitchWithFeedback isLoading={field.isLoading} genericErrorMessage={translate(I18N_KEYS.SWITCH_DEFAULT_ERROR)} ariaLabelledBy={field.feature} key={field.label} value={field.value} isReadOnly={field.isReadOnly} isDisabled={field.constraintsFromOtherFields?.disabledWhen?.some((disabledCondition) => policies && disabledCondition?.condition?.(policies))} disabledFeedbackMessage={field.constraintsFromOtherFields?.disabledWhen?.find((disabledField) => policies &&
            disabledField?.condition?.(policies) &&
            disabledField?.warningMessage)?.warningMessage} saveValueFunction={saveValueFunction} successMessage={translate(I18N_KEYS.SAVE_SUCCESS_LABEL)} savingMessage={translate(I18N_KEYS.SAVING_LABEL)}/>
      {dialogIsVisible && setup ? (<ConfirmationDialog isOpen title={setup.title} labelDismiss={setup.dismiss} labelConfirm={setup.confirm} onDismiss={hideConfirmationDialog} onConfirm={checkIfMasterPasswordIsValid} onChange={handleMasterPasswordFieldChanged} isMasterPasswordInvalid={isMasterPasswordInvalid} ctaIsDisabled={!masterPasswordFieldValue} onKeyDown={handleKeyPressed}>
          <Paragraph color="ds.text.neutral.quiet">{setup.helper1}</Paragraph>
          <Paragraph color="ds.text.neutral.quiet">{setup.helper2}</Paragraph>
          <Paragraph color="ds.text.neutral.quiet">{setup.label}</Paragraph>
        </ConfirmationDialog>) : null}
    </>);
};
