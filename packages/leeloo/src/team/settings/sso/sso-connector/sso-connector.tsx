import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { removeDuplicateSlashesFromUrl } from 'libs/url-utils';
import { SSOSettingSectionProps, SSOSettingStep, } from 'team/settings/sso/types';
import { Installer } from 'team/settings/sso/sso-connector/installer';
import { ConnectorInfo } from 'team/settings/sso/sso-connector/connector-info';
import styles from './styles.css';
const I18N_KEYS = {
    PROVIDER_METADATA_TITLE: 'team_settings_connector_metadata_title',
    PROVIDER_METADATA_PLACEHOLDER: 'team_settings_connector_metadata_placeholder',
    PROVIDER_METADATA_ERROR: 'team_settings_connector_metadata_error',
    CONNECTOR_URL_TITLE: 'team_settings_connector_url_title',
    CONNECTOR_URL_DESCRIPTION: 'team_settings_connector_url_description',
    CONNECTOR_URL_PLACEHOLDER: 'team_settings_connector_url_placeholder',
    CONNECTOR_URL_ERROR: 'team_settings_connector_url_error',
    CONNECTOR_EDIT: 'team_settings_connector_edit',
    CONNECTOR_SAVE: 'team_settings_connector_save',
    CONNECTOR_SAVING: 'team_settings_connector_saving',
    CONNECTOR_SUCCESS: 'team_settings_connector_success',
};
const SSOConnector = ({ setStepComplete, isTeamSettingsLoading = false, teamSettings, updateTeamSettings, }: SSOSettingSectionProps) => {
    const { translate } = useTranslate();
    const saveIdpMetadata = React.useCallback(async (metadata: string) => {
        try {
            await updateTeamSettings({
                ssoIdpMetadata: metadata,
            });
        }
        catch (error) {
            throw Error(translate(I18N_KEYS.PROVIDER_METADATA_ERROR));
        }
    }, [updateTeamSettings, translate]);
    const saveConnectorURL = React.useCallback(async (url: string) => {
        try {
            const updateUrl = url ? removeDuplicateSlashesFromUrl(url) : null;
            await updateTeamSettings({
                ssoServiceProviderUrl: updateUrl,
            });
        }
        catch (error) {
            throw Error(translate(I18N_KEYS.CONNECTOR_URL_ERROR));
        }
    }, [updateTeamSettings, translate]);
    const ssoServiceProviderUrl = teamSettings?.ssoServiceProviderUrl;
    const ssoIdpMetadata = teamSettings?.ssoIdpMetadata;
    React.useEffect(() => {
        if (isTeamSettingsLoading) {
            return;
        }
        if (ssoIdpMetadata && ssoServiceProviderUrl) {
            setStepComplete(SSOSettingStep.SSOConnector);
        }
    }, [
        isTeamSettingsLoading,
        ssoServiceProviderUrl,
        ssoIdpMetadata,
        setStepComplete,
    ]);
    return (<div className={styles.ssoConnectorContainer}>
      <ConnectorInfo isTeamSettingsLoading={isTeamSettingsLoading} teamSettings={teamSettings} saveConnectorURL={saveConnectorURL} saveIdpMetadata={saveIdpMetadata}/>
      <Installer isTeamSettingsLoading={isTeamSettingsLoading} isSsoEnabled={teamSettings?.ssoEnabled ?? false} idpMetadata={teamSettings?.ssoIdpMetadata ?? ''} connectorUrl={teamSettings?.ssoServiceProviderUrl ?? ''}/>
    </div>);
};
export default SSOConnector;
