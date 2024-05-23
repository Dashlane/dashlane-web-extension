import { Button, Card, CardContent, CardFooter, CardHeader, colors, FlexContainer, GridContainer, jsx, LoadingIcon, Paragraph, TextInput, } from '@dashlane/ui-components';
import { Infobox } from '@dashlane/design-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Domain, EncryptionServiceRestartStatusCodes, } from '@dashlane/communication';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps, } from 'formik';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { DomainFields } from './domain/DomainFields';
import { IdpInputField } from './IdpInputField';
import { CatchUnsavedChanges } from 'libs/dashlane-style/catch-unsaved-changes/CatchUnsavedChanges';
import { useHistory } from 'libs/router';
import { RestartEncryptionServiceInfobox } from '../encryption-service/restart-es-infobox';
import { useTeamDeviceConfig } from '../hooks/useTeamDeviceConfig';
import { useTeamSettings } from '../hooks/useTeamSettings';
const { grey00 } = colors;
const I18N_KEYS = {
    HEADING: 'team_settings_es_sso_setup_header',
    COPY_INFO_TO_IDP: 'team_settings_es_sso_setup_copy_info_to_idp_markup',
    SAVE: 'team_settings_es_sso_setup_save',
    CANCEL: 'team_settings_es_sso_setup_cancel',
    ENTITY_ID_LABEL: 'team_settings_es_sso_entity_id_label',
    ACS_URL_LABEL: 'team_settings_es_sso_acs_url_label',
    GET_DOMAIN_ERROR: 'team_settings_domain_fetch_error',
    METADATA_LABEL: 'team_settings_es_sso_metadata_label',
    METADATA_DESCRIPTION: 'team_settings_es_sso_metadata_description',
};
const I18N_METADATA_ERROR_KEYS = {
    GENERIC_ERROR: '_common_generic_error',
};
const makeEntityId = (url: string | null) => (url ? `${url}/saml/` : '');
const makeAcsUrl = (url: string | null) => (url ? `${url}/saml/callback` : '');
export interface FormFields {
    domains: Domain[];
    ssoIdpMetadata: string;
}
export const FIELDS = {
    DOMAINS: 'domains',
    METADATA: 'ssoIdpMetadata',
};
type FormFieldProps<T> = FieldProps<T, FormFields>;
export const SsoSetupForm = () => {
    const { translate } = useTranslate();
    const { teamId } = useTeamSpaceContext();
    const { updateTeamDeviceConfig } = useTeamDeviceConfig();
    const [isSaving, setIsSaving] = useState(false);
    const [restartEsFailed, setRestartEsFailed] = useState(false);
    const [domains, setDomains] = useState<Domain[]>([]);
    const ssoMetadataRef = useRef<HTMLInputElement>(null);
    const [isDomainDataLoading, setIsDomainDataLoading] = useState<boolean>(false);
    const [domainLoadError, setDomainLoadError] = useState('');
    const { teamSettings = {}, teamSettingsLoading } = useTeamSettings(teamId);
    const { ssoIdpMetadata, ssoServiceProviderUrl = '' } = teamSettings;
    const history = useHistory();
    const loadDomains = useCallback(async () => {
        try {
            setDomainLoadError('');
            const result = await carbonConnector.getTeamDomains();
            if (result.success) {
                const loadedDomains = result.domains.length ? result.domains : [];
                setDomains([...loadedDomains, { name: '', id: 0 }]);
            }
            else {
                setDomainLoadError(translate(I18N_KEYS.GET_DOMAIN_ERROR));
            }
        }
        catch (e) {
            setDomainLoadError(e.message ?? translate(I18N_KEYS.GET_DOMAIN_ERROR));
        }
    }, [translate]);
    useEffect(() => {
        setIsDomainDataLoading(true);
        loadDomains().then(() => setIsDomainDataLoading(false));
    }, [loadDomains]);
    const initialValues: FormFields = {
        domains,
        ssoIdpMetadata: ssoIdpMetadata ?? ssoMetadataRef.current?.value ?? '',
    };
    const reRouteBackToRoot = () => history.goBack();
    const handleSubmit = async (formValues: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
        try {
            setIsSaving(true);
            setRestartEsFailed(false);
            const updateResponse = await updateTeamDeviceConfig({
                ssoEnabled: true,
                [FIELDS.METADATA]: formValues[FIELDS.METADATA],
                connectorEndpoint: ssoServiceProviderUrl
                    ? ssoServiceProviderUrl
                    : undefined,
                teamDeviceUrl: teamSettings.ssoServiceProviderUrl ?? undefined,
            });
            if (!updateResponse.success) {
                const upperCaseErrorCode = updateResponse.error.code.toUpperCase();
                if (upperCaseErrorCode === 'DEACTIVATED_TEAM_DEVICE') {
                    return;
                }
                const errorString = translate(I18N_METADATA_ERROR_KEYS[upperCaseErrorCode]
                    ? I18N_METADATA_ERROR_KEYS[upperCaseErrorCode]
                    : I18N_METADATA_ERROR_KEYS.GENERIC_ERROR);
                formikHelpers.setFieldError(FIELDS.METADATA, errorString);
                return;
            }
            else if (updateResponse.data.encryptionServiceReloadingStatus !==
                EncryptionServiceRestartStatusCodes.OK) {
                setRestartEsFailed(true);
                return;
            }
            reRouteBackToRoot();
        }
        catch (e) {
            formikHelpers.setFieldError(FIELDS.METADATA, translate(I18N_METADATA_ERROR_KEYS.GENERIC_ERROR));
        }
        finally {
            setIsSaving(false);
        }
    };
    if (teamSettingsLoading || isDomainDataLoading) {
        return (<Card>
        <CardHeader>{translate(I18N_KEYS.HEADING)}</CardHeader>
        <CardContent>
          <FlexContainer fullWidth justifyContent="center">
            <LoadingIcon size={60} color="primaries.5"/>
          </FlexContainer>
        </CardContent>
      </Card>);
    }
    return (<Formik<FormFields> onSubmit={handleSubmit} initialValues={initialValues} enableReinitialize>
      {({ isSubmitting, dirty }: FormikProps<FormFields>) => {
            return (<Form autoComplete="off" noValidate>
            <CatchUnsavedChanges dirty={dirty && !isSaving && !restartEsFailed}/>
            <Card>
              <CardHeader>{translate(I18N_KEYS.HEADING)}</CardHeader>
              <CardContent>
                <DomainFields fieldArrayName={FIELDS.DOMAINS} domainLoadError={domainLoadError} refreshDomains={loadDomains}/>
                <hr />
                <Infobox title={translate.markup(I18N_KEYS.COPY_INFO_TO_IDP)} sx={{ mb: '32px' }}/>
                <GridContainer justifyContent="stretch" gridTemplateColumns="auto" gap="32px" gridAutoRows="auto">
                  
                  <IdpInputField id="entity-id-input" inputValue={makeEntityId(ssoServiceProviderUrl)} labelText={translate(I18N_KEYS.ENTITY_ID_LABEL)} disabled={teamSettingsLoading || !ssoServiceProviderUrl} loading={teamSettingsLoading}/>
                  <IdpInputField id="acs-url-input" inputValue={makeAcsUrl(ssoServiceProviderUrl)} labelText={translate(I18N_KEYS.ACS_URL_LABEL)} disabled={teamSettingsLoading || !ssoServiceProviderUrl} loading={teamSettingsLoading}/>
                </GridContainer>
                <hr />
                <Paragraph as="label" bold htmlFor="sso-metadata-input">
                  {translate(I18N_KEYS.METADATA_LABEL)}
                </Paragraph>
                <Paragraph size="small" color={grey00} sx={{ mt: '8px', mb: '24px' }}>
                  {translate(I18N_KEYS.METADATA_DESCRIPTION)}
                </Paragraph>
                <Field name={FIELDS.METADATA}>
                  {({ field, meta: { error, touched }, }: FormFieldProps<FormFields['ssoIdpMetadata']>) => {
                    return (<TextInput id="sso-metadata-input" sx={{ height: '10em', resize: 'vertical' }} {...field} ref={ssoMetadataRef} multiline fullWidth feedbackText={touched && error ? error : undefined} feedbackType={touched && error ? 'error' : undefined}/>);
                }}
                </Field>
              </CardContent>
              <CardFooter>
                {restartEsFailed ? (<FlexContainer sx={{ flexGrow: 1, justifyContent: 'center' }}>
                    <RestartEncryptionServiceInfobox context="SSO"/>
                  </FlexContainer>) : null}
                <Button disabled={isSubmitting} nature="secondary" size="large" type="button" onClick={reRouteBackToRoot}>
                  {translate(I18N_KEYS.CANCEL)}
                </Button>
                <Button disabled={isSubmitting} nature="primary" type="submit" size="large">
                  {translate(I18N_KEYS.SAVE)}
                </Button>
              </CardFooter>
            </Card>
          </Form>);
        }}
    </Formik>);
};
