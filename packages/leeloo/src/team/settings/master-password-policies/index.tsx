import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { FlexContainer, jsx, Link, Paragraph } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { DataStatus } from '@dashlane/framework-react';
import { Icon, Toggle, useToast } from '@dashlane/design-system';
import { LEE_INCORRECT_AUTHENTICATION, LeeWithStorage } from 'lee';
import { HELPCENTER_ADMIN_ASSISTED_ACCOUNT_RECOVERY_URL } from 'app/routes/constants';
import { getCurrentTeamId } from 'libs/carbon/spaces';
import ConfirmationDialog from 'libs/dashlane-style/dialogs/confirm-with-master-password';
import { logPageView } from 'libs/logs/logEvent';
import { checkIfMasterPasswordIsValid as checkIfMasterPasswordIsValidTrigger, getMasterPasswordResetDemandList, setTeamSettings, } from 'libs/carbon/triggers';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsTeamDiscontinuedAfterTrial } from 'libs/hooks/use-is-team-discontinued-after-trial';
import { getAuth } from 'user';
import { SettingsPage } from 'team/settings';
import { useTeamPolicies } from 'team/settings/policies/hooks/use-team-policies';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import * as actions from './reducer';
import { Stepper } from './stepper/stepper';
import settingsStyles from '../styles.css';
const I18N_KEYS = {
    SETTINGS_RECOVER_LABEL: 'team_settings_master_password_policies_settings_recover_label',
    SETTINGS_RECOVER_LABEL_HELPER: 'team_settings_master_password_policies_settings_recover_label_helper',
    SETTINGS_HOW_IT_WORKS_LABEL: 'team_settings_master_password_policies_settings_how_it_works_label',
    SETTINGS_HOW_IT_WORKS_LABEL_HELPER: 'team_settings_master_password_policies_settings_how_it_works_label_helper',
    SETTINGS_HOW_IT_WORKS_LABEL_HELPER_LINK_TEXT: 'team_settings_master_password_policies_settings_how_it_works_label_helper_link_text',
    DIALOG_TITLE_DISABLE: 'team_settings_master_password_policies_dialog_title_disable',
    DIALOG_TITLE_ENABLE: 'team_settings_master_password_policies_dialog_title_enable',
    DIALOG_CTA_CANCEL_LABEL: 'team_settings_master_password_policies_dialog_cta_cancel_label',
    DIALOG_CTA_CONFIRM_LABEL_DISABLE: 'team_settings_master_password_policies_dialog_cta_confirm_label_disable',
    DIALOG_CTA_CONFIRM_LABEL_ENABLE: 'team_settings_master_password_policies_dialog_cta_confirm_label_enable',
    CONFIRMATION_DIALOG_DISABLE_LABEL_MARKUP: 'team_settings_master_password_policies_confirmation_dialog_disable_label_markup',
    CONFIRMATION_DIALOG_DISABLE_SUBLABEL: 'team_settings_master_password_policies_confirmation_dialog_disable_sublabel',
    CONFIRMATION_DIALOG_ENABLE_LABEL_MARKUP: 'team_settings_master_password_policies_confirmation_dialog_enable_label_markup',
    CONFIRMATION_DIALOG_ENABLE_SUBLABEL: 'team_settings_master_password_policies_confirmation_dialog_enable_sublabel',
    ALERT_LABEL_AVAILABLE: 'team_settings_master_password_policies_dialog_alert_label_available',
    ALERT_LABEL_UNAVAILABLW: 'team_settings_master_password_policies_dialog_alert_label_unavailable',
    MENU_TITLE_ACCOUNT_RECOVERY: 'team_settings_menu_title_account_recovery',
    TOOLTIP_RECOVERY_BLOCKED_DISCONTINUED: 'team_settings_master_password_policies_settings_recovery_blocked_discontinued',
};
export interface State {
    recoveryEnabled: boolean;
}
interface Props {
    lee: LeeWithStorage<State>;
}
const MasterPasswordPoliciesSettings = (props: Props) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isFetchingCheckMasterPassword, setIsFetchingCheckMasterPassword] = useState<boolean>(false);
    const [dialogIsVisible, setDialogIsVisible] = useState<boolean>(false);
    const [hasOutstandingRequests, setHasOutstandingRequests] = useState<boolean>(false);
    const [masterPasswordFieldValue, setMasterPasswordFieldValue] = useState<string>('');
    const [isMasterPasswordInvalid, setIsMasterPasswordInvalid] = useState<boolean>(false);
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const shouldShowTrialDiscontinuedDialog = useIsTeamDiscontinuedAfterTrial();
    const { status: teamPoliciesStatus, data: teamPolicies } = useTeamPolicies();
    const { showToast } = useToast();
    useEffect(() => {
        if (shouldShowTrialDiscontinuedDialog === null) {
            return;
        }
        const hasPendingAccountRecoveryRequests = async (): Promise<boolean> => {
            const auth = getAuth(props.lee.globalState);
            if (!auth || !auth.teamId) {
                reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
                return false;
            }
            else {
                const demands = await getMasterPasswordResetDemandList({
                    teamId: auth.teamId,
                });
                return Boolean(demands.length);
            }
        };
        const fetchData = async () => {
            setIsFetching(true);
            const auth = getAuth(props.lee.globalState);
            if (!auth) {
                reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
                return;
            }
            try {
                const recoveryEnabled = teamPolicies?.recoveryEnabled;
                props.lee.dispatch(actions.masterPasswordPoliciesSettingsLoaded({ recoveryEnabled }));
                const hasOutstandingRecoveryRequests = await hasPendingAccountRecoveryRequests();
                setHasOutstandingRequests(hasOutstandingRecoveryRequests);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsFetching(false);
            }
        };
        logPageView(PageView.TacSettingsAccountRecovery);
        fetchData();
    }, [shouldShowTrialDiscontinuedDialog, teamPolicies]);
    if (teamPoliciesStatus !== DataStatus.Success || !teamPolicies) {
        return null;
    }
    const toggleRecoveryEnabled = async (recoveryEnabled: boolean): Promise<void> => {
        setIsFetching(true);
        const teamId = getCurrentTeamId(props.lee.globalState);
        if (!teamId) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        try {
            await setTeamSettings({
                teamId,
                settings: {
                    recoveryEnabled,
                },
            });
            props.lee.dispatch(actions.setRecoveryEnabled(recoveryEnabled));
            showToast({
                id: 'toggleRecovery',
                description: recoveryEnabled
                    ? translate(I18N_KEYS.ALERT_LABEL_AVAILABLE)
                    : translate(I18N_KEYS.ALERT_LABEL_UNAVAILABLW),
                action: {
                    label: translate('common_alert_undo_action'),
                    onClick: () => {
                        toggleRecoveryEnabled(!recoveryEnabled);
                    },
                },
            });
            setIsFetching(false);
        }
        catch (error) {
            setIsFetching(false);
        }
    };
    const toggleConfirmationModal = async (): Promise<void> => {
        setDialogIsVisible((prevDialogIsVisible) => !prevDialogIsVisible);
    };
    const checkIfMasterPasswordIsValid = async (): Promise<void> => {
        setIsFetchingCheckMasterPassword(true);
        const isMasterPasswordValid = await checkIfMasterPasswordIsValidTrigger({
            masterPassword: masterPasswordFieldValue,
        });
        setIsFetchingCheckMasterPassword(false);
        if (isMasterPasswordValid) {
            await Promise.all([
                toggleConfirmationModal(),
                toggleRecoveryEnabled(!props.lee.state.recoveryEnabled),
            ]);
            setMasterPasswordFieldValue('');
            setIsMasterPasswordInvalid(false);
        }
        else {
            setIsMasterPasswordInvalid(true);
        }
    };
    const handleMasterPasswordFieldChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        setMasterPasswordFieldValue(event.target.value);
        setIsMasterPasswordInvalid(false);
    };
    const handleKeyPressed = async (event: KeyboardEvent): Promise<void> => {
        if (event.keyCode === 13 && masterPasswordFieldValue) {
            await checkIfMasterPasswordIsValid();
        }
    };
    const enabledAndHasOutstandingRequests = hasOutstandingRequests && props.lee.state.recoveryEnabled;
    return (<SettingsPage title={translate(I18N_KEYS.MENU_TITLE_ACCOUNT_RECOVERY)}>
      <div>
        <div sx={{ position: 'relative' }}>
          <Paragraph size="large" as="h3" sx={{
            fontWeight: 600,
            marginBottom: '8px',
            color: 'ds.text.neutral.catchy',
        }}>
            {translate(I18N_KEYS.SETTINGS_RECOVER_LABEL)}
          </Paragraph>
          <Paragraph sx={{ fontSize: 14, marginBottom: '40px', paddingRight: '80px' }}>
            {translate(I18N_KEYS.SETTINGS_RECOVER_LABEL_HELPER)}
          </Paragraph>
          <Toggle sx={{ position: 'absolute', top: 0, right: 0 }} disabled={isFetching || enabledAndHasOutstandingRequests} readOnly={!!shouldShowTrialDiscontinuedDialog} tooltip={shouldShowTrialDiscontinuedDialog
            ? translate(I18N_KEYS.TOOLTIP_RECOVERY_BLOCKED_DISCONTINUED)
            : undefined} checked={props.lee.state.recoveryEnabled} onChange={toggleConfirmationModal}/>
        </div>
        <Paragraph size="large" as="h3" sx={{
            fontWeight: 600,
            marginBottom: '24px',
            color: 'ds.text.neutral.catchy',
        }}>
          {translate(I18N_KEYS.SETTINGS_HOW_IT_WORKS_LABEL)}
        </Paragraph>
        <Stepper />
        <Paragraph sx={{
            fontSize: 14,
            lineHeight: '20px',
            marginBottom: '4px',
            color: 'ds.text.neutral.quiet',
        }}>
          {translate(I18N_KEYS.SETTINGS_HOW_IT_WORKS_LABEL_HELPER)}
        </Paragraph>
        <Link sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'ds.text.brand.standard',
        }} href={HELPCENTER_ADMIN_ASSISTED_ACCOUNT_RECOVERY_URL}>
          <FlexContainer as="span">
            {translate(I18N_KEYS.SETTINGS_HOW_IT_WORKS_LABEL_HELPER_LINK_TEXT)}
          </FlexContainer>
          <Icon name="ActionOpenExternalLinkOutlined" size="small" color="ds.text.brand.standard"/>
        </Link>
      </div>
      <ConfirmationDialog isOpen={dialogIsVisible} title={props.lee.state.recoveryEnabled
            ? translate(I18N_KEYS.DIALOG_TITLE_DISABLE)
            : translate(I18N_KEYS.DIALOG_TITLE_ENABLE)} labelDismiss={translate(I18N_KEYS.DIALOG_CTA_CANCEL_LABEL)} labelConfirm={props.lee.state.recoveryEnabled
            ? translate(I18N_KEYS.DIALOG_CTA_CONFIRM_LABEL_DISABLE)
            : translate(I18N_KEYS.DIALOG_CTA_CONFIRM_LABEL_ENABLE)} onDismiss={() => {
            setMasterPasswordFieldValue('');
            setIsMasterPasswordInvalid(false);
            setDialogIsVisible(false);
        }} onConfirm={() => checkIfMasterPasswordIsValid()} ctaIsDisabled={isFetchingCheckMasterPassword || !masterPasswordFieldValue} onChange={handleMasterPasswordFieldChanged} isMasterPasswordInvalid={isMasterPasswordInvalid} onKeyDown={(e) => {
            handleKeyPressed(e);
        }}>
        {props.lee.state.recoveryEnabled && (<div>
            <p className={settingsStyles.confirmationContent}>
              {translate.markup(I18N_KEYS.CONFIRMATION_DIALOG_DISABLE_LABEL_MARKUP)}
            </p>
            <p className={settingsStyles.confirmationContent}>
              {translate(I18N_KEYS.CONFIRMATION_DIALOG_DISABLE_SUBLABEL)}
            </p>
          </div>)}

        {!props.lee.state.recoveryEnabled && (<div>
            <p className={settingsStyles.confirmationContent}>
              {translate.markup(I18N_KEYS.CONFIRMATION_DIALOG_ENABLE_LABEL_MARKUP, {}, { linkTarget: '_blank' })}
            </p>
            <p className={settingsStyles.confirmationContent}>
              {translate(I18N_KEYS.CONFIRMATION_DIALOG_ENABLE_SUBLABEL)}
            </p>
          </div>)}
      </ConfirmationDialog>
    </SettingsPage>);
};
export default MasterPasswordPoliciesSettings;
