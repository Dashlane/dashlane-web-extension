import { useEffect } from 'react';
import { Recipient } from '@dashlane/communication';
import { LoadingIcon, WarningIcon } from '@dashlane/ui-components';
import { Button, jsx } from '@dashlane/design-system';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { CancelState } from './types';
export interface SharedAccessCancelProps {
    cancelStatus: CancelState | null;
    itemGroupId: string;
    setCancelStatus: (cancelStatus: CancelState | null) => void;
    recipientId: string;
}
const I18N_KEYS = {
    CANCEL: 'webapp_shared_access_cancel',
    CANCEL_FAIL: 'webapp_shared_access_cancel_failure',
    CANCEL_INVITE: 'webapp_shared_access_cancel_invitation',
    CONFIRM: 'webapp_shared_access_confirm',
    FULL_RIGHTS: 'webapp_sharing_permissions_full_rights',
    LIMITED_RIGHTS: 'webapp_sharing_permissions_limited_rights',
    PENDING: 'webapp_shared_access_pending_invitation',
};
export const SharedAccessCancel = ({ cancelStatus, itemGroupId, setCancelStatus, recipientId, }: SharedAccessCancelProps) => {
    const { translate } = useTranslate();
    const isCancelDisabled = cancelStatus === CancelState.Loading;
    const recipient: Recipient = { type: 'user', alias: recipientId };
    useEffect(() => {
        let timeout: number;
        if (cancelStatus === CancelState.Failure) {
            timeout = window.setTimeout(() => setCancelStatus(null), 2000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [cancelStatus, setCancelStatus]);
    const onRevokeAccess = async (): Promise<boolean> => {
        try {
            const { success } = await carbonConnector.revokeSharing({
                itemGroupId,
                recipient,
            });
            return success;
        }
        catch (_e) {
            return false;
        }
    };
    const onConfirmCancelInvite = async () => {
        setCancelStatus(CancelState.Loading);
        const success = await onRevokeAccess();
        setCancelStatus(success ? CancelState.Success : CancelState.Failure);
    };
    const cancelAction = cancelStatus
        ? () => setCancelStatus(null)
        : () => setCancelStatus(CancelState.Confirm);
    return cancelStatus === CancelState.Failure ? (<div sx={{
            color: 'ds.text.danger.standard',
            display: 'flex',
            alignItems: 'center',
        }}>
      <WarningIcon color="ds.text.danger.standard"/>
      &nbsp;{translate(I18N_KEYS.CANCEL_FAIL)}
    </div>) : (<div>
      <Button intensity={cancelStatus ? 'quiet' : 'supershy'} disabled={isCancelDisabled} onClick={cancelAction} size="small">
        {translate(cancelStatus ? I18N_KEYS.CANCEL : I18N_KEYS.CANCEL_INVITE)}
      </Button>
      {cancelStatus ? (<Button mood="danger" intensity="catchy" sx={{ ml: '16px' }} disabled={isCancelDisabled} size="small" onClick={() => onConfirmCancelInvite()}>
          {isCancelDisabled ? <LoadingIcon /> : translate(I18N_KEYS.CONFIRM)}
        </Button>) : null}
    </div>);
};
