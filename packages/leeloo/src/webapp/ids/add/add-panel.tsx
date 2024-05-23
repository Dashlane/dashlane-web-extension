import * as React from 'react';
import { PageView } from '@dashlane/hermes';
import { useToast } from '@dashlane/design-system';
import { Country } from '@dashlane/communication';
import { useModuleCommands } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { FormikHelpers, FormikProps } from 'formik';
import { redirect } from 'libs/router';
import { logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { IdFormFields, IdVaultItemType } from 'webapp/ids/types';
import { IdForm } from 'webapp/ids/form/form';
import { IdDocumentAddFooter } from 'webapp/ids/add/footer';
const FORM_ID = 'id-add-form';
const I18N_KEYS = {
    GENERIC_ERROR: '_common_generic_error',
};
interface AddChildProps<FormFields> {
    values: FormFields;
}
interface Props<FormFields> {
    children: ({ values }: AddChildProps<FormFields>) => JSX.Element;
    countryToKeys: (country: Country) => {
        title: string;
        success: string;
    };
    initialValues: FormFields;
    listRoute: string;
    reportError: (error: Error, message: string) => void;
    header: (country: Country) => JSX.Element;
    type: IdVaultItemType;
    requiredProperty?: string;
}
export function AddPanel<FormFields extends IdFormFields>({ children, initialValues, listRoute, reportError, countryToKeys, header, type, requiredProperty = 'idNumber', }: Props<FormFields>) {
    const { translate } = useTranslate();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const [hasDataBeenModified, setHasDataBeenModified] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [currentCountry, setCurrentCountry] = React.useState(initialValues.country);
    const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const { showToast } = useToast();
    React.useEffect(() => {
        const typeToPageView: Record<IdVaultItemType, PageView> = {
            [VaultItemType.DriversLicense]: PageView.ItemDriverLicenceCreate,
            [VaultItemType.FiscalId]: PageView.ItemFiscalStatementCreate,
            [VaultItemType.IdCard]: PageView.ItemIdCardCreate,
            [VaultItemType.Passport]: PageView.ItemPassportCreate,
            [VaultItemType.SocialSecurityId]: PageView.ItemSocialSecurityStatementCreate,
        };
        logPageView(typeToPageView[type]);
    }, [type]);
    React.useEffect(() => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
    }, [openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog]);
    const showListView = () => {
        logPageView(PageView.ItemIdList);
        redirect(listRoute);
    };
    const handleCancel = () => {
        showListView();
    };
    const displayGenericError = () => {
        showToast({
            description: translate(I18N_KEYS.GENERIC_ERROR),
            mood: 'danger',
            isManualDismiss: true,
        });
    };
    const handleSubmit = async (values: FormFields, { setSubmitting, setFieldError }: FormikHelpers<FormFields>) => {
        if (!values[requiredProperty]) {
            return setFieldError(requiredProperty, '');
        }
        try {
            const createResult = await createVaultItem({
                vaultItemType: type,
                content: values,
            });
            if (isSuccess(createResult)) {
                showToast({
                    description: translate(countryToKeys(currentCountry).success),
                });
                showListView();
            }
            else {
                setSubmitting(false);
                displayGenericError();
                reportError(new Error('[ids][add] Unable to add id'), createResult.error?.errorMessage);
            }
        }
        catch (error) {
            setSubmitting(false);
            displayGenericError();
            reportError(error, '[ids][add] Unexpected exception while add id');
        }
    };
    const formRef = React.useRef((formInstance: FormikProps<FormFields> | null) => {
        if (formInstance !== null) {
            const { dirty, isSubmitting: submitting, values } = formInstance;
            setHasDataBeenModified(dirty);
            setIsSubmitting(submitting);
            setCurrentCountry(values.country);
        }
    });
    return (<>
      {header(currentCountry)}
      <IdForm formId={FORM_ID} formRef={formRef.current} handleSubmit={handleSubmit} initialValues={initialValues} variant="add">
        {(values: FormFields) => children({ values })}
      </IdForm>
      <IdDocumentAddFooter formId={FORM_ID} handleCancel={handleCancel} hasDataBeenModified={hasDataBeenModified} isSubmitting={isSubmitting}/>
    </>);
}
