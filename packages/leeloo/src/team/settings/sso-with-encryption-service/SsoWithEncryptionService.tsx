import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { SsoSetupStep } from '@dashlane/hermes';
import { colors, GridContainer, jsx, Link, LoadingIcon, } from '@dashlane/ui-components';
import { Icon, Infobox } from '@dashlane/design-system';
import { redirect, Route, Switch, useRouteMatch } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { TabMenu } from 'team/page/tab-menu/tab-menu';
import { LinkCard, LinkType } from 'team/settings/components/layout/link-card';
import { ResponsiveMainSecondaryLayout } from 'team/settings/components/layout/responsive-main-secondary-layout';
import { useEncryptionServiceConfig } from 'team/settings/hooks/useEncryptionServiceConfig';
import { logSelfHostedSSOSetupStep } from 'team/settings/sso-setup-logs';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { EncryptionService } from '../encryption-service/encryption-service';
import { EncryptionServiceSetup } from '../encryption-service/encryption-service-setup';
import { RestartEncryptionServiceInfobox } from '../encryption-service/restart-es-infobox';
import { PageContext, SsoInfobox } from '../scim-sso-infoboxes/sso-infobox';
import { useTeamSettings } from '../hooks/useTeamSettings';
import { SsoSetupForm } from './SsoSetupForm';
import { SsoSetup } from './SsoSetup';
const { dashDarkerGreen00, dashGreen00, dashGreen06, midGreen00 } = colors;
const SETUP_GUIDE_HREF = '*****';
const I18N_KEYS = {
    TITLE: 'team_settings_es_sso_title',
    SETUP_GUIDE_HEADING: 'team_settings_es_sso_setup_guide_heading',
    SETUP_GUIDE_DESCRIPTION: 'team_settings_es_sso_setup_guide_description',
    SETUP_GUIDE_LINK: 'team_settings_es_sso_setup_guide_link_text',
    SSO_HEADER: 'team_settings_es_sso_setup_header',
    SSO_DESCRIPTION: 'team_settings_es_sso_setup_description',
    CONFIGURE_ES_TOOLTIP: 'team_settings_es_sso_setup_configure_es_tooltip',
    BUTTON_CANCEL: 'team_settings_encryption_service_button_cancel',
    BUTTON_SAVE_CHANGES: 'team_settings_encryption_service_button_save_changes',
    SSO_MIGRATION_INFOBOX_TITLE: 'team_settings_es_sso_migration_infobox_title',
    SSO_MIGRATION_INFOBOX_BODY: 'team_settings_es_sso_migration_infobox_body',
};
export const encryptionServiceSubPath = `/encryption-service-settings`;
export const ssoSettingsSubPath = `/sso-settings`;
export const SsoWithEncryptionService = ({ backRoute, }: {
    backRoute: string;
}) => {
    const { translate } = useTranslate();
    const { path } = useRouteMatch();
    const { esConfig, esConfigLoading, refreshEncryptionServiceConfig } = useEncryptionServiceConfig();
    const { teamId } = useTeamSpaceContext();
    const { teamSettings, updateTeamSettings, teamSettingsLoading } = useTeamSettings(teamId);
    const { status: ssoStateStatus, data: ssoState } = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    if (ssoStateStatus !== DataStatus.Success) {
        return null;
    }
    const { global: { ssoCapable, inferredSsoState }, enableSSO: { ssoEnabled }, } = ssoState;
    const isNitroInProgress = inferredSsoState === InferredSsoState.enum.NitroIncomplete;
    const showBackButton = !ssoEnabled;
    const migratingFromSSOConnector = inferredSsoState ===
        InferredSsoState.enum.SsoConnectorToSelfHostedMigration;
    const onBackClicked = () => {
        logSelfHostedSSOSetupStep({
            ssoSetupStep: SsoSetupStep.ReturnToSsoSelection,
        });
        redirect(backRoute);
    };
    return (<GridContainer gridTemplateColumns="auto" gridTemplateRows="auto 1fr" fullWidth sx={{ height: '100%' }}>
      <div sx={{ bg: dashGreen06, px: '48px', pt: '32px', pb: '4px' }}>
        
        <TabMenu title={translate(I18N_KEYS.TITLE)}/>
        {showBackButton ? (<Link color={midGreen00} hoverColor={dashGreen00} activeColor={dashDarkerGreen00} onClick={onBackClicked} sx={{
                fontSize: '16px',
                display: 'flex',
                textDecoration: 'none',
                marginTop: '-18px',
            }}>
            <Icon name="ArrowLeftOutlined" size="small" color={dashGreen00} sx={{ marginRight: '10px' }}/>{' '}
            Back
          </Link>) : null}
      </div>

      <ResponsiveMainSecondaryLayout mainContent={GridContainer} mainProps={{
            gridTemplateColumns: 'auto',
            gridAutoRows: 'min-content',
            gap: '32px',
            children: (<Switch>
              <Route exact path={path}>
                <SsoInfobox pageContext={PageContext.SelfHosted} onSetupClear={() => updateTeamSettings({ ssoServiceProviderUrl: null })}/>
                <RestartEncryptionServiceInfobox />

                {migratingFromSSOConnector ? (<Infobox title={translate(I18N_KEYS.SSO_MIGRATION_INFOBOX_TITLE)} description={translate(I18N_KEYS.SSO_MIGRATION_INFOBOX_BODY)}/>) : null}

                <EncryptionServiceSetup loading={esConfigLoading || ssoCapable === null} esConfig={esConfig} parentPath={path} disableSetupButton={!ssoCapable || isNitroInProgress}/>
                <SsoSetup isSsoCapable={ssoCapable} disableSetupButton={!ssoCapable || !esConfig?.config}/>
              </Route>
              <Route path={`${path}${encryptionServiceSubPath}`}>
                {esConfigLoading || teamSettingsLoading ? (<LoadingIcon />) : (<EncryptionService migratingFromSSOConnector={migratingFromSSOConnector} onSave={() => refreshEncryptionServiceConfig()} teamSettings={teamSettings} updateTeamSettings={updateTeamSettings} esConfig={esConfig}/>)}
              </Route>
              <Route path={`${path}${ssoSettingsSubPath}`}>
                <SsoSetupForm />
              </Route>
            </Switch>),
        }} secondaryContent={LinkCard} secondaryProps={{
            description: translate(I18N_KEYS.SETUP_GUIDE_DESCRIPTION),
            heading: translate(I18N_KEYS.SETUP_GUIDE_HEADING),
            linkText: translate(I18N_KEYS.SETUP_GUIDE_LINK),
            linkProps: {
                linkType: LinkType.ExternalLink,
                linkHref: SETUP_GUIDE_HREF,
            },
        }}/>
    </GridContainer>);
};
