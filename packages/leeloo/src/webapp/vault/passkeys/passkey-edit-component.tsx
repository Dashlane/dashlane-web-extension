import { useState } from 'react';
import { equals } from 'ramda';
import { useModuleCommands } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { Icon, jsx } from '@dashlane/design-system';
import { Passkey, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { AlertSeverity } from '@dashlane/ui-components';
import { EditPanel, PanelHeader } from 'webapp/panel';
import { redirect, useHistory } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { ConfirmDeleteVaultItemDialog } from 'webapp/personal-data/edit/confirm-delete-vault-item-dialog';
import { DeleteTranslations } from 'webapp/personal-data/edit/types';
import { PasskeyForm } from './passkey-form';
const I18N_KEYS = {
    DELETE_HEADER: 'webapp_passkey_edition_delete_header',
    DELETE_TEXT: 'webapp_passkey_edition_delete_text',
    DELETE_CONFIRM: 'webapp_passkey_edition_delete_confirm',
    DELETE_DISMISS: 'webapp_passkey_edition_delete_dismiss',
    NAME_DELETE: 'webapp_passkey_edition_name_delete_alert',
    NAME_UPDATE: 'webapp_passkey_edition_name_update_alert',
    GENERIC_ERROR: '_common_generic_error',
};
export interface PasskeyEditComponentProps {
    item: Passkey;
}
export const PasskeyEditPanelComponent = ({ item, }: PasskeyEditComponentProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] = useState(false);
    const history = useHistory();
    const editAlert = useAlert();
    const { spaceDetails } = useTeamSpaceContext();
    const [passkey, setPasskey] = useState<Passkey>(item);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const closeEditPanel = () => {
        redirect(routes.userPasskeys);
    };
    const deleteTranslations: DeleteTranslations = {
        confirmDeleteConfirm: translate(I18N_KEYS.DELETE_CONFIRM),
        confirmDeleteDismiss: translate(I18N_KEYS.DELETE_DISMISS),
        confirmDeleteSubtitle: translate(I18N_KEYS.DELETE_TEXT),
        confirmDeleteTitle: translate(I18N_KEYS.DELETE_HEADER),
        deleteSuccessToast: translate(I18N_KEYS.NAME_DELETE, {
            passkey: item.rpName,
        }),
    };
    const handleEditForm = (newContent: Passkey) => {
        setHasDataBeenModified(!equals(newContent, item));
        setPasskey(newContent);
    };
    const showGenericError = () => {
        editAlert.showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
    };
    const changeSpaceValueIfForcedDomainsEnabled = () => {
        if (spaceDetails?.info.forcedDomainsEnabled &&
            passkey.spaceId !== spaceDetails.teamId) {
            const associatedPasskeyEmailDomain = passkey.userDisplayName?.split('@')[1];
            if (spaceDetails.info.teamDomains.includes(associatedPasskeyEmailDomain)) {
                return spaceDetails.teamId;
            }
        }
        return passkey.spaceId;
    };
    const handleSubmit = async (): Promise<void> => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            const updateResult = await updateVaultItem({
                vaultItemType: VaultItemType.Passkey,
                content: {
                    ...passkey,
                    spaceId: changeSpaceValueIfForcedDomainsEnabled(),
                },
                id: item.id,
            });
            if (isSuccess(updateResult)) {
                const message = translate(I18N_KEYS.NAME_UPDATE, {
                    passkey: item.rpName,
                });
                editAlert.showAlert(message, AlertSeverity.SUCCESS);
                history.push(routes.userPasskeys);
            }
            else {
                setIsSubmitting(false);
                showGenericError();
            }
        }
        catch (error) {
            setIsSubmitting(false);
            showGenericError();
        }
    };
    return (<EditPanel itemHasBeenEdited={hasDataBeenModified} isViewingExistingItem={true} onNavigateOut={closeEditPanel} onClickDelete={() => setDisplayConfirmDeleteDialog(true)} onSubmit={handleSubmit} formId="edit_passkey_panel" header={<PanelHeader icon={<div sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '147px',
                    height: '98px',
                }}>
              <Icon name="PasskeyOutlined" size="xlarge" color="white"/>
            </div>} iconBackgroundColor="ds.container.expressive.brand.catchy.active" title={item.rpName}/>}>
      <PasskeyForm passkeyContent={passkey} signalEditedValues={handleEditForm} spaceDetails={spaceDetails}/>
      <ConfirmDeleteVaultItemDialog isVisible={displayConfirmDeleteDialog} itemId={item.id} closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)} onDeletionSuccess={closeEditPanel} translations={deleteTranslations} vaultItemType={VaultItemType.Passkey}/>
    </EditPanel>);
};
