import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
import { Card, CardContent, colors, GridChild, GridContainer, jsx, Paragraph, } from '@dashlane/ui-components';
import { useEffect, useState } from 'react';
import { carbonConnector } from 'libs/carbon/connector';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamSpaceContext } from '../components/TeamSpaceContext';
import { TestSso } from './test-sso/TestSso';
import { EnableSso } from './enable-sso/EnableSso';
import { useHistory, useRouteMatch } from 'libs/router';
import { useTeamSettings } from '../hooks/useTeamSettings';
const { grey00 } = colors;
const I18N_KEYS = {
    HEADER: 'team_settings_es_sso_setup_header',
    DESCRIPTION: 'team_settings_es_sso_setup_description',
    SET_UP: 'team_settings_es_sso_setup_button',
    CONFIGURE_ES_TOOLTIP: 'team_settings_es_sso_setup_configure_es_tooltip',
    EDIT: 'team_settings_button_edit_label',
    GENERIC_ERROR: '_common_generic_error'
};
enum SSOSetupStatus {
    UNKNOWN = 'UNKNOWN',
    LOADING = 'LOADING',
    COMPLETE = 'COMPLETE',
    INCOMPLETE = 'INCOMPLETE',
    NOT_STARTED = 'NOT_STARTED',
    UNAVAILABLE = 'UNAVAILABLE',
    ERROR = 'ERROR'
}
interface SsoSetupProps {
    disableSetupButton?: boolean;
    isSsoCapable: boolean | null;
}
const nitroStates: InferredSsoState[] = [
    InferredSsoState.enum.NitroComplete,
    InferredSsoState.enum.NitroIncomplete,
];
export const ssoSettingsSubPath = `/sso-settings`;
export const SsoSetup = ({ disableSetupButton, isSsoCapable, }: SsoSetupProps) => {
    const { translate } = useTranslate();
    const { teamId } = useTeamSpaceContext();
    const { teamSettings = {}, updateTeamSettings, teamSettingsLoading, } = useTeamSettings(teamId);
    const { ssoEnabled = false, ssoServiceProviderUrl = '', ssoIdpMetadata, } = teamSettings;
    const [ssoSetupStatus, setSsoSetupStatus] = useState<SSOSetupStatus>(SSOSetupStatus.UNKNOWN);
    const ssoState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const inferredSsoState: InferredSsoState = ssoState.data?.global.inferredSsoState ?? InferredSsoState.enum.Unknown;
    useEffect(() => {
        setSsoSetupStatus(SSOSetupStatus.LOADING);
        carbonConnector.getTeamDomains().then((result) => {
            if (!result.success) {
                setSsoSetupStatus(SSOSetupStatus.ERROR);
                return;
            }
            const isInNitro = nitroStates.includes(inferredSsoState);
            if (!ssoServiceProviderUrl || isInNitro) {
                setSsoSetupStatus(SSOSetupStatus.UNAVAILABLE);
                return;
            }
            const hasValidDomains = result.domains.some(({ status }) => status === 'valid');
            const hasAnyDomains = result.domains.length > 0;
            const hasIdpMetadata = !!ssoIdpMetadata;
            switch (true) {
                case hasValidDomains && hasIdpMetadata:
                    setSsoSetupStatus(SSOSetupStatus.COMPLETE);
                    break;
                case (!hasAnyDomains && hasIdpMetadata) ||
                    (hasAnyDomains && !hasIdpMetadata) ||
                    (!hasValidDomains && hasAnyDomains && hasIdpMetadata):
                    setSsoSetupStatus(SSOSetupStatus.INCOMPLETE);
                    break;
                case !hasAnyDomains && !hasIdpMetadata:
                    setSsoSetupStatus(SSOSetupStatus.NOT_STARTED);
                    break;
                default:
                    break;
            }
        });
    }, [inferredSsoState, ssoIdpMetadata, ssoServiceProviderUrl]);
    const setupDisabled = ssoSetupStatus === SSOSetupStatus.UNAVAILABLE ||
        teamSettingsLoading ||
        disableSetupButton;
    const { path } = useRouteMatch();
    const history = useHistory();
    const ssoSetupStarted = [
        SSOSetupStatus.COMPLETE,
        SSOSetupStatus.INCOMPLETE,
    ].includes(ssoSetupStatus);
    return (<Card>
      <GridContainer as={CardContent} gridTemplateAreas="'header button' 'description button'" gridTemplateColumns="1fr auto" gap="8px" sx={{ bg: 'white', border: 'none' }}>
        <GridChild as={Paragraph} innerAs="h3" size="large" bold gridArea="header">
          {translate(I18N_KEYS.HEADER)}
        </GridChild>
        <GridChild gridArea="description" as={Paragraph} size="small" color={grey00}>
          {translate(I18N_KEYS.DESCRIPTION)}
        </GridChild>
        <GridChild gridArea="button" alignSelf="center">
          <DisabledButtonWithTooltip id="ssoSetupButton" loading={teamSettingsLoading || ssoSetupStatus === SSOSetupStatus.LOADING} disabled={setupDisabled} type="button" size="large" onClick={() => {
            history.push(`${path}${ssoSettingsSubPath}`);
        }} content={translate(I18N_KEYS.CONFIGURE_ES_TOOLTIP)} neverShowTooltip={!isSsoCapable} mood={ssoSetupStarted ? 'neutral' : 'brand'} intensity={ssoSetupStarted ? 'quiet' : 'catchy'}>
            {ssoSetupStarted
            ? translate(I18N_KEYS.EDIT)
            : translate(I18N_KEYS.SET_UP)}
          </DisabledButtonWithTooltip>
        </GridChild>
      </GridContainer>
      {ssoSetupStarted ? (<CardContent sx={{ bg: 'white' }}>
          <TestSso actionsDisabled={ssoSetupStatus !== SSOSetupStatus.COMPLETE} ssoServiceProviderUrl={ssoServiceProviderUrl}/>
          <br />
          <EnableSso actionsDisabled={ssoSetupStatus !== SSOSetupStatus.COMPLETE} ssoEnabled={ssoEnabled} loading={teamSettingsLoading} updateTeamSettings={updateTeamSettings}/>
        </CardContent>) : null}
    </Card>);
};
