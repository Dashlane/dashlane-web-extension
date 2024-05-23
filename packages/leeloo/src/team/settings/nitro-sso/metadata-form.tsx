import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { Button, Heading, jsx, Paragraph, TextArea, } from '@dashlane/design-system';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { isFailure } from '@dashlane/framework-types';
import { IdpValidationResponse, SsoSetupStep } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { logNitroSSOSetupStep } from 'team/settings/sso-setup-logs';
import useTranslate from 'libs/i18n/useTranslate';
import { useCallback, useState } from 'react';
export interface FormFields {
    ssoIdpMetadata: string;
}
const I18N_KEYS = {
    SECTION_HEADING: 'sso_confidential_metadata_form_section_heading',
    BUTTON_SUBMIT: 'sso_confidential_metadata_form_button_submit',
    FIELD_LABEL: 'sso_confidential_metadata_form_field_label',
    FIELD_PLACEHOLDER: 'sso_confidential_metadata_form_field_placeholder',
    PARAGRAPH: 'sso_confidential_metadata_form_paragraph',
    ERROR_COULD_NOT_READ_METADATA: 'sso_confidential_metadata_form_error_could_not_read_metadata',
    ERROR_COULD_NOT_FIND_ENTRYPOINT: 'sso_confidential_metadata_form_error_could_not_find_entrypoint',
    ERROR_COULD_NOT_FIND_CERTIFICATE: 'sso_confidential_metadata_form_error_could_not_find_certificate',
    ERROR_COUND_NOT_VALIDATE_CERTIFICATE: 'sso_confidential_metadata_form_error_cound_not_validate_certificate',
    ERROR_NO_CERTIFICATE: 'sso_confidential_metadata_form_error_no_certificate',
    ERROR_MULTIPLE_CERTIFICATES: 'sso_confidential_metadata_form_error_multiple_certificates',
    ERROR_INVALID_ENTRYPOINT: 'sso_confidential_metadata_form_error_invalid_entrypoint',
    ERROR_INVALID_METADATA_CONTENT: 'sso_confidential_metadata_form_error_invalid_metadata_content',
    ERROR_INVALID_METADATA_URL: 'sso_confidential_metadata_form_error_invalid_metadata_url',
    ERROR_SERVER_ERROR: 'sso_confidential_metadata_form_error_server_error',
    ERROR_INTERNAL_ERROR: 'sso_confidential_metadata_form_error_internal_error',
};
const VALIDATION_ERROR_MAP = {
    XML_PARSE_FAILED: I18N_KEYS.ERROR_COULD_NOT_READ_METADATA,
    KEY_DESCRIPTOR_NOT_FOUND: I18N_KEYS.ERROR_COULD_NOT_FIND_ENTRYPOINT,
    IDP_ENTRYPOINT_NOT_FOUND: I18N_KEYS.ERROR_COULD_NOT_FIND_ENTRYPOINT,
    INVALID_IDP_SSO_DESCRIPTOR: I18N_KEYS.ERROR_COULD_NOT_FIND_ENTRYPOINT,
    MISSING_CERTIFICATE: I18N_KEYS.ERROR_NO_CERTIFICATE,
    MULTIPLE_CERTIFICATES: I18N_KEYS.ERROR_MULTIPLE_CERTIFICATES,
    INVALID_ENTRYPOINT: I18N_KEYS.ERROR_INVALID_ENTRYPOINT,
    CERTIFICATE_TOO_SHORT: I18N_KEYS.ERROR_COUND_NOT_VALIDATE_CERTIFICATE,
    CERTIFICATE_TOO_LONG: I18N_KEYS.ERROR_COUND_NOT_VALIDATE_CERTIFICATE,
    CERTIFICATE_DECODE_FAILED: I18N_KEYS.ERROR_COUND_NOT_VALIDATE_CERTIFICATE,
};
const UPDATE_ERROR_MAP = {
    INVALID_METADATA_CONTENT: I18N_KEYS.ERROR_INVALID_METADATA_CONTENT,
    INVALID_METADATA_URL: I18N_KEYS.ERROR_INVALID_METADATA_URL,
    DOMAIN_UPDATE_FAILED: I18N_KEYS.ERROR_SERVER_ERROR,
    SAVE_METADATA_FAILED: I18N_KEYS.ERROR_SERVER_ERROR,
    INTERNAL_ERROR: I18N_KEYS.ERROR_INTERNAL_ERROR,
};
const UNEXPECTED_SERVER_ERROR = 'Unexpected server error. Please try again or contact Customer Support.';
const FIELDS = {
    METADATA: 'ssoIdpMetadata',
};
type FormFieldProps<T> = FieldProps<T, FormFields>;
export const MetadataForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { translate } = useTranslate();
    const ssoProvisioningState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const { createTeam, validateMetadata, updateMetadata } = useModuleCommands(confidentialSSOApi);
    const dataLoading = ssoProvisioningState.status === DataStatus.Loading;
    const ssoMetadata = ssoProvisioningState.data?.idpMetadata.metadataValue ?? '';
    const initialValues: FormFields = {
        ssoIdpMetadata: ssoMetadata,
    };
    const inferredSsoState = ssoProvisioningState.data?.global
        .inferredSsoState as any;
    const blockingSsoStates: InferredSsoState[] = [
        InferredSsoState.enum.SelfHostedIncomplete,
        InferredSsoState.enum.SelfHostedComplete,
    ];
    const userHasStartedSelfHostedSetup = blockingSsoStates.includes(inferredSsoState);
    const handleSubmit = useCallback(async (values: FormFields, formikHelpers: FormikHelpers<FormFields>): Promise<void> => {
        try {
            setIsLoading(true);
            const isTeamAlreadyCreated = ssoProvisioningState.data?.global.isTeamProvisionedInNitro;
            if (!isTeamAlreadyCreated) {
                await createTeam();
                logNitroSSOSetupStep({
                    ssoSetupStep: SsoSetupStep.CreateSsoApplication,
                });
            }
            logNitroSSOSetupStep({
                ssoSetupStep: SsoSetupStep.UpdateIdpSettings,
            });
            const updateResponse = await updateMetadata({
                metadata: values.ssoIdpMetadata === '' ? null : values.ssoIdpMetadata,
            });
            setIsLoading(false);
            if (isFailure(updateResponse)) {
                const mappableErrorCode = updateResponse.error.tag.toUpperCase();
                return formikHelpers.setFieldError(FIELDS.METADATA, mappableErrorCode in UPDATE_ERROR_MAP
                    ? translate(UPDATE_ERROR_MAP[mappableErrorCode])
                    : translate(UNEXPECTED_SERVER_ERROR));
            }
        }
        catch (e) {
            return formikHelpers.setFieldError(FIELDS.METADATA, UNEXPECTED_SERVER_ERROR);
        }
    }, [
        createTeam,
        ssoProvisioningState.data?.global.isTeamProvisionedInNitro,
        translate,
        updateMetadata,
    ]);
    const mapValidationResponseForLogs = (response: Awaited<ReturnType<typeof validateMetadata>>): IdpValidationResponse => {
        if (isFailure(response)) {
            if ((Object.values(IdpValidationResponse) as string[]).includes(response.error.tag)) {
                return response.error.tag as unknown as IdpValidationResponse;
            }
            return IdpValidationResponse.XmlParseFailed;
        }
        return IdpValidationResponse.Success;
    };
    const doMetadataValidation = async (fieldValue: string): Promise<undefined | string> => {
        if (!fieldValue) {
            return undefined;
        }
        const parsedUrl = new ParsedURL(fieldValue);
        const isValidUrl = parsedUrl.isUrlValid();
        if (isValidUrl) {
            return undefined;
        }
        try {
            const validationResponse = await validateMetadata({
                metadata: fieldValue,
            });
            logNitroSSOSetupStep({
                ssoSetupStep: SsoSetupStep.ValidateIdpMetadata,
                idpValidationResponse: mapValidationResponseForLogs(validationResponse),
            });
            if (isFailure(validationResponse)) {
                const mappableErrorCode = validationResponse.error.tag.toUpperCase();
                return mappableErrorCode in VALIDATION_ERROR_MAP
                    ? translate(VALIDATION_ERROR_MAP[mappableErrorCode])
                    : translate(VALIDATION_ERROR_MAP.XML_PARSE_FAILED);
            }
        }
        catch (e) {
            return e instanceof Error ? e.message : 'Unknown error';
        }
        return undefined;
    };
    return (<Formik<FormFields> initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, isValid, isValidating, dirty }) => {
            const isDisabled = userHasStartedSelfHostedSetup || isSubmitting || dataLoading;
            const isSubmitDisabled = isDisabled || !isValid || isValidating || !dirty;
            return (<Form noValidate>
            <div sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto',
                    gridAutoRows: 'auto',
                    gap: '8px',
                }}>
              <Heading as="h2" textStyle="ds.title.section.medium" color="ds.text.neutral.standard">
                {translate(I18N_KEYS.SECTION_HEADING)}
              </Heading>
              <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard" sx={{ marginBottom: '24px' }}>
                {translate(I18N_KEYS.PARAGRAPH)}
              </Paragraph>
              
              <Field name={FIELDS.METADATA} validateOnChange validate={doMetadataValidation}>
                {({ field, meta: { error }, }: FormFieldProps<FormFields['ssoIdpMetadata']>) => (<TextArea required id={field.name} label={translate(I18N_KEYS.FIELD_LABEL)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER)} aria-label={translate(I18N_KEYS.FIELD_PLACEHOLDER)} autoCorrect="off" autoComplete="off" spellCheck="false" disabled={isDisabled} feedback={error && !isSubmitting && !isValidating
                        ? {
                            text: error,
                        }
                        : undefined} error={!!(error && !isSubmitting && !isValidating)} {...field}/>)}
              </Field>
              <Button type="submit" sx={{
                    mt: '12px',
                    justifySelf: 'end',
                }} mood={ssoMetadata ? 'neutral' : 'brand'} intensity={ssoMetadata ? 'quiet' : 'catchy'} disabled={isSubmitDisabled} isLoading={isLoading}>
                {translate(I18N_KEYS.BUTTON_SUBMIT)}
              </Button>
            </div>
          </Form>);
        }}
    </Formik>);
};
