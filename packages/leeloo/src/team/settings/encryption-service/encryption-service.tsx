import { Fragment, useState } from 'react';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps, } from 'formik';
import { Button, jsx, Paragraph } from '@dashlane/design-system';
import { Card, CardContent, CardFooter, CardHeader, GridChild, GridContainer, Select, TextInput, } from '@dashlane/ui-components';
import { BasicConfig, EncryptionServiceDeploymentLocation, EncryptionServiceRestartStatusCodes, GenerateAndSaveEncryptionServiceConfigRequest, TeamSettings, } from '@dashlane/communication';
import { useModuleCommands } from '@dashlane/framework-react';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { EncryptionServicePlatformSelected, SsoSetupStep, } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { CatchUnsavedChanges } from 'libs/dashlane-style/catch-unsaved-changes/CatchUnsavedChanges';
import { useHistory } from 'libs/router';
import { openUrl } from 'libs/external-urls';
import { logSelfHostedSSOSetupStep } from 'team/settings/sso-setup-logs';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { BasicConfigField } from './basic-config-field';
import { RestartEncryptionServiceInfobox } from './restart-es-infobox';
const I18N_KEYS = {
    BUTTON_CLOSE: 'team_settings_encryption_service_button_cancel',
    BUTTON_SAVE_CHANGES: 'team_settings_encryption_service_button_save_changes',
    HEADER: 'team_settings_encryption_service_header',
    DEPLOY_ES_LABEL: 'team_settings_encryption_service_deploy_label',
    DEPLOY_ES_LABEL_HELPER: 'team_settings_encryption_service_deploy_label_helper_markup',
    GO_TO_ES_LABEL: 'team_settings_encryption_service_go_to_label',
    GO_TO_ES_LABEL_HELPER: 'team_settings_encryption_service_go_to_label_helper',
    GO_TO_ES_LABEL_HELPER_AWS: 'team_settings_encryption_service_go_to_label_helper_aws_markup',
    GO_TO_ES_LABEL_HELPER_AZURE: 'team_settings_encryption_service_go_to_label_helper_azure_markup',
    GO_TO_ES_BUTTON: 'team_settings_encryption_service_go_to_button',
    ENTER_ENDPOINT_LABEL: 'team_settings_encryption_service_enter_endpoint_label',
    ENTER_ENDPOINT_LABEL_HELPER_DEFAULT: 'team_settings_encryption_service_enter_endpoint_label_helper_no_selection',
    ENTER_ENDPOINT_LABEL_HELPER_AWS: 'team_settings_encryption_service_enter_endpoint_helper_aws_linux',
    ENTER_ENDPOINT_LABEL_HELPER_AZURE: 'team_settings_encryption_service_enter_endpoint_helper_azure',
    SELECT_HOST: 'team_settings_encryption_service_select_host',
    AWS_PLACEHOLDER: 'team_settings_encryption_service_enter_endpoint_placeholder_aws_linux',
    AZURE_PLACEHOLDER: 'team_settings_encryption_service_enter_endpoint_placeholder_azure',
    MIGRATE_SSO_TITLE: 'team_settings_encryption_service_migrate_sso_title',
    MIGRATE_SSO_DESCRIPTION: 'team_settings_encryption_service_migrate_sso_description_markup',
    CURRENT_ENDPOINT_LABEL: 'team_settings_encryption_service_current_endpoint_label',
    SSO_CONNECTOR_KEY_PLACEHOLDER: 'team_settings_encryption_service_sso_connector_key_placeholder',
};
const I18N_ERRORS = {
    GENERIC_ERROR: '_common_generic_error',
    CONFIG_REGEN_WARNING: 'team_settings_encryption_service_config_regen_warning',
    ERROR_SELECT_SERVICE: 'team_settings_encryption_service_error_select_service',
    ERROR_INVALID_ENCRYPTION_SERVICE_ENDPOINT: 'team_settings_encryption_service_error_invalid_endpoint',
    ERROR_INVALID_SSO_CONNECTOR_KEY: 'team_settings_encryption_service_error_invalid_ssoConnectorKey',
};
const ENDPOINT_PROTOCOL_PREFIX = '*****';
const serviceHostUrls: {
    [K in EncryptionServiceDeploymentLocation]: string;
} = {
    AWS: '*****',
    'Microsoft Azure': '*****',
};
const serviceHostSetupGuideUrls: {
    [K in EncryptionServiceDeploymentLocation]: string;
} = {
    AWS: '*****',
    'Microsoft Azure': '*****',
};
const goToServiceHostHelperMap: {
    [K in EncryptionServiceDeploymentLocation]: string;
} = {
    AWS: I18N_KEYS.GO_TO_ES_LABEL_HELPER_AWS,
    'Microsoft Azure': I18N_KEYS.GO_TO_ES_LABEL_HELPER_AZURE,
};
const endpointLabelMap: {
    [K in EncryptionServiceDeploymentLocation]: string;
} = {
    AWS: I18N_KEYS.ENTER_ENDPOINT_LABEL_HELPER_AWS,
    'Microsoft Azure': I18N_KEYS.ENTER_ENDPOINT_LABEL_HELPER_AZURE,
};
const endpointPlaceholderMap = {
    'Microsoft Azure': I18N_KEYS.AZURE_PLACEHOLDER,
    AWS: I18N_KEYS.AWS_PLACEHOLDER,
};
type DeploymentLocationOptions = EncryptionServiceDeploymentLocation | '';
type FormFields = {
    deploymentLocation: DeploymentLocationOptions;
    encryptionServiceEndpoint: string;
    config: string;
    ssoConnectorKey: string;
};
type FormFieldProps<T> = FieldProps<T, FormFields>;
const FIELDS: {
    [K: string]: keyof FormFields;
} = {
    CONFIG: 'config',
    DEPLOYMENT_LOCATION: 'deploymentLocation',
    ENCRYPTION_SERVICE_ENDPOINT: 'encryptionServiceEndpoint',
    SSO_CONNECTOR_KEY: 'ssoConnectorKey',
};
interface EncryptionServiceProps {
    migratingFromSSOConnector: boolean;
    esConfig: BasicConfig | undefined;
    onSave?: () => void;
    teamSettings: TeamSettings | undefined;
    updateTeamSettings: (teamSettings: TeamSettings) => Promise<void>;
}
const AZURE_MAX_LENGTH = 42;
const AZURE_APPEND = '-sso.azurewebsites.net';
const AWS_PREFIX = 'dashlane-sso.';
export const inferESEndpoint = (emailAddress: string, deploymentLocation: string): string => {
    if (!emailAddress || !deploymentLocation) {
        return '';
    }
    const emailDomain = emailAddress.replace(/.+@/, '');
    if (deploymentLocation === 'Microsoft Azure') {
        const [ignoredTld, domain, ...ignoredSubdomains] = emailDomain
            .split('.')
            .reverse();
        const lengthSafe = domain + AZURE_APPEND;
        if (lengthSafe.length <= AZURE_MAX_LENGTH) {
            return lengthSafe;
        }
        return (domain.slice(0, AZURE_MAX_LENGTH - AZURE_APPEND.length) + AZURE_APPEND);
    }
    if (deploymentLocation === 'AWS') {
        return AWS_PREFIX + emailDomain;
    }
    return '';
};
export const EncryptionService = ({ migratingFromSSOConnector = false, esConfig, onSave, teamSettings, updateTeamSettings, }: EncryptionServiceProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [configRegenRequired, setConfigRegenRequired] = useState(false);
    const [restartEsFailed, setRestartEsFailed] = useState(false);
    const { translate } = useTranslate();
    const { spaceDetails, teamId } = useTeamSpaceContext();
    const { initSsoProvisioning } = useModuleCommands(confidentialSSOApi);
    const associatedEmail = spaceDetails?.associatedEmail ?? '';
    const history = useHistory();
    const esEndpoint = teamSettings?.ssoServiceProviderUrl;
    const getGotoServiceHostHelperText = (serviceHost: DeploymentLocationOptions) => {
        if (!serviceHost) {
            serviceHost = 'AWS';
        }
        return translate.markup(goToServiceHostHelperMap[serviceHost], {
            setupGuide: serviceHostSetupGuideUrls[serviceHost],
        }, { linkTarget: '_blank' });
    };
    const initialFormValues: FormFields = {
        encryptionServiceEndpoint: (esEndpoint ?? '').replace(ENDPOINT_PROTOCOL_PREFIX, ''),
        config: esConfig?.config ?? '',
        deploymentLocation: esConfig?.deploymentLocation ?? '',
        ssoConnectorKey: '',
    };
    const reRouteBackToRoot = () => history.goBack();
    const validateDeploymentLocation = (value: FormFields['deploymentLocation']) => (value ? null : translate(I18N_ERRORS.ERROR_SELECT_SERVICE));
    const validateSSOConnectorKey = (value: FormFields['ssoConnectorKey']) => {
        const errorMessage = translate(I18N_ERRORS.ERROR_INVALID_SSO_CONNECTOR_KEY);
        const DECODED_CONNECTOR_KEY_LENGTH = 64;
        const CONNECTOR_KEY_UUID_LENGTH = 36;
        try {
            const [uuid, encodedKey] = value.split('|');
            const decodedKey = atob(encodedKey);
            if (!uuid ||
                !encodedKey ||
                !decodedKey ||
                uuid.length !== CONNECTOR_KEY_UUID_LENGTH ||
                decodedKey.length !== DECODED_CONNECTOR_KEY_LENGTH) {
                throw new Error('Invalid key format');
            }
        }
        catch {
            return errorMessage;
        }
        return null;
    };
    const validateEncryptionServiceEndpoint = (value: FormFields['encryptionServiceEndpoint']): null | string => {
        const errorMessage = translate(I18N_ERRORS.ERROR_INVALID_ENCRYPTION_SERVICE_ENDPOINT);
        if (!value) {
            return errorMessage;
        }
        let url: URL;
        try {
            url = new URL(`${ENDPOINT_PROTOCOL_PREFIX}${value}`);
        }
        catch (_error) {
            return errorMessage;
        }
        if (url.pathname !== '/' ||
            url.search !== '' ||
            url.hash !== '' ||
            url.href.includes('?')) {
            return errorMessage;
        }
        return null;
    };
    const handleOnSaveAndGenerateConfig = async (fieldValues: FormFields, { setFieldValue, setFieldTouched }: FormikHelpers<FormFields>) => {
        setFormError('');
        setIsSaving(true);
        setRestartEsFailed(false);
        const { deploymentLocation, encryptionServiceEndpoint, ssoConnectorKey } = fieldValues;
        if (!deploymentLocation) {
            setFieldTouched(FIELDS.DEPLOYMENT_LOCATION);
            return;
        }
        if (migratingFromSSOConnector && !ssoConnectorKey) {
            setFieldTouched(FIELDS.SSO_CONNECTOR_KEY);
            return;
        }
        setFieldValue(FIELDS.CONFIG, '');
        const formatUrl = (url: string) => url.replace(/\/$/, '').toLowerCase();
        try {
            const createConfigRequest: GenerateAndSaveEncryptionServiceConfigRequest = {
                deploymentLocation,
                encryptionServiceEndpoint: ENDPOINT_PROTOCOL_PREFIX + formatUrl(encryptionServiceEndpoint),
                updateTeamDeviceConfigParams: {},
            };
            if (migratingFromSSOConnector && ssoConnectorKey) {
                createConfigRequest.updateTeamDeviceConfigParams.ssoConnectorKey =
                    ssoConnectorKey;
            }
            const createConfigResponse = await carbonConnector.generateAndSaveEncryptionServiceConfig(createConfigRequest);
            if (!createConfigResponse.success) {
                setFormError(translate(I18N_ERRORS.GENERIC_ERROR));
                return;
            }
            const newBasicConfig = createConfigResponse.data.basicConfig;
            setFieldValue(FIELDS.CONFIG, newBasicConfig.config);
            if (fieldValues[FIELDS.ENCRYPTION_SERVICE_ENDPOINT] !==
                initialFormValues.encryptionServiceEndpoint) {
                await updateTeamSettings({
                    ssoServiceProviderUrl: fieldValues[FIELDS.ENCRYPTION_SERVICE_ENDPOINT]
                        ? `${ENDPOINT_PROTOCOL_PREFIX}` +
                            formatUrl(`${fieldValues[FIELDS.ENCRYPTION_SERVICE_ENDPOINT]}`)
                        : null,
                });
                await initSsoProvisioning({ teamId: `${teamId}` });
            }
            setIsSaving(false);
            if (createConfigResponse.data.encryptionServiceReloadingStatus !==
                EncryptionServiceRestartStatusCodes.OK) {
                setRestartEsFailed(true);
                setConfigRegenRequired(false);
                onSave?.();
                return;
            }
            logSelfHostedSSOSetupStep({
                ssoSetupStep: SsoSetupStep.GenerateAndSaveConfiguration,
            });
            if (!formError) {
                onSave?.();
            }
        }
        catch (e) {
            setIsSaving(false);
            setFormError(translate(I18N_ERRORS.GENERIC_ERROR));
        }
    };
    return (<Formik onSubmit={handleOnSaveAndGenerateConfig} initialValues={initialFormValues} onReset={reRouteBackToRoot}>
      {(formikProps: FormikProps<FormFields>) => {
            return (<Form autoComplete="off">
            <CatchUnsavedChanges dirty={formikProps.dirty && !isSaving && !restartEsFailed}/>
            <Card>
              <CardHeader>{translate(I18N_KEYS.HEADER)}</CardHeader>
              <CardContent>
                {migratingFromSSOConnector ? (<>
                    <GridContainer gridTemplateAreas="'header header' 'description description' 'input button'" gridTemplateColumns="1fr auto" gap="10px">
                      <GridChild gridArea="header">
                        <Paragraph as="h3" textStyle="ds.title.block.medium">
                          {translate(I18N_KEYS.MIGRATE_SSO_TITLE)}
                        </Paragraph>
                      </GridChild>
                      <GridChild gridArea="description">
                        <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
                          {translate.markup(I18N_KEYS.MIGRATE_SSO_DESCRIPTION)}
                        </Paragraph>
                      </GridChild>
                      <GridChild gridArea="input">
                        <Field name={FIELDS.SSO_CONNECTOR_KEY} validate={validateSSOConnectorKey}>
                          {({ field: { onChange, ...restField }, meta: { error, touched }, }: FormFieldProps<FormFields['ssoConnectorKey']>) => {
                        return (<TextInput onChange={(v) => {
                                onChange(v);
                            }} id="ssoConnectorKey" placeholder={translate(I18N_KEYS.SSO_CONNECTOR_KEY_PLACEHOLDER)} fullWidth feedbackText={touched && error ? error : undefined} feedbackType={touched && error ? 'error' : undefined} aria-invalid={touched && !!error} readOnly={formikProps.isSubmitting} {...restField}/>);
                    }}
                        </Field>
                      </GridChild>
                    </GridContainer>
                    <hr />
                  </>) : null}
                <GridContainer gridTemplateAreas="'label select' 'desc select'" gap="8px">
                  <GridChild gridArea="label" as={Paragraph} innerAs="label" htmlFor="deploymentLocation" sx={{ gridArea: 'label' }} textStyle="ds.title.block.medium">
                    {translate(I18N_KEYS.DEPLOY_ES_LABEL)}
                  </GridChild>
                  <GridChild gridArea="desc" as={Paragraph}>
                    {translate.markup(I18N_KEYS.DEPLOY_ES_LABEL_HELPER, {
                    customerSupport: '*****',
                }, {
                    linkTarget: '_blank',
                })}
                  </GridChild>
                  <GridChild gridArea="select">
                    <Field name={FIELDS.DEPLOYMENT_LOCATION} validate={validateDeploymentLocation}>
                      {({ field: { onChange, ...restField }, meta: { error, touched }, }: FormFieldProps<FormFields['deploymentLocation']>) => (<Select onChange={(v) => {
                        formikProps.setFieldValue(FIELDS.ENCRYPTION_SERVICE_ENDPOINT, inferESEndpoint(associatedEmail, v.target.value));
                        setConfigRegenRequired(initialFormValues.deploymentLocation !==
                            v.target.value);
                        logSelfHostedSSOSetupStep({
                            ssoSetupStep: SsoSetupStep.SelectEncryptionServicePlatform,
                            encryptionServicePlatformSelected: v.target.value === 'AWS'
                                ? EncryptionServicePlatformSelected.AmazonWebServices
                                : EncryptionServicePlatformSelected.Azure,
                        });
                        onChange(v);
                    }} feedbackId="deploymentLocationFeedback" selectId="deploymentLocation" options={Object.keys(endpointLabelMap)} placeholder={translate(I18N_KEYS.SELECT_HOST)} intent={touched && error ? 'error' : undefined} feedbackText={touched && error ? error : undefined} readOnly={formikProps.isSubmitting} {...restField}/>)}
                    </Field>
                  </GridChild>
                </GridContainer>
                <hr />
                <GridContainer gridTemplateColumns="auto" gap="8px">
                  <GridChild as={Paragraph} innerAs="label" htmlFor="endpointInput" textStyle="ds.title.block.medium">
                    {translate(I18N_KEYS.ENTER_ENDPOINT_LABEL)}
                  </GridChild>
                  <GridChild as={Paragraph} sx={{
                    mb: '16px',
                }}>
                    {translate(endpointLabelMap[formikProps.values[FIELDS.DEPLOYMENT_LOCATION]] ?? I18N_KEYS.ENTER_ENDPOINT_LABEL_HELPER_DEFAULT)}
                  </GridChild>
                  {migratingFromSSOConnector ? (<Paragraph>
                      {translate(I18N_KEYS.CURRENT_ENDPOINT_LABEL)} {esEndpoint}
                    </Paragraph>) : null}
                  <Field name={FIELDS.ENCRYPTION_SERVICE_ENDPOINT} validate={validateEncryptionServiceEndpoint}>
                    {({ field: { onChange, ...restField }, meta: { error, touched }, form: { values: { deploymentLocation }, }, }: FormFieldProps<FormFields['encryptionServiceEndpoint']>) => {
                    return (<TextInput sx={{ pl: 0 }} onChange={(v) => {
                            setConfigRegenRequired(initialFormValues.encryptionServiceEndpoint !==
                                v.target.value);
                            onChange(v);
                        }} startAdornment={<Paragraph color="ds.text.neutral.quiet">
                              {ENDPOINT_PROTOCOL_PREFIX}
                            </Paragraph>} id="endpointInput" placeholder={translate(endpointPlaceholderMap[deploymentLocation] ??
                            I18N_KEYS.AWS_PLACEHOLDER)} fullWidth feedbackText={touched && error ? error : undefined} feedbackType={touched && error ? 'error' : undefined} aria-invalid={touched && !!error} readOnly={formikProps.isSubmitting} {...restField}/>);
                }}
                  </Field>
                </GridContainer>
                <hr />
                {restartEsFailed ? (<RestartEncryptionServiceInfobox sx={{ marginBottom: '20px' }} context="ES"/>) : null}
                <Field name={FIELDS.CONFIG}>
                  {({ field, meta, form: { values: { deploymentLocation, ssoConnectorKey }, }, }: FormFieldProps<FormFields['config']>) => (<BasicConfigField configRegenRequired={configRegenRequired} disabled={!deploymentLocation ||
                        (migratingFromSSOConnector && !ssoConnectorKey)} lastGeneratedTimeStamp={esConfig?.lastGeneratedTimeStamp} value={field.value} error={meta.error ??
                        (!formikProps.isSubmitting && configRegenRequired)
                        ? translate(I18N_ERRORS.CONFIG_REGEN_WARNING)
                        : undefined} isLoading={isSaving || formikProps.isSubmitting}/>)}
                </Field>
                <hr />
                <GridContainer gridTemplateAreas="'header button' 'description button'" gap="8px">
                  <GridChild gridArea="header" as={Paragraph} textStyle="ds.title.block.medium">
                    {translate(I18N_KEYS.GO_TO_ES_LABEL)}
                  </GridChild>
                  <GridChild gridArea="description" as={Paragraph} sx={{
                    mb: '16px',
                }}>
                    {getGotoServiceHostHelperText(formikProps.values.deploymentLocation)}
                  </GridChild>
                  <GridChild gridArea="button" as={Button} type="button" mood={formikProps.values.config && !configRegenRequired
                    ? 'brand'
                    : 'neutral'} disabled={!formikProps.values[FIELDS.DEPLOYMENT_LOCATION] ||
                    !formikProps.values[FIELDS.CONFIG] ||
                    configRegenRequired} onClick={() => {
                    logSelfHostedSSOSetupStep({
                        ssoSetupStep: SsoSetupStep.AddConfigurationToServiceHost,
                    });
                    openUrl(serviceHostUrls[formikProps.values[FIELDS.DEPLOYMENT_LOCATION]]);
                }} icon="ActionOpenExternalLinkOutlined" layout="iconTrailing" sx={{ gridArea: 'button', height: 'fit-content' }}>
                    {translate(I18N_KEYS.GO_TO_ES_BUTTON)}
                  </GridChild>
                </GridContainer>
              </CardContent>
              <CardFooter flexWrap="nowrap">
                {formError ? (<Paragraph sx={{ width: '40%', ml: 0, mr: 'auto' }} textStyle="ds.title.supporting.small" color="ds.text.danger.standard">
                    {formError}
                  </Paragraph>) : null}
                <Button mood="neutral" intensity="quiet" size="large" type="button" onClick={() => reRouteBackToRoot()}>
                  {translate(I18N_KEYS.BUTTON_CLOSE)}
                </Button>
              </CardFooter>
            </Card>
          </Form>);
        }}
    </Formik>);
};
