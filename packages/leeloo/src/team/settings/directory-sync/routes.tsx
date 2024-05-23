import { Fragment, useEffect } from 'react';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import { DataStatus, useFeatureFlip, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { CustomRoute, Redirect, Switch, useRouteMatch } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { Tab, TabId, TabMenu } from 'team/page/tab-menu/tab-menu';
import activeDirectorySettingsReducer from './active-directory/reducer';
import { ActiveDirectorySettings } from './active-directory/active-directory';
import { encryptionServiceSubPath, ScimProvisioning, scimSettingsSubPath, } from './scim-provisioning/scim-provisioning';
import { useTeamSpaceContext } from '../components/TeamSpaceContext';
import { useEncryptionServiceConfig } from '../hooks/useEncryptionServiceConfig';
import { useTeamSettings } from '../hooks/useTeamSettings';
import { useTeamDeviceConfig } from '../hooks/useTeamDeviceConfig';
import { GridContainer } from '@dashlane/ui-components';
import { DirectorySyncLandingPage } from './directory-sync-landing-page';
import { ConfidentialSCIM } from './confidential-scim';
import { scimApi } from '@dashlane/sso-scim-contracts/src';
const I18N_KEYS = {
    POLICIES: 'team_settings_tab_policies',
    AUTHENTICATION: 'team_settings_tab_authentication',
    SCIM_PROVISIONING: 'team_settings_tab_scim_provisioning',
    SAML_LEGACY: 'team_settings_tab_saml_legacy',
    SSO: 'team_settings_tab_sso',
    ACTIVE_DIRECTORY: 'team_settings_tab_active_directory',
    DUO: 'team_settings_tab_duo',
    MASTER_PASSWORD_POLICIES: 'team_settings_tab_master_password_policies',
    TITLE: 'team_settings_tab_title_directory_sync',
};
export const scimProvisioningSubPath = '/scim-provisioning';
export const activeDirectorySubPath = '/active-directory';
export const confidentialScimSubPath = '/confidential-scim';
export const DirectorySync = () => {
    const isConfidentialScimFFActivated = useFeatureFlip('setup_rollout_confidential_scim_prod');
    const { path } = useRouteMatch();
    const { translate } = useTranslate();
    const { esConfig, esConfigLoading } = useEncryptionServiceConfig();
    const { teamDeviceConfig } = useTeamDeviceConfig({
        draft: false,
        deviceAccessKey: esConfig?.deviceAccessKey,
    });
    const { teamId } = useTeamSpaceContext();
    const { teamSettings = {}, teamSettingsLoading, updateTeamSettings, teamCapabilities, } = useTeamSettings(teamId);
    const accountInfo = useAccountInfo();
    const { initSsoProvisioning } = useModuleCommands(confidentialSSOApi);
    const { data: ssoState } = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const { data: scimConfiguration, status: scimConfigurationStatus } = useModuleQuery(scimApi, 'scimConfiguration');
    useEffect(() => {
        if (ssoState?.global.inferredSsoState === InferredSsoState.enum.Unknown &&
            teamId) {
            initSsoProvisioning({ teamId: `${teamId}` });
        }
    }, [initSsoProvisioning, ssoState?.global.inferredSsoState, teamId]);
    const adSyncEnabled = !teamSettingsLoading && teamSettings.activeDirectorySyncType;
    const scimEnabled = teamDeviceConfig?.configProperties.scimEnabled;
    const isAdSyncCapable = teamCapabilities?.activeDirectorySync.enabled ?? null;
    const isNitroSSOInUse = ssoState?.global.inferredSsoState === InferredSsoState.enum.NitroComplete;
    const isNitroInProgress = ssoState?.global.inferredSsoState === InferredSsoState.enum.NitroIncomplete;
    const disableAdSyncForm = (scimEnabled && !adSyncEnabled) || !isAdSyncCapable;
    const disableScimForm = isNitroInProgress || (adSyncEnabled && !scimEnabled);
    const dataLoading = teamSettingsLoading ||
        esConfigLoading ||
        !accountInfo ||
        ssoState?.global.inferredSsoState === InferredSsoState.enum.Unknown ||
        scimConfigurationStatus === DataStatus.Loading;
    const ssoConnectorStates: InferredSsoState[] = [
        InferredSsoState.enum.SsoConnectorComplete,
        InferredSsoState.enum.SsoConnectorIncomplete,
    ];
    const ssoConnectorSetup = ssoState?.global.inferredSsoState &&
        ssoConnectorStates.includes(ssoState?.global.inferredSsoState);
    const canAccessSCIM = !ssoConnectorSetup;
    const scimProvisioningTab = {
        isDisabled: isNitroSSOInUse,
        id: TabId.TAB_SCIM,
        label: translate(I18N_KEYS.SCIM_PROVISIONING),
        url: `${path}${scimProvisioningSubPath}`,
        subPaths: [encryptionServiceSubPath, scimSettingsSubPath],
    };
    const activeDirectoryTab = {
        id: TabId.TAB_ACTIVE_DIRECTORY,
        label: translate(I18N_KEYS.ACTIVE_DIRECTORY),
        url: `${path}${activeDirectorySubPath}`,
    };
    const tabs: Tab[] = [scimProvisioningTab, activeDirectoryTab];
    const startOnScimPage = scimEnabled ||
        (canAccessSCIM && !adSyncEnabled && !isNitroSSOInUse);
    const subPath = startOnScimPage
        ? scimProvisioningSubPath
        : activeDirectorySubPath;
    const defaultRoute = `${path}${subPath}`;
    return (<GridContainer gridTemplateColumns="auto" gridTemplateRows="auto 1fr" fullWidth sx={{ height: '100%' }}>
      {dataLoading ? (<GridContainer justifyItems="center">
          <IndeterminateLoader size={75} sx={{ marginTop: '20vh' }}/>
        </GridContainer>) : (<>
          {isConfidentialScimFFActivated ? null : (<div sx={{
                    px: '48px',
                    pt: '32px',
                    pb: '4px',
                }}>
              <TabMenu title={translate(I18N_KEYS.TITLE)} tabs={tabs}/>
            </div>)}
          <Switch>
            {isConfidentialScimFFActivated ? (<CustomRoute exact path={path} component={DirectorySyncLandingPage} permission={(p) => p.adminAccess.hasFullAccess || p.adminAccess.hasBillingAccess} additionalProps={{
                    ssoState: ssoState?.global.inferredSsoState,
                    isAdSyncEnabled: adSyncEnabled,
                    isSelfhostedScimEnabled: scimEnabled,
                    isNitroSCIMEnabled: scimConfiguration?.active,
                    isLoading: dataLoading,
                }}/>) : (<Redirect exact from={`${path}/`} to={defaultRoute}/>)}
            <CustomRoute exact path={`${path}${confidentialScimSubPath}`} component={ConfidentialSCIM} permission={(p) => p.adminAccess.hasFullAccess || p.adminAccess.hasBillingAccess}/>
            <CustomRoute path={`${path}${scimProvisioningSubPath}`} component={ScimProvisioning} additionalProps={{
                isScimEnabled: scimEnabled ?? null,
                isScimCapable: teamCapabilities?.scim.enabled ?? null,
                teamSettings,
                updateTeamSettings,
                disableForm: disableScimForm,
                adSyncEnabled,
                ssoConnectorSetup,
            }} permission={(p) => p.adminAccess.hasFullAccess || p.adminAccess.hasBillingAccess}/>
            <CustomRoute path={`${path}${activeDirectorySubPath}`} component={ActiveDirectorySettings} additionalProps={{
                isAdSyncCapable,
                teamSettingsLoading,
                teamSettings,
                updateTeamSettings,
                disableForm: disableAdSyncForm,
                adSyncEnabled,
                accountInfo,
            }} reducer={activeDirectorySettingsReducer}/>
          </Switch>
        </>)}
    </GridContainer>);
};
