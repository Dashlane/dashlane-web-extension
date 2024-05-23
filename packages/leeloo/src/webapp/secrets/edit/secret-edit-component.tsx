import React, { useState } from 'react';
import { GroupRecipient, UserRecipient } from '@dashlane/communication';
import { Secret, VaultItemType } from '@dashlane/vault-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { redirectBackToSharingCenterPanel } from 'webapp/sharing-center/utils';
import { SecretsTabs } from 'webapp/secrets/edit/types';
import { GrapheneShareActions } from 'webapp/personal-data/edit/sharing/actions';
import { ConfirmDeleteVaultItemDialog } from 'webapp/personal-data/edit/confirm-delete-vault-item-dialog';
import { EditPanel } from 'webapp/panel';
import { getSecretSharing } from 'webapp/sharing-invite/helpers';
import { SecretForm } from 'webapp/secrets/form/secret-form';
import { SecretOptions } from '../form/secret-options';
import { Header } from 'webapp/secrets/form/header';
import { CopyButton } from 'libs/dashlane-style/copy-button';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { DataStatus } from '@dashlane/framework-react';
import { useSharedAccessData } from 'webapp/shared-access/hooks/use-shared-access-data';
const { CONTENT } = SecretsTabs;
const I18N_KEYS = {
    DELETE_CONFIRM: 'webapp_secure_notes_edition_delete_confirm',
    DELETE_DISMISS: 'webapp_credential_edition_delete_dismiss',
    DELETE_SUBTITLE: 'webapp_credential_edition_confirm_delete_subtitle',
    DELETE_TITLE: 'webapp_secure_notes_edition_delete_title',
    LAST_ADMIN_ACTION: 'webapp_credential_edition_change_permissions',
    LAST_ADMIN_TITLE: 'webapp_credential_edition_last_admin_title',
    LAST_ADMIN_SUBTITLE: 'webapp_credential_edition_last_admin_subtitle',
    GROUP_SHARING_TITLE: 'webapp_secure_notes_edition_group_sharing_title',
    GROUP_SHARING_SUBTITLE: 'webapp_credential_edition_group_sharing_subtitle',
    GENERIC_ERROR_TITLE: 'webapp_account_recovery_generic_error_title',
    GENERIC_ERROR_SUBTITLE: 'webapp_account_recovery_generic_error_subtitle',
    GENERIC_COPY: 'webapp_credential_edition_field_generic_action_copy',
};
export interface Props {
    location?: {
        pathname: string;
        state: {
            entity: UserRecipient | GroupRecipient;
        };
    };
    secret: Secret;
    isShared: boolean;
    isAdmin: boolean;
    isSharedViaUserGroup: boolean;
    isLastAdmin: boolean;
}
export const SecretEditPanelComponent = ({ location, secret, isShared, isAdmin, isSharedViaUserGroup, isLastAdmin, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const [activeTab, setActiveTab] = useState(CONTENT);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [secretOptions] = useState<SecretOptions | null>(null);
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] = useState(false);
    const [isUpdatePending, setIsUpdatePending] = useState(false);
    const [content, setContent] = useState(() => secret.content);
    const [title, setTitle] = useState(() => secret.title);
    const { data: sharedAccessData, status } = useSharedAccessData(secret.id);
    const { shouldShowTrialDiscontinuedDialog: isDiscontinuedUser } = useTrialDiscontinuedDialogContext();
    const closeEditPanel = (): void => {
        if (location?.state?.entity) {
            redirectBackToSharingCenterPanel({ routes, location });
            return;
        }
        redirect(routes.userSecrets);
    };
    if (!secret) {
        closeEditPanel();
        return null;
    }
    const handleSubmit = async (): Promise<void> => {
        setIsUpdatePending(true);
        const options = secretOptions ?? { spaceId: secret.spaceId ?? '' };
        await carbonConnector.updateSecret({
            content: content,
            title: title,
            id: secret.id,
            ...options,
        });
        setIsUpdatePending(false);
        closeEditPanel();
    };
    const saveSecretOptions = (options: SecretOptions) => {
        const { spaceId } = options;
        carbonConnector.updateSecret({
            id: secret.id,
            spaceId: spaceId ?? '',
        });
    };
    const goToSharingAccess = (): void => {
        setActiveTab(SecretsTabs.SHARED_ACCESS);
    };
    const onModifyData = () => setHasDataBeenModified(true);
    const deleteTranslations = {
        confirmDeleteConfirm: translate(I18N_KEYS.DELETE_CONFIRM),
        confirmDeleteDismiss: translate(I18N_KEYS.DELETE_DISMISS),
        confirmDeleteSubtitle: translate(I18N_KEYS.DELETE_SUBTITLE),
        confirmDeleteTitle: translate(I18N_KEYS.DELETE_TITLE),
        lastAdminActionLabel: translate(I18N_KEYS.LAST_ADMIN_ACTION),
        lastAdminTitle: translate(I18N_KEYS.LAST_ADMIN_TITLE),
        lastAdminSubtitle: translate(I18N_KEYS.LAST_ADMIN_SUBTITLE),
        groupSharingTitle: translate(I18N_KEYS.GROUP_SHARING_TITLE),
        groupSharingSubtitle: translate(I18N_KEYS.GROUP_SHARING_SUBTITLE),
        genericErrorTitle: I18N_KEYS.GENERIC_ERROR_TITLE,
        genericErrorSubtitle: I18N_KEYS.GENERIC_ERROR_SUBTITLE,
    };
    if (isDiscontinuedUser === null) {
        return null;
    }
    const getSecondaryActions = () => {
        switch (activeTab) {
            case CONTENT:
                return [
                    <GrapheneShareActions key="shareaction" id={secret.id} isShared={isShared} isAdmin={isAdmin} isDiscontinuedUser={isDiscontinuedUser} getSharing={getSecretSharing}/>,
                    <CopyButton key="copyaction" copyValue={content} buttonText={translate(I18N_KEYS.GENERIC_COPY)}/>,
                ];
            default:
                return [];
        }
    };
    const getRecipientsCount = (): number => {
        if (!isShared) {
            return 0;
        }
        return status === DataStatus.Success ? sharedAccessData.count : 0;
    };
    const data = {
        content: secret.content,
        id: secret.id,
        limitedPermissions: isShared && !isAdmin,
        spaceId: secret.spaceId,
        title: secret.title,
    };
    const recipientsCount = getRecipientsCount();
    return (<EditPanel isViewingExistingItem={true} itemHasBeenEdited={hasDataBeenModified} onSubmit={handleSubmit} submitPending={isUpdatePending} secondaryActions={getSecondaryActions()} onNavigateOut={closeEditPanel} onClickDelete={() => setDisplayConfirmDeleteDialog(true)} ignoreCloseOnEscape={displayConfirmDeleteDialog} isSomeDialogOpen={displayConfirmDeleteDialog} formId="edit_secret_panel" header={<Header activeTab={activeTab} displaySharedAccess={isShared} recipientsCount={recipientsCount} setActiveTab={setActiveTab} disabled={isShared && !isAdmin} title={title} setTitle={(title) => {
                onModifyData();
                setTitle(title);
            }}/>}>
      <SecretForm activeTab={activeTab} data={data} content={content} setContent={setContent} isAdmin={isAdmin} onModifyData={onModifyData} saveSecretOptions={saveSecretOptions}/>

      <ConfirmDeleteVaultItemDialog isVisible={displayConfirmDeleteDialog} itemId={secret.id} closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)} goToSharingAccess={goToSharingAccess} onDeletionSuccess={closeEditPanel} translations={deleteTranslations} vaultItemType={VaultItemType.Secret} isShared={isShared} isLastAdmin={isLastAdmin} isSharedViaUserGroup={isSharedViaUserGroup}/>
    </EditPanel>);
};
