import { Fragment, useCallback, useEffect, useRef } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import { PageView } from '@dashlane/hermes';
import { AlertSeverity, Button, Eyebrow, FlexContainer, Heading, InfoBox, jsx, Paragraph, PasswordInput, } from '@dashlane/ui-components';
import { BaseDataModelObject, ParsedData, PreviewPersonalDataErrorType, PreviewPersonalDataResult, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useImportPreviewContext } from 'webapp/import-data/hooks/useImportPreviewContext';
import { ImportDataRoutes } from 'webapp/import-data/routes';
import { logPageView } from 'libs/logs/logEvent';
import { ImportDataStep } from '../hooks/types';
import { ImportDataDialogLoading } from '../dialogs/import-data-dialog-loading';
const I18N_KEYS = {
    BACK_BUTTON: '_common_action_back',
    SHOW_PW: '_common_password_show_label',
    HIDE_PW: '_common_password_hide_label',
    STEP_COUNT: 'webapp_account_security_settings_two_factor_authentication_stage_header',
    HEADER: 'webapp_account_import_dash_password_header',
    BODY: 'webapp_account_import_dash_password_description',
    NEXT_BUTTON: 'webapp_account_import_dash_password_button_next',
    PW_LABEL: 'webapp_account_import_dash_password_label',
    PW_PLACEHOLDER: 'webapp_account_import_dash_password_placeholder',
};
const I18N_ERROR_KEYS = {
    GENERIC_ERROR: '_common_generic_error',
    BAD_PASSWORD_ERROR: 'webapp_account_import_dash_password_error',
    BAD_PASSWORD_HEADER: 'webapp_account_import_dash_password_error_header_markup',
};
type ErrorKeyType = (typeof I18N_ERROR_KEYS)[keyof typeof I18N_ERROR_KEYS];
interface FormFields {
    dashPassword: string;
}
const DETAILED_ERROR_SUBMIT_THRESHOLD = 2;
export const SecureImport = () => {
    const { preview: { resetState, previewFile, state: previewState }, import: { startImport, state: importDataState }, importSource, } = useImportPreviewContext();
    const alert = useAlert();
    const { translate } = useTranslate();
    const history = useHistory();
    const hasRedirected = useRef(false);
    const showErrorAlert = useCallback(() => {
        alert.showAlert(translate(I18N_ERROR_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
    }, [alert, translate]);
    useEffect(() => {
        logPageView(PageView.ImportDashEnterDashPassword);
    }, []);
    const goBack = () => {
        resetState();
        history.push(ImportDataRoutes.ImportSelect);
    };
    const unlockDashFile = async (dashPassword: string): Promise<{
        success: true;
        data: ParsedData;
    } | {
        success: false;
        error: ErrorKeyType;
    }> => {
        const previewResponse: PreviewPersonalDataResult = await previewFile(importSource, dashPassword);
        if (previewResponse.success) {
            return {
                success: true,
                data: previewResponse.data.items
                    .map(({ baseDataModel }) => baseDataModel)
                    .filter((item): item is BaseDataModelObject => item.kwType !== undefined),
            };
        }
        const badPwError = !previewResponse.success &&
            previewResponse.error === PreviewPersonalDataErrorType.BadPassword;
        return {
            success: false,
            error: badPwError
                ? I18N_ERROR_KEYS.BAD_PASSWORD_ERROR
                : I18N_ERROR_KEYS.GENERIC_ERROR,
        };
    };
    const doImport = async (parsedData: ParsedData): Promise<{
        success: true;
    } | {
        success: false;
        error: ErrorKeyType;
    }> => {
        if (!previewState.format) {
            return {
                success: false,
                error: I18N_ERROR_KEYS.GENERIC_ERROR,
            };
        }
        const importResponse = await startImport({
            format: previewState.format,
            name: previewState.fileName,
            content: parsedData,
        }, importSource);
        if (!importResponse.success) {
            return {
                success: false,
                error: I18N_ERROR_KEYS.GENERIC_ERROR,
            };
        }
        return { success: true };
    };
    const onSubmit = async ({ dashPassword }: FormFields, { setErrors, setSubmitting }: FormikHelpers<FormFields>) => {
        setSubmitting(true);
        try {
            const unlockResult = await unlockDashFile(dashPassword);
            if (!unlockResult.success) {
                setErrors({
                    dashPassword: translate(unlockResult.error),
                });
                return;
            }
            const importResult = await doImport(unlockResult.data);
            if (!importResult.success) {
                setErrors({
                    dashPassword: translate(importResult.error ?? I18N_ERROR_KEYS.GENERIC_ERROR),
                });
            }
            else {
                hasRedirected.current = true;
            }
        }
        catch {
            setErrors({
                dashPassword: translate(I18N_ERROR_KEYS.GENERIC_ERROR),
            });
        }
        finally {
            if (!hasRedirected.current) {
                setSubmitting(false);
            }
        }
    };
    useEffect(() => {
        switch (importDataState.status) {
            case ImportDataStep.ERROR_GENERIC: {
                showErrorAlert();
                return;
            }
            case ImportDataStep.SUCCESS: {
                history.push(ImportDataRoutes.ImportSummary);
                return;
            }
        }
    }, [history, importDataState.status, showErrorAlert]);
    const initialFormValues = {
        dashPassword: '',
    };
    return (<>
      {importDataState.status === ImportDataStep.PROCESSING ? (<ImportDataDialogLoading showCloseIcon={false} isOpen={true}/>) : null}
      <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
        {({ handleSubmit, handleChange, values, errors, submitCount, isSubmitting, }: FormikProps<typeof initialFormValues>) => {
            return (<FlexContainer flexDirection="column" as="form" onSubmit={handleSubmit} gap="16px" noValidate>
              <Eyebrow size="small" color="ds.text.neutral.quiet">
                {translate(I18N_KEYS.STEP_COUNT, {
                    stageIndex: 2,
                    totalStages: 2,
                })}
              </Eyebrow>
              <Heading size="small" color="ds.text.neutral.catchy">
                {translate(I18N_KEYS.HEADER)}
              </Heading>
              <Paragraph size="medium" color="ds.text.neutral.quiet">
                {translate(I18N_KEYS.BODY)}
              </Paragraph>
              <PasswordInput disabled={isSubmitting} autoComplete="off" name="dashPassword" onChange={handleChange} value={values.dashPassword} label={translate(I18N_KEYS.PW_LABEL)} placeholder={translate(I18N_KEYS.PW_PLACEHOLDER)} hidePasswordTooltipText={translate(I18N_KEYS.HIDE_PW)} showPasswordTooltipText={translate(I18N_KEYS.SHOW_PW)} feedbackType={errors.dashPassword ? 'error' : undefined} feedbackText={errors.dashPassword}/>
              {submitCount >= DETAILED_ERROR_SUBMIT_THRESHOLD ? (<InfoBox title={translate.markup(I18N_ERROR_KEYS.BAD_PASSWORD_HEADER)}/>) : null}
              <FlexContainer sx={{ mt: '8px' }} gap="16px">
                <Button type="button" nature="secondary" onClick={goBack}>
                  {translate(I18N_KEYS.BACK_BUTTON)}
                </Button>
                <Button type="submit" disabled={!values.dashPassword || isSubmitting}>
                  {translate(I18N_KEYS.NEXT_BUTTON)}
                </Button>
              </FlexContainer>
              
            </FlexContainer>);
        }}
      </Formik>
    </>);
};
