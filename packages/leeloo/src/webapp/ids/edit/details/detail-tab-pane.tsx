import React, { useRef, useState } from 'react';
import { useToast } from '@dashlane/design-system';
import { UserCopyVaultItemFieldEvent } from '@dashlane/hermes';
import { isSuccess } from '@dashlane/framework-types';
import { useModuleCommands } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { FormikHelpers, FormikProps } from 'formik';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { idTypeToField, idTypeToItemType } from 'webapp/ids/logs';
import { IdItem } from 'webapp/ids/types';
import { IdDocumentEditFooter } from 'webapp/ids/edit/footer';
import { IdForm } from 'webapp/ids/form/form';
import { DetailTabPaneProps } from './details-types';
const FORM_ID = 'id-edit-form';
const I18N_KEYS = {
    DIALOG_DELETE_SUBTITLE: 'webapp_id_edition_dialog_delete_subtitle',
    DIALOG_DELETE_DISMISS: 'webapp_id_edition_dialog_delete_dismiss',
    DIALOG_DELETE_CONFIRM: 'webapp_id_edition_dialog_delete_confirm',
    GENERIC_ERROR: '_common_generic_error',
};
export const DetailTabPane = ({ itemId, type, openConfirmDeleteDialog, editAlertTranslation, reportError, initialValues, hasUnsavedData, setHasUnsavedData, setCurrentCountry, copySuccessKey, hasTabs, focusAttachment, children, showListView, }: DetailTabPaneProps) => {
    const { translate } = useTranslate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const formRef = useRef((formInstance: FormikProps<IdItem> | null) => {
        if (formInstance !== null) {
            const { dirty, isSubmitting: submitting, values } = formInstance;
            setHasUnsavedData(dirty);
            setIsSubmitting(submitting);
            setCurrentCountry(values.country);
        }
    });
    const { showToast } = useToast();
    const handleCancel = () => {
        showListView();
    };
    const handleCopy = (success: boolean, error: Error | undefined) => {
        logEvent(new UserCopyVaultItemFieldEvent({
            itemType: idTypeToItemType[type],
            field: idTypeToField[type],
            itemId,
            isProtected: false,
        }));
        if (success) {
            showToast({
                description: translate(copySuccessKey),
            });
        }
        if (error && typeof reportError === 'function') {
            reportError(error, '[id-form] Unable to copy to clipboard');
        }
    };
    const displayGenericError = () => {
        showToast({
            description: translate(I18N_KEYS.GENERIC_ERROR),
            mood: 'danger',
            isManualDismiss: true,
        });
    };
    const handleSubmit = async (values: IdItem, { setSubmitting, setFieldError }: FormikHelpers<IdItem>) => {
        const requiredProperty = type === VaultItemType.FiscalId ? 'fiscalNumber' : 'idNumber';
        if (!values[requiredProperty]) {
            return setFieldError(requiredProperty, '');
        }
        try {
            setSubmitting(true);
            const updateResult = await updateVaultItem({
                vaultItemType: type,
                content: values,
                id: itemId,
            });
            if (isSuccess(updateResult)) {
                showToast({
                    description: translate(editAlertTranslation),
                });
                showListView();
            }
            else {
                setSubmitting(false);
                displayGenericError();
                reportError(new Error('[ids][edit] Unable to update id'), updateResult.error?.errorMessage);
            }
        }
        catch (error) {
            setSubmitting(false);
            displayGenericError();
            reportError(error, '[ids][edit] Unexpected exception while updating id');
        }
    };
    return (<>
      <IdForm formId={FORM_ID} formRef={formRef.current} handleSubmit={handleSubmit} initialValues={initialValues} variant="edit">
        {(values) => children({ handleCopy, values })}
      </IdForm>
      <IdDocumentEditFooter formId={FORM_ID} handleCancel={handleCancel} handleDelete={openConfirmDeleteDialog} hasDataBeenModified={hasUnsavedData} isSubmitting={isSubmitting} focusAttachmentTab={hasTabs ? focusAttachment : undefined}/>
    </>);
};
