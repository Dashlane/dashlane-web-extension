import { createRef, MouseEvent, ReactNode, useEffect, useRef, useState, } from 'react';
import { equals } from 'ramda';
import { DataModelType, GroupRecipient, PremiumStatusSpace, UserRecipient, } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { isSuccess } from '@dashlane/framework-types';
import { useModuleCommands } from '@dashlane/framework-react';
import { Permission, sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { AlertSeverity } from '@dashlane/ui-components';
import { Credential, CredentialPreferences, OperationType, vaultItemsCrudApi, VaultItemType, vaultOrganizationApi, } from '@dashlane/vault-contracts';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useUpdateLinkedWebsites } from 'libs/carbon/hooks/use-update-linked-websites';
import useTranslate from 'libs/i18n/useTranslate';
import { getUrlSearchParams, useRouterGlobalSettingsContext, } from 'libs/router';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { EditPanel } from 'webapp/panel';
import { NavigateOutAction } from 'webapp/panel/edit/edit-panel';
import { ConfirmDeleteVaultItemDialog } from 'webapp/personal-data/edit/confirm-delete-vault-item-dialog';
import { ConfirmDiscardDialog } from 'webapp/personal-data/edit/discard';
import { GrapheneShareActions } from 'webapp/personal-data/edit/sharing/actions';
import { getCredentialSharing } from 'webapp/sharing-invite/helpers';
import { redirectBackToSharingCenterPanel } from 'webapp/sharing-center/utils';
import { SharedAccess } from 'webapp/shared-access';
import { ProtectedItemsUnlockerProps } from 'webapp/unlock-items/types';
import { logCredentialProtectionChange } from 'webapp/unlock-items/logs';
import { CredentialForm, CredentialFormRef, FormEditableData, FormReadOnlyData, } from 'webapp/credentials/form/credential-form';
import { getCredentialForceCategorizedSpace, SEARCH_PARAMS_TO_CREDENTIAL_TAB_MAP, } from 'webapp/credentials/helpers';
import { checkForDuplicateWebsites, checkIfLinkedWebsitesHaveBeenModified, sendLinkedWebsitesLogs, } from 'webapp/credentials/linked-websites/helpers';
import { LinkedWebsitesView } from 'webapp/credentials/linked-websites/linked-websites-view';
import { LinkedWebsitesSavedAlert } from 'webapp/credentials/linked-websites/linked-websites-saved-alert';
import { LinkedWebsitesDataLossPreventionDialog } from 'webapp/credentials/linked-websites/dialogs/linked-websites-dataloss-prevention-dialog';
import { LinkedWebsitesDuplicateDialog, LinkedWebsitesDuplicateDialogData, } from 'webapp/credentials/linked-websites/dialogs/linked-websites-duplicate-prevention-dialog';
import { PasswordHistoryButton } from './password-history/credentials-edit-password-history-button';
import { CredentialHealthBox } from './credential-health-box/credential-health-box';
import { FieldCollection } from '../form/collections-field/collections-field-context';
import { EditHeader } from './header/header';
import { CredentialTabs } from './types';
const { SHARED_ACCESS, ACCOUNT_DETAILS, LINKED_WEBSITES } = CredentialTabs;
const I18N_KEYS = {
    CHANGES_SAVED_TOAST: '_common_toast_changes_saved',
    CONFIRM_DELETE_CONFIRM: 'webapp_credential_edition_delete_confirm',
    CONFIRM_DELETE_DISMISS: 'webapp_credential_edition_delete_dismiss',
    CONFIRM_DELETE_SUBTITLE: 'webapp_credential_edition_confirm_delete_subtitle',
    CONFIRM_DELETE_TITLE: 'webapp_credential_edition_confirm_delete_title',
    LAST_ADMIN_ACTION_LABEL: 'webapp_credential_edition_change_permissions',
    LAST_ADMIN_TITLE: 'webapp_credential_edition_last_admin_title',
    LAST_ADMIN_SUBTITLE: 'webapp_credential_edition_last_admin_subtitle',
    GROUP_SHARING_TITLE: 'webapp_credential_edition_group_sharing_title',
    GROUP_SHARING_SUBTITLE: 'webapp_credential_edition_group_sharing_subtitle',
};
export interface Props {
    location?: {
        pathname: string;
        state: {
            entity: UserRecipient | GroupRecipient;
        };
    };
    activeSpaces: PremiumStatusSpace[];
    credential: Credential;
    credentialPreferences: CredentialPreferences;
    onClose: () => void;
    dashlaneDefinedLinkedWebsites: string[];
    isShared: boolean;
    isAdmin: boolean;
    isSharedViaUserGroup: boolean;
    isLastAdmin: boolean;
}
export const CredentialEditPanelComponent = ({ location, activeSpaces, credential, credentialPreferences, onClose, protectedItemsUnlockerShown, dashlaneDefinedLinkedWebsites, areProtectedItemsUnlocked, openProtectedItemsUnlocker, isShared, isAdmin, isSharedViaUserGroup, isLastAdmin, }: Props & ProtectedItemsUnlockerProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const alertContext = useAlert();
    const updateLinkedWebsitesAddedByUser = useUpdateLinkedWebsites();
    const { tempCredentialPreferencesUpdate, updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const { createCollection, updateCollection } = useModuleCommands(vaultOrganizationApi);
    const { addItemToCollections, removeItemFromCollections } = useModuleCommands(sharingCollectionsApi);
    const { shouldShowTrialDiscontinuedDialog: isDiscontinuedUser } = useTrialDiscontinuedDialogContext();
    const form = createRef<CredentialFormRef>();
    const getFormEditableData = (): FormEditableData => {
        return {
            alternativeUsername: credential.alternativeUsername ?? '',
            email: credential.email,
            itemName: credential.itemName,
            linkedURLs: credential.linkedURLs,
            note: credential.note,
            otpURL: credential.otpURL ?? '',
            otpSecret: credential.otpSecret ?? '',
            password: credential.password,
            spaceId: credential.spaceId,
            URL: credential.URL,
            username: credential.username,
            onlyAutofillExactDomain: credentialPreferences.onlyAutofillExactDomain,
            requireMasterPassword: credentialPreferences.requireMasterPassword,
            useAutoLogin: credentialPreferences.useAutoLogin,
        };
    };
    const [formEditableValues, setFormEditableValues] = useState(getFormEditableData());
    const getCredentialTabFromSearchParams = (): CredentialTabs => {
        const searchParams = getUrlSearchParams();
        return SEARCH_PARAMS_TO_CREDENTIAL_TAB_MAP[searchParams.get('tab') ?? 'account-details'];
    };
    const [activeTab, setActiveTab] = useState<CredentialTabs>(getCredentialTabFromSearchParams());
    const [switchTabTarget, setSwitchTabTarget] = useState(ACCOUNT_DETAILS);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [linkedWebsitesAddedByUser, setLinkedWebsitesAddedByUser] = useState<string[]>(credential.linkedURLs);
    const [shouldOpenLinkedWebsitesWithNewUrlField, setShouldOpenLinkedWebsitesWithNewUrlField,] = useState(false);
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] = useState(false);
    const [linkedWebsitesDuplicatePreventionData, setLinkedWebsitesDuplicatePreventionData,] = useState<LinkedWebsitesDuplicateDialogData[]>([]);
    const [displayLinkedWebsitesDataLossPreventionDialog, setDisplayLinkedWebsitesDataLossPreventionDialog,] = useState(false);
    const [displayConfirmDiscardDialog, setDisplayConfirmDiscardDialog] = useState(false);
    const [displayLinkedWebsitesDataSavedAlert, setDisplayLinkedWebsitesDataSavedAlert,] = useState(false);
    const [isUpdatePending, setIsUpdatePending] = useState(false);
    const [hasDialogsOpenedByChildren, setHasDialogsOpenedByChildren] = useState(false);
    const { current: deleteTranslations } = useRef({
        confirmDeleteConfirm: translate(I18N_KEYS.CONFIRM_DELETE_CONFIRM),
        confirmDeleteDismiss: translate(I18N_KEYS.CONFIRM_DELETE_DISMISS),
        confirmDeleteSubtitle: translate(I18N_KEYS.CONFIRM_DELETE_SUBTITLE),
        confirmDeleteTitle: translate(I18N_KEYS.CONFIRM_DELETE_TITLE),
        lastAdminActionLabel: translate(I18N_KEYS.LAST_ADMIN_ACTION_LABEL),
        lastAdminTitle: translate(I18N_KEYS.LAST_ADMIN_TITLE),
        lastAdminSubtitle: translate(I18N_KEYS.LAST_ADMIN_SUBTITLE),
        groupSharingTitle: translate(I18N_KEYS.GROUP_SHARING_TITLE),
        groupSharingSubtitle: translate(I18N_KEYS.GROUP_SHARING_SUBTITLE),
    });
    useEffect(() => {
        const linkedWebsitesDataHasBeenModified = checkIfLinkedWebsitesHaveBeenModified(linkedWebsitesAddedByUser, credential.linkedURLs);
        if (linkedWebsitesDataHasBeenModified) {
            setHasDataBeenModified(true);
        }
    }, [linkedWebsitesAddedByUser, credential.linkedURLs]);
    useEffect(() => {
        if (activeTab === ACCOUNT_DETAILS) {
            setFormEditableValues(getFormEditableData());
        }
    }, [activeTab]);
    useEffect(() => {
        const isFormDirty = !equals(formEditableValues, getFormEditableData());
        setHasDataBeenModified(isFormDirty);
    }, [formEditableValues]);
    if (isDiscontinuedUser === null) {
        return null;
    }
    const getFormReadOnlyData = (): FormReadOnlyData => {
        const limitedPermissions = isShared && !isAdmin;
        return {
            id: credential.id,
            forceCategorizedSpace: getCredentialForceCategorizedSpace(credential, activeSpaces),
            isDiscontinuedUser,
            limitedPermissions,
            linkedURLs: credential.linkedURLs,
        };
    };
    const getSecondaryActions = (): ReactNode[] => {
        if (activeTab === LINKED_WEBSITES) {
            return [];
        }
        return [
            <PasswordHistoryButton key="pwhist" credentialId={credential.id}/>,
            <GrapheneShareActions key="shareaction" id={credential.id} isShared={isShared} isAdmin={isAdmin} isDiscontinuedUser={isDiscontinuedUser} getSharing={getCredentialSharing}/>,
        ];
    };
    const handleEditedForm = (dirty: boolean): void => {
        setHasDataBeenModified(dirty);
    };
    const tryToSwitchTab = (newTargetTab: CredentialTabs): void => {
        if (hasDataBeenModified) {
            setSwitchTabTarget(newTargetTab);
            setDisplayConfirmDiscardDialog(true);
        }
        else {
            setActiveTab(newTargetTab);
        }
    };
    const goToSharingAccess = (): void => {
        tryToSwitchTab(SHARED_ACCESS);
    };
    const closeAllDialogs = (): void => {
        setDisplayConfirmDiscardDialog(false);
        setDisplayLinkedWebsitesDataLossPreventionDialog(false);
        setLinkedWebsitesDuplicatePreventionData([]);
    };
    const confirmDiscardAndChangeTab = (): void => {
        setActiveTab(switchTabTarget);
        setHasDataBeenModified(false);
        closeAllDialogs();
    };
    const openLinkedWebsitesView = (shouldOpenWithNewUrlField: boolean): void => {
        setShouldOpenLinkedWebsitesWithNewUrlField(shouldOpenWithNewUrlField);
        tryToSwitchTab(LINKED_WEBSITES);
    };
    const closeLinkedWebsitesView = (): void => {
        setActiveTab(ACCOUNT_DETAILS);
        setHasDataBeenModified(false);
        closeAllDialogs();
    };
    const closeLinkedWebsitesViewWithDatalossPrevention = (event?: MouseEvent<HTMLElement>): void => {
        event?.preventDefault();
        if (hasDataBeenModified) {
            setSwitchTabTarget(ACCOUNT_DETAILS);
            setDisplayLinkedWebsitesDataLossPreventionDialog(true);
        }
        else {
            closeLinkedWebsitesView();
        }
    };
    const saveAndCloseLinkedWebsites = (): void => {
        updateLinkedWebsitesAddedByUser(credential.id, linkedWebsitesAddedByUser);
        setDisplayLinkedWebsitesDataSavedAlert(true);
        sendLinkedWebsitesLogs(credential, linkedWebsitesAddedByUser);
        closeLinkedWebsitesView();
    };
    const handleClickOnSaveLinkedWebsites = async () => {
        const duplicateData = await checkForDuplicateWebsites(credential, linkedWebsitesAddedByUser);
        setLinkedWebsitesDuplicatePreventionData(duplicateData);
        if (activeTab === LINKED_WEBSITES && !duplicateData.length) {
            saveAndCloseLinkedWebsites();
        }
    };
    const isNewCollection = (collection: FieldCollection) => !collection.initiallyExisting && !collection.hasBeenDeleted;
    const isCollectionUntouched = (collection: FieldCollection) => collection.initiallyExisting && !collection.hasBeenDeleted;
    const handleCredentialCollections = async (credentialId: string, collections: FieldCollection[]) => {
        const sharedCollectionsToAddIds = [];
        const sharedCollectionsToRemoveIds = [];
        for (const collection of collections) {
            if (isCollectionUntouched(collection)) {
                continue;
            }
            if (collection.isShared) {
                if (isNewCollection(collection)) {
                    sharedCollectionsToAddIds.push(collection.id);
                }
                else {
                    sharedCollectionsToRemoveIds.push(collection.id);
                }
                continue;
            }
            collection.vaultItems = [
                {
                    id: credentialId,
                    type: DataModelType.KWAuthentifiant,
                },
            ];
            if (collection.id) {
                await updateCollection({
                    id: collection.id,
                    collection: collection,
                    operationType: collection.hasBeenDeleted
                        ? OperationType.SUBSTRACT_VAULT_ITEMS
                        : OperationType.APPEND_VAULT_ITEMS,
                });
            }
            else {
                await createCollection({
                    content: collection,
                });
            }
        }
        if (sharedCollectionsToAddIds.length) {
            await addItemToCollections({
                collectionIds: sharedCollectionsToAddIds,
                itemId: credentialId,
                shouldSkipSync: sharedCollectionsToRemoveIds.length > 0,
                defaultItemPermissions: Permission.Limited,
            });
        }
        if (sharedCollectionsToRemoveIds.length) {
            await removeItemFromCollections({
                collectionIds: sharedCollectionsToRemoveIds,
                itemId: credentialId,
            });
        }
    };
    const showSuccessAlert = () => {
        alertContext.showAlert(translate(I18N_KEYS.CHANGES_SAVED_TOAST), AlertSeverity.SUCCESS);
        onClose();
    };
    const showErrorAlert = () => {
        alertContext.showAlert(translate('_common_generic_error'), AlertSeverity.ERROR);
        onClose();
    };
    const handleSubmit = async (): Promise<void> => {
        if (activeTab === LINKED_WEBSITES) {
            handleClickOnSaveLinkedWebsites();
            return;
        }
        if (!form.current?.isFormValid()) {
            return;
        }
        const vaultItemCollections = form.current?.getVaultItemCollections();
        if (hasDataBeenModified && !vaultItemCollections) {
            return;
        }
        setIsUpdatePending(true);
        if (credentialPreferences &&
            formEditableValues.requireMasterPassword &&
            formEditableValues.requireMasterPassword !==
                credentialPreferences.requireMasterPassword) {
            logCredentialProtectionChange(formEditableValues.requireMasterPassword, credential.id, credential.URL, formEditableValues.spaceId ?? undefined);
        }
        try {
            const { onlyAutofillExactDomain, useAutoLogin, requireMasterPassword, ...credentialFormValues } = formEditableValues;
            const updateResult = await updateVaultItem({
                vaultItemType: VaultItemType.Credential,
                content: credentialFormValues,
                id: credential.id,
                shouldSkipSync: true,
            });
            if (!isSuccess(updateResult)) {
                return showErrorAlert();
            }
            const promises: Promise<any>[] = [
                tempCredentialPreferencesUpdate({
                    credentialId: credential.id,
                    onlyAutofillExactDomain,
                    useAutoLogin,
                    requireMasterPassword,
                    shouldSkipSync: vaultItemCollections?.some((collection) => collection.isShared && !isCollectionUntouched(collection)),
                }),
            ];
            if (vaultItemCollections) {
                promises.push(handleCredentialCollections(credential.id, vaultItemCollections));
            }
            await Promise.all(promises);
        }
        catch (_) {
            return showErrorAlert();
        }
        showSuccessAlert();
    };
    const closeEditPanel = (): void => {
        if (location?.state?.entity) {
            redirectBackToSharingCenterPanel({ routes, location });
            return;
        }
        onClose();
    };
    const handleNavigateOut = activeTab === LINKED_WEBSITES
        ? (action?: NavigateOutAction, event?: MouseEvent<HTMLElement>) => closeLinkedWebsitesViewWithDatalossPrevention(event)
        : closeEditPanel;
    const shouldNotCloseOnEscape = displayConfirmDeleteDialog || protectedItemsUnlockerShown;
    return (<EditPanel isUsingNewDesign isViewingExistingItem={true} itemHasBeenEdited={hasDataBeenModified} isSomeDialogOpen={displayLinkedWebsitesDataLossPreventionDialog ||
            linkedWebsitesDuplicatePreventionData.length > 0 ||
            displayConfirmDiscardDialog ||
            hasDialogsOpenedByChildren ||
            displayConfirmDeleteDialog} onSubmit={handleSubmit} secondaryActions={getSecondaryActions()} onNavigateOut={handleNavigateOut} onClickDelete={() => setDisplayConfirmDeleteDialog(true)} withoutDeleteButton={activeTab === LINKED_WEBSITES} withoutConfirmationDialog={activeTab === LINKED_WEBSITES} ignoreCloseOnEscape={shouldNotCloseOnEscape} formId="edit_credential_panel" submitPending={isUpdatePending} header={<EditHeader activeTab={activeTab} credential={credential} displayTabs={isShared} changeTab={tryToSwitchTab}/>}>
      {isShared && activeTab === SHARED_ACCESS ? (<SharedAccess isAdmin={isAdmin} id={credential.id}/>) : null}

      {activeTab === ACCOUNT_DETAILS ? (<div sx={{ flex: 1, flexDirection: 'column', position: 'relative' }}>
          <CredentialHealthBox credentialId={credential.id} isShared={isShared} hasLimitedPermission={!isAdmin}/>
          <div sx={{
                overflowY: 'initial',
                overflowX: 'visible',
            }}>
            <CredentialForm ref={form} activeSpaces={activeSpaces} editableValues={formEditableValues} setEditableValues={setFormEditableValues} readonlyValues={getFormReadOnlyData()} signalEditedValues={handleEditedForm} dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsites} areProtectedItemsUnlocked={areProtectedItemsUnlocked} openProtectedItemsUnlocker={openProtectedItemsUnlocker} protectedItemsUnlockerShown={protectedItemsUnlockerShown} onClickAddNewWebsite={() => openLinkedWebsitesView(true)} setHasOpenedDialogs={setHasDialogsOpenedByChildren}/>
          </div>
        </div>) : null}

      {activeTab === LINKED_WEBSITES ? (<LinkedWebsitesView credential={credential} dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsites} onClose={closeLinkedWebsitesViewWithDatalossPrevention} openWithNewUrlField={shouldOpenLinkedWebsitesWithNewUrlField} onUpdateLinkedWebsitesAddedByUser={setLinkedWebsitesAddedByUser} hasLimitedRights={isShared && !isAdmin}/>) : null}

      <ConfirmDeleteVaultItemDialog isVisible={displayConfirmDeleteDialog} itemId={credential.id} closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)} goToSharingAccess={goToSharingAccess} onDeletionSuccess={closeEditPanel} isShared={isShared} isSharedViaUserGroup={isSharedViaUserGroup} translations={deleteTranslations} vaultItemType={VaultItemType.Credential} isLastAdmin={isLastAdmin}/>

      {displayLinkedWebsitesDataLossPreventionDialog ? (<LinkedWebsitesDataLossPreventionDialog onCancel={() => setDisplayLinkedWebsitesDataLossPreventionDialog(false)} onLeavePageWithoutSaving={closeLinkedWebsitesView}/>) : null}

      {linkedWebsitesDuplicatePreventionData.length > 0 ? (<LinkedWebsitesDuplicateDialog duplicateData={linkedWebsitesDuplicatePreventionData} onCancel={() => setLinkedWebsitesDuplicatePreventionData([])} onSave={saveAndCloseLinkedWebsites}/>) : null}

      {displayConfirmDiscardDialog ? (<ConfirmDiscardDialog onDismissClick={() => setDisplayConfirmDiscardDialog(false)} onConfirmClick={confirmDiscardAndChangeTab}/>) : null}

      {displayLinkedWebsitesDataSavedAlert ? (<LinkedWebsitesSavedAlert onClose={() => setDisplayLinkedWebsitesDataSavedAlert(false)} setDisplayLinkedWebsitesDataSavedAlert={setDisplayLinkedWebsitesDataSavedAlert}/>) : null}
    </EditPanel>);
};
