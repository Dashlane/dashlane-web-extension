import { FormEvent, Fragment, MouseEvent, useCallback, useEffect, useState, } from 'react';
import { Icon, jsx, Paragraph } from '@dashlane/design-system';
import { GridChild, GridContainer, LoadingIcon } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { AccountInfo, TeamSettings } from '@dashlane/communication';
import { LeeWithStorage } from 'lee';
import { fromUnixTime } from 'date-fns';
import { logPageView } from 'libs/logs/logEvent';
import { LocaleFormat } from 'libs/i18n/helpers';
import useTranslate from 'libs/i18n/useTranslate';
import SwitchWithFeedback from 'libs/dashlane-style/switch';
import { TextField } from 'libs/dashlane-style/text-field/text-field';
import PrimaryButton from 'libs/dashlane-style/buttons/modern/primary';
import SecondaryButton from 'libs/dashlane-style/buttons/modern/secondary';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { InviteLinkSharingDialog } from 'team/invite-link-sharing-dialog/invite-link-sharing-dialog';
import { SettingsPage } from 'team/settings';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { LinkCard, LinkType } from 'team/settings/components/layout/link-card';
import { useLastADSyncDate } from 'team/settings/hooks/useLastADSyncDate';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { ActiveDirectorySettingsLoadedParams } from 'team/settings/directory-sync/active-directory/reducer';
import Row from 'team/settings/base-page/row';
import { getInviteLinkWithTeamKey } from 'team/urls';
import { TeamPlansActiveDirectorySyncStatus } from './types';
import { ActiveDirectoryPaywall } from './active-directory-paywall';
import * as actions from './reducer';
import { BackPageLayout } from '../../components/layout/back-page-layout';
const I18N_KEYS = {
    LAST_SUCCESSFUL_SYNC_DATE_VALUE_NEVER: 'team_settings_active_directory_last_successful_sync_date_value_never',
    LAST_ERROR_MESSAGE_LABEL: 'team_settings_active_directory_last_error_message_label',
    LAST_ERROR_DATE_LABEL: 'team_settings_active_directory_last_error_date_label',
    FAIL_COUNT_LABEL: 'team_settings_active_directory_fail_count_label',
    TITLE_HELP: 'team_settings_active_directory_title_help',
    HEADER_LABEL: 'team_settings_active_directory_header_label',
    HEADER_HELPER: 'team_settings_active_directory_header_helper',
    HEADER_BUTTON_LABEL: 'team_settings_active_directory_header_button_label',
    TITLE_STATUS: 'team_settings_active_directory_title_status',
    LAST_SUCCESSFUL_SYNC_DATE_LABEL: 'team_settings_active_directory_last_successful_sync_date_label',
    TITLE_SETUP: 'team_settings_active_directory_title_setup',
    AUTOMATED_PROVISIONING_LABEL: 'team_settings_active_directory_automated_provisioning_label',
    AUTOMATED_PROVISIONING_HELPER: 'team_settings_active_directory_automated_provisioning_helper',
    AUTOMATED_DEPROVISIONING_LABEL: 'team_settings_active_directory_automated_deprovisioning_label',
    AUTOMATED_DEPROVISIONING_HELPER: 'team_settings_active_directory_automated_deprovisioning_helper',
    CRON_SCRIPT_LABEL: 'team_settings_active_directory_cron_script_label',
    CRON_SCRIPT_HELPER: 'team_settings_active_directory_cron_script_helper',
    BUTTON_COPY_FEEDBACK: 'team_settings_active_directory_button_copy_feedback',
    BUTTON_COPY_LABEL: 'team_settings_active_directory_button_copy_label',
    SWITCH_DEFAULT_ERROR: '_common_generic_error',
    GENERIC_ERROR: '_common_generic_error',
    SHARE_INVITE_LINK_TITLE: 'team_settings_encryption_service_scim_invite_link_heading',
    SHARE_INVITE_LINK_DESC: 'team_settings_encryption_service_scim_invite_link_description_first',
    SHARE_INVITE_LINK_CTA: 'team_settings_encryption_service_scim_invite_link_copy',
};
export interface State {
    activeDirectoryScript: string;
    activeDirectorySyncStatus: TeamPlansActiveDirectorySyncStatus;
    activeDirectorySyncType: string | null;
    isCopied: boolean;
}
interface Props {
    lee: LeeWithStorage<State>;
    teamSettings: TeamSettings;
    teamSettingsLoading: boolean;
    updateTeamSettings: (settings: TeamSettings) => Promise<void>;
    disableForm: boolean;
    adSyncEnabled: boolean;
    isAdSyncCapable?: boolean;
    accountInfo: AccountInfo;
}
export const ActiveDirectorySettings = ({ lee, teamSettings, teamSettingsLoading, updateTeamSettings, disableForm, adSyncEnabled, isAdSyncCapable, accountInfo, }: Props) => {
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const { lastADSyncDateError, lastADSyncDateLoading, lastADSyncDate } = useLastADSyncDate();
    const _shortDate = translate.shortDate;
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isFetchingAutomatedDeprovisioning, setIsFetchingAutomatedDeprovisioning,] = useState<boolean>(false);
    const [hasAutoDeprovisioning, setHasAutoDeprovisioning] = useState<boolean>(false);
    const [isFetchingAutomatedProvisioning, setIsFetchingAutomatedProvisioning] = useState<boolean>(false);
    const [hasAutoProvisioning, setHasAutoProvisioning] = useState<boolean>(false);
    const { inviteLinkDataForAdmin, getInviteLinkDataForAdmin } = useInviteLinkData();
    const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
    const { teamId } = useTeamSpaceContext();
    const calculateAutoDeprovisioning = (syncType: string): boolean => ['full', 'deprovision-only'].includes(syncType);
    const calculateAutoProvisioning = (syncType: string): boolean => ['full', 'provision-only'].includes(syncType);
    const teamPlans = useCallback(() => {
        if (!lee.apiMiddleware.teamPlans) {
            reportTACError(new Error('teamPlans service missing from apiMiddleware'));
            return null;
        }
        return lee.apiMiddleware.teamPlans;
    }, []);
    useEffect(() => {
        logPageView(PageView.TacSettingsDirectorySyncActiveDirectory);
    }, []);
    useEffect(() => {
        getInviteLinkDataForAdmin();
    }, [getInviteLinkDataForAdmin]);
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            let activeDirectoryToken = teamSettings.activeDirectoryToken;
            let activeDirectorySyncStatus = teamSettings.activeDirectorySyncStatus;
            if (!activeDirectoryToken) {
                const teamPlansResult = await teamPlans();
                if (!teamPlansResult) {
                    return;
                }
                const { activeDirectorySyncStatus: newADSyncStatus, activeDirectoryToken: newADToken, } = teamPlansResult.getADToken();
                activeDirectoryToken = newADToken;
                activeDirectorySyncStatus = newADSyncStatus;
            }
            const { activeDirectorySyncType } = teamSettings;
            try {
                const activeDirectorySettingsParam = {
                    activeDirectorySyncStatus,
                    activeDirectorySyncType,
                    activeDirectoryToken,
                    teamId,
                };
                lee.dispatch(actions.activeDirectorySettingsLoaded(activeDirectorySettingsParam as ActiveDirectorySettingsLoadedParams));
                setHasAutoDeprovisioning(calculateAutoDeprovisioning(activeDirectorySyncType ?? ''));
                setHasAutoProvisioning(calculateAutoProvisioning(activeDirectorySyncType ?? ''));
                setIsFetching(false);
            }
            catch (error) {
                console.error(`ActiveDirectorySettings - fetchData: failed with error: ${error}`);
            }
        };
        if (!teamSettingsLoading) {
            fetchData();
        }
    }, [_shortDate, teamSettingsLoading]);
    const copyScript = () => {
        navigator.clipboard.writeText(lee.state.activeDirectoryScript).then(() => {
            lee.dispatch(actions.toggleScriptCopyFeedback(true));
            window.setTimeout(() => lee.dispatch(actions.toggleScriptCopyFeedback(false)), 700);
        });
    };
    const calculateSyncType = (hasAutoProvisioningValue: boolean, hasAutoDeprovisioningValue: boolean): string | null => hasAutoProvisioningValue
        ? hasAutoDeprovisioningValue
            ? 'full'
            : 'provision-only'
        : hasAutoDeprovisioningValue
            ? 'deprovision-only'
            : null;
    const toggleDeprovisioning = async (): Promise<void> => {
        if (isFetchingAutomatedDeprovisioning) {
            return Promise.resolve();
        }
        setIsFetchingAutomatedDeprovisioning(true);
        const newHasAutoDeprovisioning = !hasAutoDeprovisioning;
        const activeDirectorySyncType = calculateSyncType(hasAutoProvisioning, newHasAutoDeprovisioning);
        try {
            await updateTeamSettings({
                activeDirectorySyncType: activeDirectorySyncType,
            });
            lee.dispatch(actions.setActiveDirectorySyncType(activeDirectorySyncType));
            setHasAutoDeprovisioning(newHasAutoDeprovisioning);
            setIsFetchingAutomatedDeprovisioning(false);
        }
        catch (error) {
            reportTACError(error);
        }
    };
    const toggleProvisioning = async (): Promise<void> => {
        if (isFetchingAutomatedProvisioning) {
            return Promise.resolve();
        }
        setIsFetchingAutomatedProvisioning(true);
        const newHasAutoProvisioning = !hasAutoProvisioning;
        const activeDirectorySyncType = calculateSyncType(newHasAutoProvisioning, hasAutoDeprovisioning);
        try {
            await updateTeamSettings({
                activeDirectorySyncType: activeDirectorySyncType,
            });
            lee.dispatch(actions.setActiveDirectorySyncType(activeDirectorySyncType));
            setHasAutoProvisioning(newHasAutoProvisioning);
            setIsFetchingAutomatedProvisioning(false);
        }
        catch (error) {
            reportTACError(error);
        }
    };
    const openHelpPage = () => {
        window.open('*****', '_blank');
    };
    const getLastSuccessfulSynchronizationDate = () => {
        if (lastADSyncDateLoading) {
            return <LoadingIcon color="ds.oddity.focus" size="20px"/>;
        }
        if (lastADSyncDateError) {
            return `${translate(I18N_KEYS.GENERIC_ERROR)} ${lastADSyncDateError.message.toLowerCase()}`;
        }
        return lastADSyncDate?.lastSuccessfulSyncRequestForTeamUnix
            ? _shortDate(fromUnixTime(lastADSyncDate.lastSuccessfulSyncRequestForTeamUnix), LocaleFormat.lll)
            : translate(I18N_KEYS.LAST_SUCCESSFUL_SYNC_DATE_VALUE_NEVER);
    };
    const getErrorRows = () => {
        const { activeDirectorySyncStatus } = lee.state;
        return activeDirectorySyncStatus?.failedSyncCount ? (<>
        <Row label={translate(I18N_KEYS.LAST_ERROR_MESSAGE_LABEL)}>
          <span sx={{ color: 'ds.text.danger.standard' }}>
            {activeDirectorySyncStatus.lastFailedSync?.error}
          </span>
        </Row>
        <Row label={translate(I18N_KEYS.LAST_ERROR_DATE_LABEL)}>
          <span sx={{ color: 'ds.text.danger.standard' }}>
            {activeDirectorySyncStatus?.lastFailedSync
                ? _shortDate(fromUnixTime(activeDirectorySyncStatus.lastFailedSync.eventDateUnix), LocaleFormat.lll)
                : null}
          </span>
        </Row>
        <Row label={translate(I18N_KEYS.FAIL_COUNT_LABEL)}>
          <span sx={{ color: 'ds.text.danger.standard' }}>
            {lee.state.activeDirectorySyncStatus.failedSyncCount}
          </span>
        </Row>
      </>) : null;
    };
    const inviteLink = getInviteLinkWithTeamKey(inviteLinkDataForAdmin?.teamKey);
    const handleCopyInviteLink = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(inviteLink);
        setShowInviteLinkModal(true);
    };
    return (<BackPageLayout title="Active Directory">
      {<InviteLinkSharingDialog showSharingDialog={showInviteLinkModal} setShowSharingDialog={setShowInviteLinkModal}/>}
      <GridContainer gap="10px" gridTemplateAreas="'mainContent secondaryContent'" gridTemplateColumns="auto 1fr" alignContent="flex-start">
        <GridChild gridArea="mainContent">
          <SettingsPage>
            {!isAdSyncCapable ? (<ActiveDirectoryPaywall accountInfo={accountInfo}/>) : null}
            <Paragraph sx={{ marginTop: disableForm ? '32px' : undefined }} color="ds.text.neutral.quiet" textStyle="ds.body.standard.strong">
              {translate(I18N_KEYS.TITLE_HELP)}
            </Paragraph>
            <Row label={translate(I18N_KEYS.HEADER_LABEL)} labelHelper={translate(I18N_KEYS.HEADER_HELPER)}>
              <div>
                <PrimaryButton label={translate(I18N_KEYS.HEADER_BUTTON_LABEL)} onClick={() => openHelpPage()}/>
              </div>
            </Row>

            <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.strong">
              {translate(I18N_KEYS.TITLE_STATUS)}
            </Paragraph>
            <Row label={translate(I18N_KEYS.LAST_SUCCESSFUL_SYNC_DATE_LABEL)}>
              {getLastSuccessfulSynchronizationDate()}
            </Row>
            {getErrorRows()}

            <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.strong">
              {translate(I18N_KEYS.TITLE_SETUP)}
            </Paragraph>
            <Row label={translate(I18N_KEYS.AUTOMATED_PROVISIONING_LABEL)} labelHelper={translate(I18N_KEYS.AUTOMATED_PROVISIONING_HELPER)}>
              <SwitchWithFeedback genericErrorMessage={translate(I18N_KEYS.SWITCH_DEFAULT_ERROR)} isDisabled={isFetching || isFetchingAutomatedProvisioning || disableForm} saveValueFunction={toggleProvisioning} value={hasAutoProvisioning}/>
            </Row>
            <Row label={translate(I18N_KEYS.AUTOMATED_DEPROVISIONING_LABEL)} labelHelper={translate(I18N_KEYS.AUTOMATED_DEPROVISIONING_HELPER)}>
              <SwitchWithFeedback genericErrorMessage={translate(I18N_KEYS.SWITCH_DEFAULT_ERROR)} isDisabled={isFetching || isFetchingAutomatedDeprovisioning || disableForm} saveValueFunction={toggleDeprovisioning} value={hasAutoDeprovisioning}/>
            </Row>
            <Row label={translate(I18N_KEYS.CRON_SCRIPT_LABEL)} labelHelper={translate(I18N_KEYS.CRON_SCRIPT_HELPER)}>
              <TextField defaultValue={lee.state.activeDirectoryScript} isDisabled multiLine style={{
            backgroundColor: 'ds.container.expressive.neutral.quiet.active',
            fontSize: '12px',
            height: '180px',
            width: '300px',
        }}/>
              <div>
                <SecondaryButton label={lee.state.isCopied
            ? translate(I18N_KEYS.BUTTON_COPY_FEEDBACK)
            : translate(I18N_KEYS.BUTTON_COPY_LABEL)} onClick={() => copyScript()}/>
              </div>
            </Row>
          </SettingsPage>
        </GridChild>
        {adSyncEnabled ? (<GridChild gridArea="secondaryContent" sx={{ maxWidth: '500px', minWidth: '250px' }} alignSelf="flex-start">
            <LinkCard linkProps={{
                linkType: LinkType.ExternalLink,
            }} heading={translate(I18N_KEYS.SHARE_INVITE_LINK_TITLE)} description={<div>
                  <Paragraph sx={{ mb: '8px' }}>
                    {translate(I18N_KEYS.SHARE_INVITE_LINK_DESC)}
                  </Paragraph>
                  <Paragraph as="a" onClick={handleCopyInviteLink} sx={{ display: 'flex', gap: '4px' }} href="_blank">
                    {translate(I18N_KEYS.SHARE_INVITE_LINK_CTA)}
                    <Icon color="ds.text.brand.standard" name="ActionCopyOutlined" size="medium"/>
                  </Paragraph>
                </div>}/>
          </GridChild>) : null}
      </GridContainer>
    </BackPageLayout>);
};
