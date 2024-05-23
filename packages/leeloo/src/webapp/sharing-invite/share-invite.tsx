import { useEffect, useState } from 'react';
import { GroupRecipient, Recipient, ShareItemResponse, UserRecipient, } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { OptionType, Origin, UserSharingSelectEvent } from '@dashlane/hermes';
import { shareItem } from 'libs/carbon/triggers';
import { logEvent } from 'libs/logs/logEvent';
import { CollectionsProvider } from 'webapp/vault/collections-context';
import { UnlockItemsDialog } from './unlock-items-dialog';
import { DetailedError, ItemsTabs, Sharing, SharingInviteStep } from './types';
import { ElementsStep } from './elements/elements';
import { FailureStep } from './failure/step';
import { PermissionStep } from './permission';
import { SharingItemsRecipientsStep } from './recipients/sharing-items-recipients-step';
import { ShareLoading } from './loading';
import { SharingSuccess } from './sharing-success';
import { UnlockCollectionDialog } from './unlock-collection-dialog';
import { checkForProtectedItems } from './helpers';
import { ShareCollection } from './share-collection';
import { Permission } from '@dashlane/sharing-contracts';
export interface SharingInviteProps {
    onDismiss: () => void;
    recipientsOnlyShowSelected: boolean | undefined;
    sharing: Sharing;
    origin: Origin;
}
export const SharingInvite = ({ onDismiss, recipientsOnlyShowSelected, sharing, origin, }: SharingInviteProps) => {
    const [credentialErrors, setCredentialErrors] = useState<DetailedError[]>([]);
    const [doRecipientsOnlyShowSelected, setDoRecipientsOnlyShowSelected] = useState(recipientsOnlyShowSelected ?? false);
    const [doElsOnlyShowSelected, setDoElsOnlyShowSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newUsers, setNewUsers] = useState<string[]>([]);
    const [noteErrors, setNoteErrors] = useState<DetailedError[]>([]);
    const [secretErrors, setSecretErrors] = useState<DetailedError[]>([]);
    const [permission, setPermission] = useState(sharing.permission);
    const [protectedItemsSelected, setProtectedItemsSelected] = useState(false);
    const [selectedCredentials, setSelectedCredentials] = useState(sharing?.selectedCredentials ?? []);
    const [selectedGroups, setSelectedGroups] = useState(sharing?.selectedGroups ?? []);
    const [selectedNotes, setSelectedNotes] = useState(sharing?.selectedNotes ?? []);
    const [selectedSecrets, setSelectedSecrets] = useState(sharing?.selectedSecrets ?? []);
    const [selectedUsers, setSelectedUsers] = useState(sharing?.selectedUsers ?? []);
    const [selectedPrivateCollections] = useState(sharing?.selectedPrivateCollections ?? []);
    const [step, setStep] = useState(sharing?.step);
    const [tab, setTab] = useState(sharing?.tab ?? ItemsTabs.Passwords);
    const itemsCount = selectedCredentials.length + selectedNotes.length + selectedSecrets.length;
    useEffect(() => {
        const checkProtectedCredentials = async () => {
            const areProtectedItemsSelected = await checkForProtectedItems(sharing?.selectedCredentials ?? [], sharing?.selectedNotes ?? []);
            setProtectedItemsSelected(areProtectedItemsSelected);
        };
        checkProtectedCredentials();
    }, [sharing]);
    const getUpdatedListAfterCheck = (items: string[], id: string, checked: boolean): string[] => {
        if (checked) {
            return [...items, id];
        }
        else {
            const index = items.indexOf(id);
            if (index === -1) {
                return items;
            }
            return [...items.slice(0, index), ...items.slice(index + 1)];
        }
    };
    const goToStep = (newStep: SharingInviteStep) => setStep(newStep);
    const onCheckCredential = async (credentialId: string, checked: boolean) => {
        const newCredentials = getUpdatedListAfterCheck(selectedCredentials, credentialId, checked);
        const newProtectedItemsSelected = await checkForProtectedItems(newCredentials, selectedNotes);
        setSelectedCredentials(newCredentials);
        setProtectedItemsSelected(newProtectedItemsSelected);
    };
    const onCheckGroup = (groupId: string, checked: boolean) => {
        logEvent(new UserSharingSelectEvent({
            optionType: OptionType.UserGroup,
        }));
        const newList = getUpdatedListAfterCheck(selectedGroups, groupId, checked);
        setSelectedGroups(newList);
    };
    const onCheckSecret = async (secretId: string, checked: boolean) => {
        const newSecrets = getUpdatedListAfterCheck(selectedSecrets, secretId, checked);
        setSelectedSecrets(newSecrets);
    };
    const onCheckNote = async (noteId: string, checked: boolean) => {
        const newNotes = getUpdatedListAfterCheck(selectedNotes, noteId, checked);
        const newProtectedItemsSelected = await checkForProtectedItems(selectedCredentials, newNotes);
        setSelectedNotes(newNotes);
        setProtectedItemsSelected(newProtectedItemsSelected);
    };
    const onCheckUser = (userId: string, checked: boolean) => {
        logEvent(new UserSharingSelectEvent({
            optionType: OptionType.User,
        }));
        const newList = getUpdatedListAfterCheck(selectedUsers, userId, checked);
        setSelectedUsers(newList);
    };
    const onSelectPermission = (selectedPermission: Permission) => setPermission(selectedPermission);
    const selectNotesTab = () => setTab(ItemsTabs.SecureNotes);
    const selectSecretsTab = () => setTab(ItemsTabs.Secrets);
    const selectPasswordsTab = () => setTab(ItemsTabs.Passwords);
    const getDetailedErrors = (results: ShareItemResponse[], selectedItemIds: string[]): DetailedError[] => results.reduce((detailedErrors, result, index) => {
        if (result.success) {
            return detailedErrors;
        }
        const itemId = selectedItemIds[index];
        const detailedError: DetailedError = { result, itemId: itemId };
        return [...detailedErrors, detailedError];
    }, []);
    const shareOneItem = (itemId: string, itemPermission: Permission, recipients: Recipient[]): Promise<ShareItemResponse> => shareItem(itemId, itemPermission, recipients);
    const shareAllItems = async () => {
        const userRecipients: UserRecipient[] = selectedUsers.map((alias) => ({
            type: 'user',
            alias,
        }));
        const groupRecipients = selectedGroups.map((groupId): GroupRecipient => ({ type: 'userGroup', groupId }));
        const recipients: Recipient[] = [...userRecipients, ...groupRecipients];
        const credentialsPromises = selectedCredentials.map((itemId: string) => shareOneItem(itemId, permission, recipients));
        const notesPromises = selectedNotes.map((itemId: string) => shareOneItem(itemId, permission, recipients));
        const secretsPromises = selectedSecrets.map((itemId: string) => shareOneItem(itemId, permission, recipients));
        if (itemsCount > 10) {
            goToStep(SharingInviteStep.Loading);
        }
        else {
            setIsLoading(true);
        }
        try {
            const credentialResults = await Promise.all(credentialsPromises);
            const noteResults = await Promise.all(notesPromises);
            const secretResults = await Promise.all(secretsPromises);
            const newCredentialErrors = getDetailedErrors(credentialResults, selectedCredentials);
            const newNoteErrors = getDetailedErrors(noteResults, selectedNotes);
            const newSecretErrors = getDetailedErrors(secretResults, selectedSecrets);
            if (newCredentialErrors.length > 0 ||
                newNoteErrors.length > 0 ||
                newSecretErrors.length > 0) {
                setCredentialErrors(newCredentialErrors);
                setNoteErrors(newNoteErrors);
                setSecretErrors(secretErrors);
                goToStep(SharingInviteStep.Failure);
            }
            else {
                goToStep(SharingInviteStep.Success);
            }
        }
        catch (_e) {
            goToStep(SharingInviteStep.Failure);
        }
        setIsLoading(false);
    };
    return (<div sx={{ minWidth: '600px' }}>
      {step === SharingInviteStep.UnlockProtectedItems ? (<UnlockItemsDialog goToStep={goToStep}/>) : null}

      {step === SharingInviteStep.UnlockProtectedCollection ? (<UnlockCollectionDialog goToStep={goToStep} onDismiss={onDismiss}/>) : null}

      {step === SharingInviteStep.Elements ? (<ElementsStep elementsOnlyShowSelected={doElsOnlyShowSelected} goToStep={goToStep} onCheckNote={onCheckNote} onCheckSecret={onCheckSecret} selectedCredentials={selectedCredentials} selectedNotes={selectedNotes} selectedSecrets={selectedSecrets} selectNotesTab={selectNotesTab} selectSecretsTab={selectSecretsTab} selectPasswordsTab={selectPasswordsTab} onCheckCredential={onCheckCredential} setElementsOnlyShowSelected={(event) => setDoElsOnlyShowSelected(event.currentTarget.checked)} tab={tab}/>) : null}

      {step === SharingInviteStep.Failure ? (<FailureStep credentialErrors={credentialErrors} itemsCount={itemsCount} isLoading={isLoading} noteErrors={noteErrors} onDismiss={onDismiss} shareAllItems={shareAllItems}/>) : null}

      {step === SharingInviteStep.Loading ? <ShareLoading /> : null}

      {step === SharingInviteStep.Permission ? (<PermissionStep goToStep={() => goToStep(SharingInviteStep.Recipients)} onClick={shareAllItems} isLoading={isLoading} permission={permission} onSelectPermission={onSelectPermission}/>) : null}

      {step === SharingInviteStep.Recipients ? (<SharingItemsRecipientsStep goToStep={goToStep} newUsers={newUsers} onCheckGroup={onCheckGroup} onCheckUser={onCheckUser} protectedItemsSelected={protectedItemsSelected} recipientsOnlyShowSelected={doRecipientsOnlyShowSelected} selectedGroups={selectedGroups} selectedUsers={selectedUsers} setNewUsers={setNewUsers} setSelectedUsers={setSelectedUsers} setRecipientsOnlyShowSelected={(event) => setDoRecipientsOnlyShowSelected(event.currentTarget.checked)}/>) : null}

      {step === SharingInviteStep.CollectionRecipients ||
            step === SharingInviteStep.CollectionItemPermissions ? (<CollectionsProvider>
          <ShareCollection step={step} goToStep={goToStep} newUsers={newUsers} onCheckGroup={onCheckGroup} onCheckUser={onCheckUser} recipientsOnlyShowSelected={doRecipientsOnlyShowSelected} selectedPrivateCollections={selectedPrivateCollections} selectedGroups={selectedGroups} selectedUsers={selectedUsers} setNewUsers={setNewUsers} setSelectedUsers={setSelectedUsers} setRecipientsOnlyShowSelected={(event) => setDoRecipientsOnlyShowSelected(event.currentTarget.checked)} setDoRecipientsOnlyShowSelected={setDoRecipientsOnlyShowSelected} onDismiss={onDismiss} origin={origin}/>
        </CollectionsProvider>) : null}

      {step === SharingInviteStep.Success ? (<SharingSuccess itemsCount={itemsCount} isLoading={isLoading} onDismiss={onDismiss}/>) : null}
    </div>);
};
