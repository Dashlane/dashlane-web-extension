import * as React from 'react';
import { isGroupRecipient, MemberPermission, Recipient, } from '@dashlane/communication';
import { Dialog, DialogBody, DialogFooter, DialogTitle, jsx, } from '@dashlane/ui-components';
import { assertUnreachable } from 'libs/assert-unreachable';
import useTranslate from 'libs/i18n/useTranslate';
import { SharingPermissions } from 'webapp/sharing-permissions';
import { PermissionDialogStep } from 'webapp/shared-access/types';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
export const I18N_KEYS_PERMISSION_DIALOG = {
    CANCEL: 'webapp_shared_permissions_dialog_cancel',
    CHANGE_PERMISSIONS: 'webapp_shared_permissions_dialog_change_permissions',
    CONFIRM_REVOKE: 'webapp_shared_permissions_dialog_confirm_revoke',
    CONFIRM_REVOKE_TITLE: 'webapp_shared_permissions_dialog_confirm_revoke_title',
    EDIT_PERMISSIONS_TITLE: 'webapp_shared_permissions_dialog_edit_permissions_title',
    FAILURE: 'webapp_shared_permissions_dialog_failure',
    FAILURE_TITLE: 'webapp_shared_permissions_dialog_failure_title',
    LOADING: 'webapp_shared_permissions_dialog_loading',
    REVOKE_ACCESS: 'webapp_shared_permissions_dialog_revoke_access',
    REVOKE_SUCCESS: 'webapp_shared_permissions_dialog_revoke_success',
    REVOKE_SUCCESS_TITLE: 'webapp_shared_permissions_dialog_revoke_success_title',
    REVOKE_TITLE: 'webapp_shared_permissions_dialog_revoke_title',
    SUCCESS_FULL: 'webapp_shared_permissions_dialog_success_full',
    SUCCESS_LIMITED: 'webapp_shared_permissions_dialog_success_limited',
    SUCCESS_TITLE: 'webapp_shared_permissions_dialog_success_title',
    CLOSE: '_common_dialog_dismiss_button',
};
const { ConfirmRevoke, Failure, Permission, RevokeSuccess, Success } = PermissionDialogStep;
export interface Props {
    isOpen: boolean;
    loading?: boolean;
    onCancelRevoke: () => void;
    onConfirmRevoke: () => void;
    onDismiss: () => void;
    onSelectPermission: (permission: MemberPermission | 'revoke') => void;
    onValidatePermission: () => void;
    originPermission: MemberPermission | 'revoke';
    permission: MemberPermission | 'revoke';
    recipient: Recipient;
    step: PermissionDialogStep;
}
export const PermissionDialog = ({ isOpen, loading, onCancelRevoke, onConfirmRevoke, onDismiss, onSelectPermission, onValidatePermission, originPermission, permission, recipient, step, }: Props): JSX.Element => {
    const { translate } = useTranslate();
    const recipientName = isGroupRecipient(recipient)
        ? recipient.name
        : recipient.alias;
    function renderPermissionsContent() {
        return (<div sx={{ w: '600px', mt: '30px' }}>
        <SharingPermissions canRevoke={true} permission={permission} onSelectPermission={onSelectPermission} translate={translate} loading={loading}/>
      </div>);
    }
    function renderContent() {
        switch (step) {
            case ConfirmRevoke:
                return null;
            case Failure:
                return null;
            case Permission:
                return renderPermissionsContent();
            case Success:
                return null;
            case RevokeSuccess:
                return null;
            default:
                return assertUnreachable(step);
        }
    }
    function getPermissionDialogFooterProps() {
        return {
            primaryButtonTitle: translate(I18N_KEYS_PERMISSION_DIALOG.CHANGE_PERMISSIONS),
            primaryButtonOnClick: onValidatePermission,
            primaryButtonProps: {
                disabled: permission === originPermission || loading,
            },
            secondaryButtonTitle: translate(I18N_KEYS_PERMISSION_DIALOG.CANCEL),
            secondaryButtonOnClick: onDismiss,
            secondaryButtonProps: { disabled: loading },
        };
    }
    function getConfirmRevokeDialogFooterProps() {
        return {
            primaryButtonTitle: translate(I18N_KEYS_PERMISSION_DIALOG.REVOKE_ACCESS),
            primaryButtonOnClick: onConfirmRevoke,
            primaryButtonProps: { disabled: loading },
            secondaryButtonTitle: translate(I18N_KEYS_PERMISSION_DIALOG.CANCEL),
            secondaryButtonOnClick: onCancelRevoke,
            secondaryButtonProps: { disabled: loading },
            intent: 'danger',
        };
    }
    function getDialogFooterProps() {
        switch (step) {
            case ConfirmRevoke:
                return getConfirmRevokeDialogFooterProps();
            case Failure:
                return null;
            case Permission:
                return getPermissionDialogFooterProps();
            case Success:
                return null;
            case RevokeSuccess:
                return null;
            default:
                return assertUnreachable(step);
        }
    }
    function getSubtitle() {
        switch (step) {
            case ConfirmRevoke:
                return translate(I18N_KEYS_PERMISSION_DIALOG.CONFIRM_REVOKE, {
                    name: recipientName,
                });
            case Failure:
                return translate(I18N_KEYS_PERMISSION_DIALOG.FAILURE);
            case Permission:
                return null;
            case RevokeSuccess:
                return translate(I18N_KEYS_PERMISSION_DIALOG.REVOKE_SUCCESS, {
                    name: recipientName,
                });
            case Success:
                return permission === 'admin'
                    ? translate(I18N_KEYS_PERMISSION_DIALOG.SUCCESS_FULL, {
                        name: recipientName,
                    })
                    : translate(I18N_KEYS_PERMISSION_DIALOG.SUCCESS_LIMITED, {
                        name: recipientName,
                    });
            default:
                return assertUnreachable(step);
        }
    }
    function getTitle(): string {
        switch (step) {
            case ConfirmRevoke:
                return translate(I18N_KEYS_PERMISSION_DIALOG.CONFIRM_REVOKE_TITLE);
            case Failure:
                return translate(I18N_KEYS_PERMISSION_DIALOG.FAILURE_TITLE);
            case Permission:
                return translate(I18N_KEYS_PERMISSION_DIALOG.EDIT_PERMISSIONS_TITLE);
            case RevokeSuccess:
                return translate(I18N_KEYS_PERMISSION_DIALOG.REVOKE_SUCCESS_TITLE);
            case Success:
                return translate(I18N_KEYS_PERMISSION_DIALOG.SUCCESS_TITLE);
            default:
                return assertUnreachable(step);
        }
    }
    return (<Dialog closeIconName={translate(I18N_KEYS_PERMISSION_DIALOG.CLOSE)} modalContentClassName={allIgnoreClickOutsideClassName} isOpen={isOpen} onClose={onDismiss} disableOutsideClickClose>
      <DialogTitle title={getTitle()}>{getSubtitle()}</DialogTitle>
      <DialogBody>{renderContent()}</DialogBody>
      <DialogFooter {...getDialogFooterProps()}/>
    </Dialog>);
};
