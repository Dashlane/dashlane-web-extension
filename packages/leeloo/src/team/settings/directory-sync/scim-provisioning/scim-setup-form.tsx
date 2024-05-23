import { Button, IndeterminateLoader, Infobox, jsx, Paragraph, Toggle, } from '@dashlane/design-system';
import { Card, CardContent, CardFooter, CardHeader, FlexContainer, GridChild, GridContainer, } from '@dashlane/ui-components';
import { ChangeEvent, useEffect, useState } from 'react';
import { BasicConfig, EncryptionServiceRestartStatusCodes, TeamDeviceEncryptedConfigNotFound, UpdateTeamDeviceEncryptedConfigRequest, } from '@dashlane/communication';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps, } from 'formik';
import useTranslate from 'libs/i18n/useTranslate';
import { v4 as uuid } from 'uuid';
import { appendToUrl } from 'libs/url-utils';
import { InputWithCopyButton } from 'libs/dashlane-style/text-input-with-action-button/input-with-copy-button';
import { CatchUnsavedChanges } from 'libs/dashlane-style/catch-unsaved-changes/CatchUnsavedChanges';
import { useHistory } from 'libs/router';
import { useTeamDeviceConfig } from 'team/settings/hooks/useTeamDeviceConfig';
import { RestartEncryptionServiceInfobox } from 'team/settings/encryption-service/restart-es-infobox';
import { ConfirmDialog } from 'team/settings/confirm-dialog';
const I18N_KEYS = {
    BUTTON_CANCEL: 'team_settings_directory_sync_scim_set_up_button_cancel',
    BUTTON_SAVE_CHANGES: 'team_settings_directory_sync_scim_set_up_button_save_changes',
    SCIM_TOKEN_LABEL: 'team_settings_directory_sync_scim_set_up_token_label',
    SCIM_TOKEN_DESC: 'team_settings_directory_sync_scim_set_up_token_description',
    SCIM_TOKEN_GENERATE_BUTTON: 'team_settings_directory_sync_scim_set_up_generate_buttons',
    SCIM_TOKEN_RESET_BUTTON: 'team_settings_directory_sync_scim_set_up_reset_buttons',
    SCIM_ENDPOINT_LABEL: 'team_settings_directory_sync_scim_set_up_endpoint_label',
    SCIM_ENCRYPTION_SERVICE_LABEL: 'team_settings_directory_sync_scim_set_up_service_label',
    SCIM_ENCRYPTION_SERVICE_DESC: 'team_settings_directory_sync_scim_set_up_service_description',
    SCIM_ES_INFOBOX: 'team_settings_directory_sync_scim_infobox',
    SCIM_HEADER: 'team_settings_directory_sync_scim_header',
    SCIM_CONFIRMATION_DIALOG_TITLE: 'team_settings_directory_sync_scim_confirm_dialog_title',
    SCIM_CONFIRMATION_DIALOG_PRIMARY_ACTION_LABEL: 'team_settings_directory_sync_scim_confirm_dialog_primary_action_label',
    SCIM_CONFIRMATION_DIALOG_BODY: 'team_settings_directory_sync_scim_confirm_dialog_body',
};
const I18N_ERROR_KEYS = {
    GENERIC_ERROR: '_common_generic_error',
};
interface FormFields {
    scimToken: string;
    scimEndpoint: string;
    encryptionServiceSync: boolean;
}
type FormFieldProps<T> = FieldProps<T, FormFields>;
interface ScimSetupFormProps {
    config: BasicConfig | undefined;
    esEndpoint: string | null | undefined;
}
export const ScimSetupForm = ({ config, esEndpoint }: ScimSetupFormProps) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { teamDeviceConfigLoading, teamDeviceConfig, updateTeamDeviceConfig, refreshTeamDeviceConfig, loadTeamDeviceConfigErrorCode, } = useTeamDeviceConfig({
        draft: false,
        deviceAccessKey: config?.deviceAccessKey,
    });
    const [errorCode, setErrorCodeCode] = useState('');
    const [restartEsFailed, setRestartEsFailed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tokenReset, setTokenReset] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const dataLoading = teamDeviceConfigLoading;
    useEffect(() => {
        const loadErrorCode = loadTeamDeviceConfigErrorCode;
        if (loadErrorCode && loadErrorCode !== TeamDeviceEncryptedConfigNotFound) {
            setErrorCodeCode(loadErrorCode);
        }
    }, [loadTeamDeviceConfigErrorCode, translate]);
    const obfuscateSCIMToken = (token?: string) => {
        return token?.replace(/./g, '*') ?? '';
    };
    const onScimEnabledChange = (event: ChangeEvent<HTMLInputElement>, setFieldValue: FormikHelpers<FormFields>['setFieldValue']) => {
        const isChecked = event.currentTarget.checked;
        setFieldValue('encryptionServiceSync', isChecked);
    };
    const reRouteBackToRoot = () => history.goBack();
    const updateScimConfig = async ({ values, resetForm, }: Pick<FormikHelpers<FormFields>, 'resetForm'> & {
        values: FormFields;
    }) => {
        setIsSaving(true);
        setRestartEsFailed(false);
        const updateRequest: UpdateTeamDeviceEncryptedConfigRequest = {
            scimEnabled: values.encryptionServiceSync,
            teamDeviceUrl: esEndpoint ?? undefined,
        };
        if (tokenReset || !teamDeviceConfig?.configProperties?.scimAuthToken) {
            updateRequest.scimAuthToken = values.scimToken;
        }
        const updateResponse = await updateTeamDeviceConfig(updateRequest);
        setTokenReset(false);
        await refreshTeamDeviceConfig();
        setIsSaving(false);
        if (!updateResponse.success) {
            setErrorCodeCode(updateResponse.error.code);
            return;
        }
        else if (updateResponse.data.encryptionServiceReloadingStatus !==
            EncryptionServiceRestartStatusCodes.OK) {
            setRestartEsFailed(true);
            return;
        }
        else {
            resetForm({ values });
            reRouteBackToRoot();
        }
    };
    const handleOnSubmit = async (values: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
        if (values.encryptionServiceSync) {
            setShowConfirmDialog(true);
        }
        else {
            await updateScimConfig({ values, resetForm: formikHelpers.resetForm });
        }
    };
    const handleGenerateToken = (setFieldValue: FormikHelpers<FormFields>['setFieldValue']) => {
        setTokenReset(true);
        setFieldValue('scimToken', uuid());
    };
    const initialValues = {
        scimToken: obfuscateSCIMToken(teamDeviceConfig?.configProperties?.scimAuthToken),
        scimEndpoint: esEndpoint ? appendToUrl(esEndpoint, 'scim/2.0') : '',
        encryptionServiceSync: teamDeviceConfig?.configProperties?.scimEnabled ?? false,
    };
    const onCancel = () => {
        setShowConfirmDialog(false);
    };
    const onConfirm = async ({ values, resetForm, }: Pick<FormikHelpers<FormFields>, 'resetForm'> & {
        values: FormFields;
    }) => {
        await updateScimConfig({ values, resetForm });
        setShowConfirmDialog(false);
    };
    return (<Formik onSubmit={handleOnSubmit} enableReinitialize initialValues={initialValues}>
      {({ values, setFieldValue, isSubmitting, dirty, resetForm, }: FormikProps<typeof initialValues>) => {
            return (<Form autoComplete="off" noValidate>
            <CatchUnsavedChanges dirty={dirty && !isSaving && !restartEsFailed}/>
            <Card>
              <CardHeader>{translate(I18N_KEYS.SCIM_HEADER)}</CardHeader>
              <CardContent>
                <Infobox mood="brand" title={translate(I18N_KEYS.SCIM_ES_INFOBOX)}/>
                <GridContainer gridTemplateAreas="'header button' 'desc button' 'inputField inputField'" gap="8px" sx={{
                    mt: '32px',
                }}>
                  <GridChild gridArea="header" as={Paragraph} innerAs="label" htmlFor="scimTokenInput" textStyle="ds.title.block.medium">
                    {translate(I18N_KEYS.SCIM_TOKEN_LABEL)}
                  </GridChild>
                  <GridChild as={Button} gridArea="button" type="button" alignSelf="right" intensity="quiet" mood="brand" disabled={dataLoading || isSubmitting} onClick={() => handleGenerateToken(setFieldValue)} sx={{
                    height: 'fit-content',
                    width: '100%',
                }}>
                    {values.scimToken
                    ? translate(I18N_KEYS.SCIM_TOKEN_RESET_BUTTON)
                    : translate(I18N_KEYS.SCIM_TOKEN_GENERATE_BUTTON)}
                  </GridChild>
                  <GridChild gridArea="desc" as={Paragraph} size="medium" sx={{ marginBottom: '24px' }} color="ds.text.neutral.quiet">
                    {translate(I18N_KEYS.SCIM_TOKEN_DESC)}
                  </GridChild>
                  <GridChild gridArea="inputField">
                    <Field name="scimToken">
                      {({ field }: FormFieldProps<FormFields['scimToken']>) => field.value ? (<InputWithCopyButton inputValue={field.value} iconButtonProps={{
                        disabled: (Boolean(values.scimToken) && !tokenReset) ||
                            isSubmitting,
                    }} passwordInputProps={{
                        disabled: (Boolean(values.scimToken) && !tokenReset) ||
                            isSubmitting,
                        fullWidth: true,
                        readOnly: true,
                        ...field,
                        id: 'scimTokenInput',
                    }}/>) : null}
                    </Field>
                  </GridChild>
                </GridContainer>
                <GridContainer gridTemplateColumns="auto" gap="8px">
                  <GridChild as={Paragraph} innerAs="label" htmlFor="endpointInput" sx={{ marginTop: '32px' }} textStyle="ds.title.block.medium">
                    {translate(I18N_KEYS.SCIM_ENDPOINT_LABEL)}
                  </GridChild>
                  <Field name="scimEndpoint">
                    {({ field, }: FormFieldProps<FormFields['scimEndpoint']>) => (<InputWithCopyButton inputValue={field.value} textInputProps={{
                        fullWidth: true,
                        readOnly: true,
                        ...field,
                        id: 'endpointInput',
                    }}/>)}
                  </Field>
                </GridContainer>
                <hr />
                <GridContainer gridTemplateAreas="'label toggle' 'desc .'" gap="8px">
                  <GridChild gridArea="label" as={Paragraph} innerAs="label" htmlFor="encryptionServiceSync" textStyle="ds.title.block.medium">
                    {translate(I18N_KEYS.SCIM_ENCRYPTION_SERVICE_LABEL)}
                  </GridChild>
                  <GridChild gridArea="desc" as={Paragraph} color="ds.text.neutral.quiet">
                    {translate(I18N_KEYS.SCIM_ENCRYPTION_SERVICE_DESC)}
                  </GridChild>
                  <GridChild gridArea="toggle">
                    {teamDeviceConfigLoading ? (<IndeterminateLoader mood="brand"/>) : (<Toggle disabled={dataLoading || isSubmitting} id="encryptionServiceSync" onChange={(e) => onScimEnabledChange(e, setFieldValue)} defaultChecked={teamDeviceConfig?.configProperties?.scimEnabled ??
                        false}/>)}
                  </GridChild>
                </GridContainer>
              </CardContent>
              <CardFooter>
                {errorCode ? (<Paragraph sx={{ width: '40%', ml: 0, mr: 'auto' }} textStyle="ds.title.supporting.small">
                    {translate(I18N_ERROR_KEYS?.[errorCode] ??
                        I18N_ERROR_KEYS.GENERIC_ERROR)}
                  </Paragraph>) : null}
                {restartEsFailed ? (<FlexContainer sx={{ flexGrow: 1, justifyContent: 'center' }}>
                    <RestartEncryptionServiceInfobox context="SCIM"/>
                  </FlexContainer>) : null}
                <Button mood="neutral" intensity="quiet" size="large" type="button" onClick={reRouteBackToRoot}>
                  {translate(I18N_KEYS.BUTTON_CANCEL)}
                </Button>
                <Button type="submit" disabled={dataLoading || isSubmitting || !dirty}>
                  {translate(I18N_KEYS.BUTTON_SAVE_CHANGES)}
                </Button>
              </CardFooter>
            </Card>
            {showConfirmDialog ? (<ConfirmDialog title={translate(I18N_KEYS.SCIM_CONFIRMATION_DIALOG_TITLE)} body={translate(I18N_KEYS.SCIM_CONFIRMATION_DIALOG_BODY)} primaryActionLabel={translate(I18N_KEYS.SCIM_CONFIRMATION_DIALOG_PRIMARY_ACTION_LABEL)} onCancel={onCancel} onConfirm={() => onConfirm({ values, resetForm })}/>) : null}
          </Form>);
        }}
    </Formik>);
};
