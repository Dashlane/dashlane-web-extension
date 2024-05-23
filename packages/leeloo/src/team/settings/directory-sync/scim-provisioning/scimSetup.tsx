import { BasicConfig, TeamSettings } from '@dashlane/communication';
import { Card, CardContent, GridChild, GridContainer, } from '@dashlane/ui-components';
import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory } from 'libs/router';
import { useTeamDeviceConfig } from 'team/settings/hooks/useTeamDeviceConfig';
import { scimSettingsSubPath } from './scim-provisioning';
import { SCIMSyncStatus } from './scim-sync-status';
import { useTeamDevice } from 'team/settings/hooks/useTeamDevice';
const I18N_KEYS = {
    CONFIGURE_ES_TOOLTIP: 'team_settings_es_sso_setup_configure_es_tooltip',
    SCIM_HEADER: 'team_settings_directory_sync_scim_header',
    SCIM_DESCRIPTION: 'team_settings_directory_sync_scim_description',
    SCIM_EDIT: 'team_settings_button_edit_label',
    SCIM_SET_UP: 'team_settings_directory_sync_scim_set_up_button',
};
interface ScimSetupProps {
    loading: boolean;
    parentPath: string;
    teamSettings: TeamSettings;
    esConfig: BasicConfig | undefined;
    isScimCapable: boolean;
    disableSetupButton: boolean;
}
export const ScimSetup = ({ loading, parentPath, teamSettings, esConfig, isScimCapable, disableSetupButton, }: ScimSetupProps) => {
    const history = useHistory();
    const { translate } = useTranslate();
    const { teamDeviceConfigLoading, teamDeviceConfig } = useTeamDeviceConfig({
        draft: false,
        deviceAccessKey: esConfig?.deviceAccessKey,
    });
    const { teamDeviceLoading, teamDevice, refreshTeamDevice } = useTeamDevice(esConfig?.deviceAccessKey);
    const dataLoading = loading || teamDeviceConfigLoading;
    const isSetupDisabled = !teamSettings?.ssoServiceProviderUrl ||
        dataLoading ||
        disableSetupButton ||
        !isScimCapable;
    const isPrimaryCta = !teamDeviceConfig?.configProperties?.scimAuthToken;
    return (<Card>
      <GridContainer as={CardContent} gap="8px" gridTemplateAreas="'header button' 'description button' 'status status'" gridTemplateColumns="1fr auto" sx={{ bg: 'white', border: 'none' }}>
        <GridChild as={Heading} innerAs="h3" size="large" bold gridArea="header" textStyle="ds.title.section.medium">
          {translate(I18N_KEYS.SCIM_HEADER)}
        </GridChild>
        <GridChild gridArea="description" as={Paragraph} size="small" textStyle="ds.title.block.small" color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.SCIM_DESCRIPTION)}
        </GridChild>
        <GridChild gridArea="button">
          <DisabledButtonWithTooltip id="scimSetupButton" loading={dataLoading} disabled={isSetupDisabled} neverShowTooltip={disableSetupButton} size="large" onClick={() => {
            history.push(`${parentPath}${scimSettingsSubPath}`);
        }} content={translate(I18N_KEYS.CONFIGURE_ES_TOOLTIP)} mood={isPrimaryCta && !isSetupDisabled ? 'brand' : 'neutral'} intensity={isPrimaryCta && !isSetupDisabled ? 'catchy' : 'quiet'}>
            {isPrimaryCta
            ? translate(I18N_KEYS.SCIM_SET_UP)
            : translate(I18N_KEYS.SCIM_EDIT)}
          </DisabledButtonWithTooltip>
        </GridChild>
        {teamDeviceConfig?.configProperties?.scimEnabled ? (<GridChild gridArea="status" sx={{ mt: '20px' }}>
            <SCIMSyncStatus loading={teamDeviceLoading} version={teamDevice?.version} refreshData={refreshTeamDevice} lastSyncUnix={teamDevice?.lastActivityDateUnix}/>
          </GridChild>) : null}
      </GridContainer>
    </Card>);
};
