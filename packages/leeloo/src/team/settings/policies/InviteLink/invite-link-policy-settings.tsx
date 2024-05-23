import { Fragment, useEffect } from 'react';
import { jsx } from '@dashlane/design-system';
import { FlexContainer, Paragraph } from '@dashlane/ui-components';
import { CopyButton } from 'libs/dashlane-style/copy-button';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsTeamDiscontinuedAfterTrial } from 'libs/hooks/use-is-team-discontinued-after-trial';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { useGetTeamName } from 'team/hooks/use-get-team-name';
import { getInviteLinkWithTeamKey } from 'team/urls';
import { SettingsGroupHeading } from 'team/settings/components/layout/settings-group-heading';
import { PolicySetting } from '../components/policy-setting';
import { SettingField, SettingHeader } from '../types';
const I18N_KEYS = {
    HEADER: 'team_settings_header_user_access',
    TOGGLE_LABEL: 'team_settings_enable_invite_link_label',
    TOGGLE_HELP_TEXT: 'team_settings_disable_enable_invite_link_helper',
    GENERIC_ERROR: '_common_generic_error',
};
export const InviteLinkPolicySettings = () => {
    const { translate } = useTranslate();
    const { inviteLinkDataForAdmin, getInviteLinkDataForAdmin, inviteLinkDataLoading, createInviteLink, toggleInviteLink, } = useInviteLinkData();
    const teamName = useGetTeamName();
    const isTeamDiscontinuedAfterTrial = useIsTeamDiscontinuedAfterTrial();
    useEffect(() => {
        getInviteLinkDataForAdmin();
    }, [getInviteLinkDataForAdmin]);
    if (!teamName || isTeamDiscontinuedAfterTrial === null) {
        return null;
    }
    const inviteLinkHeader: SettingHeader = {
        type: 'header',
        label: translate(I18N_KEYS.HEADER),
    };
    const inviteLinkSwitch: SettingField = {
        type: 'switch',
        isLoading: inviteLinkDataLoading,
        label: translate(I18N_KEYS.TOGGLE_LABEL),
        isReadOnly: isTeamDiscontinuedAfterTrial,
        feature: 'inviteLink',
        helperLabel: (<>
        {translate(I18N_KEYS.TOGGLE_HELP_TEXT)}
        {inviteLinkDataForAdmin?.disabled === false ? (<FlexContainer flexDirection="row" flexWrap="nowrap" alignItems="center" gap="8px" sx={{ marginTop: '12px' }}>
            <CopyButton mood="neutral" intensity="supershy" iconProps={{
                    color: 'ds.text.neutral.standard',
                }} copyValue={getInviteLinkWithTeamKey(inviteLinkDataForAdmin.teamKey)}/>
            <Paragraph bold size="x-small" sx={{
                    textDecoration: 'underline',
                }}>
              {getInviteLinkWithTeamKey(inviteLinkDataForAdmin.teamKey)}
            </Paragraph>
          </FlexContainer>) : null}
      </>),
        value: inviteLinkDataForAdmin?.disabled === false,
        customSwitchHandler: async () => {
            const teamKey = inviteLinkDataForAdmin?.teamKey;
            if (!teamKey) {
                const createResponse = await createInviteLink(teamName);
                if (!createResponse) {
                    throw Error(translate(I18N_KEYS.GENERIC_ERROR));
                }
            }
            else {
                const toggleResponse = await toggleInviteLink(!inviteLinkDataForAdmin?.disabled);
                if (!toggleResponse) {
                    throw Error(translate(I18N_KEYS.GENERIC_ERROR));
                }
            }
            const getResponse = await getInviteLinkDataForAdmin();
            if (!getResponse) {
                throw Error(translate(I18N_KEYS.GENERIC_ERROR));
            }
        },
    };
    return (<>
      <SettingsGroupHeading header={inviteLinkHeader}/>
      <PolicySetting field={inviteLinkSwitch}/>
    </>);
};
