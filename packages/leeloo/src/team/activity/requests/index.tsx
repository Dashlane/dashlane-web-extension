import { useCallback, useEffect, useState } from 'react';
import { MasterPasswordResetDemand } from '@dashlane/communication';
import { DataStatus } from '@dashlane/framework-react';
import { DialogFooter, jsx } from '@dashlane/ui-components';
import { Lee, LEE_INCORRECT_AUTHENTICATION } from 'lee';
import { getAuth as getUserAuth } from 'user';
import { acceptMasterPasswordResetDemand, declineMasterPasswordResetDemand, getMasterPasswordResetDemandList, } from 'libs/carbon/triggers';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import { LocaleFormat } from 'libs/i18n/helpers';
import { selectTeamAdminData } from 'libs/carbon/teamAdminData/selectors';
import Activity from 'team/activity';
import { useTeamPolicies } from 'team/settings/policies/hooks/use-team-policies';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { List } from './list';
import bellIcon from './bell.svg';
import styles from './styles.css';
const I18N_KEYS = {
    TABLE_EMPTY_LABEL: 'team_master_password_reset_table_empty_label',
    TABLE_EMPTY_HELPER: 'team_master_password_reset_table_empty_helper',
    DIALOG_ACCEPT_BUTTON_OK: 'team_master_password_reset_dialog_accept_button_ok',
    DIALOG_ACCEPT_BUTTON_CANCEL: 'team_master_password_reset_dialog_accept_button_cancel',
    DIALOG_ACCEPT_TITLE: 'team_master_password_reset_dialog_accept_title',
    DIALOG_ACCEPT_CONTENT_BOLD: 'team_master_password_reset_dialog_accept_content_bold',
    DIALOG_ACCEPT_CONTENT: 'team_master_password_reset_dialog_accept_content',
    DIALOG_DECLINE_BUTTON_OK: 'team_master_password_reset_dialog_decline_button_ok',
    DIALOG_DECLINE_BUTTON_CANCEL: 'team_master_password_reset_dialog_decline_button_cancel',
    DIALOG_DECLINE_TITLE: 'team_master_password_reset_dialog_decline_title',
    DIALOG_DECLINE_CONTENT_BOLD: 'team_master_password_reset_dialog_decline_content_bold',
    DIALOG_DECLINE_CONTENT: 'team_master_password_reset_dialog_decline_content',
};
interface Props {
    lee: Lee;
}
interface DialogState {
    dialogType: 'accept' | 'decline' | null;
    dialogIsVisible: boolean;
    selectedRequest: MasterPasswordResetDemand | null;
}
const RequestsActivity = ({ lee }: Props) => {
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { status: teamPoliciesStatus, data: teamPolicies } = useTeamPolicies();
    const emptyDialogState: DialogState = {
        dialogIsVisible: false,
        dialogType: null,
        selectedRequest: null,
    };
    const [dialogState, setDialogState] = useState<DialogState>(emptyDialogState);
    const getAuth = useCallback(() => {
        const auth = getUserAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
        }
        return auth;
    }, []);
    const fetchRequests = useCallback(async () => {
        const auth = getAuth();
        if (auth?.teamId) {
            await getMasterPasswordResetDemandList({ teamId: auth.teamId });
        }
    }, [getAuth]);
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setIsLoading(true);
                if (teamPolicies?.recoveryEnabled) {
                    await fetchRequests();
                    setIsLoading(false);
                }
            }
            catch (error) {
                console.error(`RequestsActivity - fetchStatus failed with error ${error}`);
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [fetchRequests, teamPolicies]);
    if (teamPoliciesStatus !== DataStatus.Success || !teamPolicies) {
        return null;
    }
    const getRequests = (): MasterPasswordResetDemand[] => {
        const auth = getAuth();
        if (!auth) {
            return [];
        }
        const { teams } = selectTeamAdminData(lee.globalState);
        const { teamId } = auth;
        if (teamId === null || teamId === undefined) {
            return [];
        }
        return teams[teamId]?.notifications?.accountRecoveryRequests ?? [];
    };
    const showAcceptConfirmation = (request: MasterPasswordResetDemand) => {
        setDialogState({
            dialogIsVisible: true,
            dialogType: 'accept',
            selectedRequest: request,
        });
    };
    const showDeclineConfirmation = (request: MasterPasswordResetDemand) => {
        setDialogState({
            dialogIsVisible: true,
            dialogType: 'decline',
            selectedRequest: request,
        });
    };
    const acceptRequest = (): void => {
        const auth = getAuth();
        if (auth && dialogState.selectedRequest) {
            acceptMasterPasswordResetDemand({
                login: dialogState.selectedRequest.login,
                recoveryKey: dialogState.selectedRequest.recoveryClientKey,
                userPublicKey: dialogState.selectedRequest.publicKey,
            })
                .then(() => {
                fetchRequests();
                setDialogState(emptyDialogState);
            })
                .catch((error: string) => {
                console.error(error);
            });
        }
    };
    const declineRequest = async () => {
        const auth = getUserAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        if (!dialogState.selectedRequest) {
            return;
        }
        try {
            await declineMasterPasswordResetDemand({
                login: dialogState.selectedRequest.login,
            });
            fetchRequests();
            setDialogState(emptyDialogState);
        }
        catch (error) {
            console.error(error);
        }
    };
    const dateFormatter = (date: Date) => {
        return [
            translate.shortDate(date, LocaleFormat.l),
            translate.shortDate(date, LocaleFormat.LT),
        ].join(' - ');
    };
    const getList = () => {
        const requests = getRequests();
        return requests.length ? (<div className={styles.container}>
        <List onAccept={showAcceptConfirmation} onDecline={showDeclineConfirmation} dateFormatter={dateFormatter} requests={requests}/>
      </div>) : (<div className={styles.containerNoItem}>
        <img src={bellIcon}/>
        <div className={styles.noItemLabel}>
          {translate(I18N_KEYS.TABLE_EMPTY_LABEL)}
        </div>
        <div className={styles.noItemHelper}>
          {translate(I18N_KEYS.TABLE_EMPTY_HELPER)}
        </div>
      </div>);
    };
    const dismissAcceptDialog = () => {
        setDialogState(emptyDialogState);
    };
    const dismissDeclineDialog = () => {
        setDialogState(emptyDialogState);
    };
    return (<Activity isLoading={isLoading}>
      {getList()}

      <SimpleDialog isOpen={dialogState.dialogIsVisible && dialogState.dialogType === 'accept'} onRequestClose={dismissAcceptDialog} footer={<DialogFooter intent="primary" primaryButtonTitle={translate(I18N_KEYS.DIALOG_ACCEPT_BUTTON_OK)} primaryButtonOnClick={acceptRequest} secondaryButtonTitle={translate(I18N_KEYS.DIALOG_ACCEPT_BUTTON_CANCEL)} secondaryButtonOnClick={dismissAcceptDialog}/>} title={translate(I18N_KEYS.DIALOG_ACCEPT_TITLE)}>
        {dialogState.selectedRequest?.login ? (<p className={styles.dialogContentStrong}>
            {translate(I18N_KEYS.DIALOG_ACCEPT_CONTENT_BOLD, {
                login: dialogState.selectedRequest.login,
            })}
          </p>) : null}
        <p className={styles.dialogContent}>
          {translate(I18N_KEYS.DIALOG_ACCEPT_CONTENT)}
        </p>
      </SimpleDialog>
      <SimpleDialog isOpen={dialogState.dialogIsVisible && dialogState.dialogType === 'decline'} onRequestClose={dismissDeclineDialog} footer={<DialogFooter intent="danger" primaryButtonTitle={translate(I18N_KEYS.DIALOG_DECLINE_BUTTON_OK)} primaryButtonOnClick={declineRequest} secondaryButtonTitle={translate(I18N_KEYS.DIALOG_DECLINE_BUTTON_CANCEL)} secondaryButtonOnClick={dismissDeclineDialog}/>} title={translate(I18N_KEYS.DIALOG_DECLINE_TITLE)}>
        {dialogState.selectedRequest?.login ? (<p className={styles.dialogContentStrong}>
            {translate(I18N_KEYS.DIALOG_DECLINE_CONTENT_BOLD, {
                login: dialogState.selectedRequest?.login ?? '',
            })}
          </p>) : null}
        <p className={styles.dialogContent}>
          {translate(I18N_KEYS.DIALOG_DECLINE_CONTENT)}
        </p>
      </SimpleDialog>
    </Activity>);
};
export default RequestsActivity;
