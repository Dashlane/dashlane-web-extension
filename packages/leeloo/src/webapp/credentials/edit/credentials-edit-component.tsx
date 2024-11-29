import {
  createRef,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { equals } from "ramda";
import {
  DataModelType,
  GroupRecipient,
  PremiumStatusSpace,
  UserRecipient,
} from "@dashlane/communication";
import { useModuleCommands } from "@dashlane/framework-react";
import { Permission, sharingCollectionsApi } from "@dashlane/sharing-contracts";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  autofillSettingsApi,
  CredentialPreferences,
} from "@dashlane/autofill-contracts";
import {
  Credential,
  OperationType,
  vaultItemsCrudApi,
  VaultItemType,
  vaultOrganizationApi,
} from "@dashlane/vault-contracts";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { useUpdateLinkedWebsites } from "../../../libs/carbon/hooks/use-update-linked-websites";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  getUrlSearchParams,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { useIsB2CUserFrozen } from "../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
import { EditPanel } from "../../panel";
import { NavigateOutAction } from "../../panel/edit/edit-panel";
import { ConfirmDeleteVaultItemDialog } from "../../personal-data/edit/confirm-delete-vault-item-dialog";
import { ConfirmDiscardDialog } from "../../personal-data/edit/discard";
import { GrapheneShareActions } from "../../personal-data/edit/sharing/actions";
import { getCredentialSharing } from "../../sharing-invite/helpers";
import { redirectBackToSharingCenterPanel } from "../../sharing-center/utils";
import { SharedAccess } from "../../shared-access";
import { ProtectedItemsUnlockerProps } from "../../unlock-items/types";
import { logCredentialProtectionChange } from "../../unlock-items/logs";
import {
  CredentialForm,
  CredentialFormRef,
  FormEditableData,
  FormReadOnlyData,
} from "../form/credential-form";
import {
  getCredentialForceCategorizedSpace,
  SEARCH_PARAMS_TO_CREDENTIAL_TAB_MAP,
} from "../helpers";
import {
  checkForDuplicateWebsites,
  checkIfLinkedWebsitesHaveBeenModified,
  sendLinkedWebsitesLogs,
} from "../linked-websites/helpers";
import { LinkedWebsitesView } from "../linked-websites/linked-websites-view";
import { LinkedWebsitesSavedAlert } from "../linked-websites/linked-websites-saved-alert";
import { LinkedWebsitesDataLossPreventionDialog } from "../linked-websites/dialogs/linked-websites-dataloss-prevention-dialog";
import {
  LinkedWebsitesDuplicateDialog,
  LinkedWebsitesDuplicateDialogData,
} from "../linked-websites/dialogs/linked-websites-duplicate-prevention-dialog";
import { PasswordHistoryButton } from "./password-history/credentials-edit-password-history-button";
import { CredentialHealthBox } from "./credential-health-box/credential-health-box";
import { FieldCollection } from "../form/collections-field/collections-field-context";
import { EditHeader } from "./header/header";
import { CredentialTabs } from "./types";
import { SetupOtpCodeCard } from "./setup-otp-code/setup-otp-code-card";
import { FrozenLimitedRightsWarning } from "./frozen-limited-rights-warning/frozen-limited-rights-warning";
const { SHARED_ACCESS, ACCOUNT_DETAILS, LINKED_WEBSITES, OTP_SETUP } =
  CredentialTabs;
const I18N_KEYS = {
  CHANGES_SAVED_TOAST: "_common_toast_changes_saved",
  CONFIRM_DELETE_CONFIRM: "webapp_credential_edition_delete_confirm",
  CONFIRM_DELETE_DISMISS: "webapp_credential_edition_delete_dismiss",
  CONFIRM_DELETE_SUBTITLE: "webapp_credential_edition_confirm_delete_subtitle",
  CONFIRM_DELETE_TITLE: "webapp_credential_edition_confirm_delete_title",
  LAST_ADMIN_ACTION_LABEL: "webapp_credential_edition_change_permissions",
  LAST_ADMIN_TITLE: "webapp_credential_edition_last_admin_title",
  LAST_ADMIN_SUBTITLE: "webapp_credential_edition_last_admin_subtitle",
  GROUP_SHARING_TITLE: "webapp_credential_edition_group_sharing_title",
  GROUP_SHARING_SUBTITLE: "webapp_credential_edition_group_sharing_subtitle",
  COLLECTION_SHARING_TITLE:
    "webapp_credential_edition_collection_sharing_title",
  COLLECTION_SHARING_SUBTITLE:
    "webapp_credential_edition_collection_sharing_subtitle",
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
  isItemInCollection: boolean;
  isLastAdmin: boolean;
}
export const CredentialEditPanelComponent = ({
  location,
  activeSpaces,
  credential,
  credentialPreferences,
  onClose,
  protectedItemsUnlockerShown,
  dashlaneDefinedLinkedWebsites,
  areProtectedItemsUnlocked,
  openProtectedItemsUnlocker,
  isShared,
  isAdmin,
  isSharedViaUserGroup,
  isItemInCollection,
  isLastAdmin,
}: Props & ProtectedItemsUnlockerProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const alertContext = useAlert();
  const isClosing = useRef(false);
  const updateLinkedWebsitesAddedByUser = useUpdateLinkedWebsites();
  const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
  const { createCollection, updateCollection } =
    useModuleCommands(vaultOrganizationApi);
  const { addItemsToCollections, removeItemFromCollections } =
    useModuleCommands(sharingCollectionsApi);
  const { updateCredentialPreferences } =
    useModuleCommands(autofillSettingsApi);
  const { shouldShowFrozenStateDialog: isDiscontinuedUser } = useFrozenState();
  const isUserFrozen = useIsB2CUserFrozen();
  const form = createRef<CredentialFormRef>();
  const getFormEditableData = (): FormEditableData => {
    return {
      alternativeUsername: credential.alternativeUsername ?? "",
      email: credential.email,
      itemName: credential.itemName,
      linkedURLs: credential.linkedURLs,
      note: credential.note,
      otpURL: credential.otpURL ?? "",
      otpSecret: credential.otpSecret ?? "",
      password: credential.password,
      spaceId: credential.spaceId,
      URL: credential.URL,
      username: credential.username,
      onlyAutofillExactDomain: credentialPreferences.onlyAutofillExactDomain,
      requireMasterPassword: credentialPreferences.requireMasterPassword,
      useAutoLogin: credentialPreferences.useAutoLogin,
    };
  };
  const [formEditableValues, setFormEditableValues] = useState(
    getFormEditableData()
  );
  const getCredentialTabFromSearchParams = (): CredentialTabs => {
    const searchParams = getUrlSearchParams();
    return SEARCH_PARAMS_TO_CREDENTIAL_TAB_MAP[
      searchParams.get("tab") ?? "account-details"
    ];
  };
  const [activeTab, setActiveTab] = useState<CredentialTabs>(
    getCredentialTabFromSearchParams()
  );
  const [switchTabTarget, setSwitchTabTarget] = useState(ACCOUNT_DETAILS);
  const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
  const [hasOtpCodeBeenModified, setHasOtpCodeBeenModified] = useState(false);
  const [linkedWebsitesAddedByUser, setLinkedWebsitesAddedByUser] = useState<
    string[]
  >(credential.linkedURLs);
  const [
    shouldOpenLinkedWebsitesWithNewUrlField,
    setShouldOpenLinkedWebsitesWithNewUrlField,
  ] = useState(false);
  const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] =
    useState(false);
  const [
    linkedWebsitesDuplicatePreventionData,
    setLinkedWebsitesDuplicatePreventionData,
  ] = useState<LinkedWebsitesDuplicateDialogData[]>([]);
  const [
    displayLinkedWebsitesDataLossPreventionDialog,
    setDisplayLinkedWebsitesDataLossPreventionDialog,
  ] = useState(false);
  const [displayConfirmDiscardDialog, setDisplayConfirmDiscardDialog] =
    useState(false);
  const [
    displayLinkedWebsitesDataSavedAlert,
    setDisplayLinkedWebsitesDataSavedAlert,
  ] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [hasDialogsOpenedByChildren, setHasDialogsOpenedByChildren] =
    useState(false);
  const [hasDetailsChanged, setHasDetailsChanged] = useState(false);
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
    collectionSharingTitle: translate(I18N_KEYS.COLLECTION_SHARING_TITLE),
    collectionSharingSubtitle: translate(I18N_KEYS.COLLECTION_SHARING_SUBTITLE),
  });
  useEffect(() => {
    const linkedWebsitesDataHasBeenModified =
      checkIfLinkedWebsitesHaveBeenModified(
        linkedWebsitesAddedByUser,
        credential.linkedURLs
      );
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
    const {
      onlyAutofillExactDomain: onlyAutofillExactDomainEdited,
      requireMasterPassword: requireMasterPasswordEdited,
      useAutoLogin: useAutoLoginEdited,
      ...credentialDetailsEdited
    } = formEditableValues;
    const {
      onlyAutofillExactDomain,
      requireMasterPassword,
      useAutoLogin,
      ...credentialDetails
    } = getFormEditableData();
    const isFormDirty = !equals(formEditableValues, getFormEditableData());
    setHasDataBeenModified(isFormDirty);
    setHasDetailsChanged(!equals(credentialDetailsEdited, credentialDetails));
  }, [formEditableValues]);
  if (isDiscontinuedUser === null || isUserFrozen === null) {
    return null;
  }
  const getFormReadOnlyData = (): FormReadOnlyData => {
    const limitedPermissions = isShared && !isAdmin;
    return {
      id: credential.id,
      forceCategorizedSpace: getCredentialForceCategorizedSpace(
        credential,
        activeSpaces
      ),
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
      <PasswordHistoryButton key="pwhist" credentialId={credential.id} />,
      <GrapheneShareActions
        key="shareaction"
        id={credential.id}
        isShared={isShared}
        isAdmin={isAdmin}
        isDiscontinuedUser={isDiscontinuedUser}
        getSharing={getCredentialSharing}
      />,
    ];
  };
  const handleEditedForm = (dirty: boolean): void => {
    setHasDataBeenModified(dirty);
  };
  const tryToSwitchTab = (newTargetTab: CredentialTabs): void => {
    if (hasDataBeenModified) {
      setSwitchTabTarget(newTargetTab);
      setDisplayConfirmDiscardDialog(true);
    } else {
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
    setHasOtpCodeBeenModified(false);
    closeAllDialogs();
  };
  const goToSetup2FATab = () => {
    tryToSwitchTab(OTP_SETUP);
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
  const closeLinkedWebsitesViewWithDatalossPrevention = (
    event?: MouseEvent<HTMLElement>
  ): void => {
    event?.preventDefault();
    if (hasDataBeenModified) {
      setSwitchTabTarget(ACCOUNT_DETAILS);
      setDisplayLinkedWebsitesDataLossPreventionDialog(true);
    } else {
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
    const duplicateData = await checkForDuplicateWebsites(
      credential,
      linkedWebsitesAddedByUser
    );
    setLinkedWebsitesDuplicatePreventionData(duplicateData);
    if (activeTab === LINKED_WEBSITES && !duplicateData.length) {
      saveAndCloseLinkedWebsites();
    }
  };
  const isNewCollection = (collection: FieldCollection) =>
    !collection.initiallyExisting && !collection.hasBeenDeleted;
  const isCollectionUntouched = (collection: FieldCollection) =>
    collection.initiallyExisting && !collection.hasBeenDeleted;
  const handleCredentialCollections = async (
    credentialId: string,
    collections: FieldCollection[],
    url: string
  ) => {
    const sharedCollectionsToAdd = [];
    const sharedCollectionsToRemoveIds = [];
    for (const collection of collections) {
      if (isCollectionUntouched(collection)) {
        continue;
      }
      if (collection.isShared) {
        if (isNewCollection(collection)) {
          sharedCollectionsToAdd.push({
            collectionId: collection.id,
            permission: collection.itemPermission ?? Permission.Limited,
          });
        } else {
          sharedCollectionsToRemoveIds.push(collection.id);
        }
        continue;
      }
      collection.vaultItems = [
        {
          id: credentialId,
          type: DataModelType.KWAuthentifiant,
          url: url,
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
      } else {
        await createCollection({
          content: collection,
        });
      }
    }
    if (sharedCollectionsToAdd.length) {
      await addItemsToCollections({
        collectionPermissions: sharedCollectionsToAdd,
        itemIds: [credentialId],
        shouldSkipSync: sharedCollectionsToRemoveIds.length > 0,
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
    alertContext.showAlert(
      translate(I18N_KEYS.CHANGES_SAVED_TOAST),
      AlertSeverity.SUCCESS
    );
    onClose();
  };
  const showErrorAlert = () => {
    alertContext.showAlert(
      translate("_common_generic_error"),
      AlertSeverity.ERROR
    );
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
    if (
      credentialPreferences &&
      formEditableValues.requireMasterPassword &&
      formEditableValues.requireMasterPassword !==
        credentialPreferences.requireMasterPassword
    ) {
      logCredentialProtectionChange(
        formEditableValues.requireMasterPassword,
        credential.id,
        credential.URL,
        formEditableValues.spaceId ?? undefined
      );
    }
    try {
      const {
        onlyAutofillExactDomain,
        useAutoLogin,
        requireMasterPassword,
        ...credentialFormValues
      } = formEditableValues;
      const hasPreferencesChanged =
        onlyAutofillExactDomain !==
          credentialPreferences.onlyAutofillExactDomain ||
        useAutoLogin !== credentialPreferences.useAutoLogin ||
        requireMasterPassword !== credentialPreferences.requireMasterPassword;
      if (hasDetailsChanged) {
        await updateVaultItem({
          vaultItemType: VaultItemType.Credential,
          content: credentialFormValues,
          id: credential.id,
          shouldSkipSync: !!hasPreferencesChanged,
        });
      }
      if (hasPreferencesChanged) {
        await updateCredentialPreferences({
          credentialId: credential.id,
          credentialUrl: credential.URL,
          onlyAutofillExactDomain,
          useAutoLogin,
          requireMasterPassword,
          shouldSkipSync: vaultItemCollections?.some(
            (collection) =>
              collection.isShared && !isCollectionUntouched(collection)
          ),
        });
      }
      if (vaultItemCollections) {
        await handleCredentialCollections(
          credential.id,
          vaultItemCollections,
          credential.URL
        );
      }
    } catch (_) {
      return showErrorAlert();
    }
    showSuccessAlert();
  };
  const closeEditPanel = (): void => {
    if (isClosing.current) {
      return;
    }
    isClosing.current = true;
    if (location?.state?.entity) {
      redirectBackToSharingCenterPanel({ routes, location });
      return;
    }
    onClose();
  };
  const closeOtpSetupTab = () => {
    if (hasOtpCodeBeenModified) {
      setSwitchTabTarget(ACCOUNT_DETAILS);
      setDisplayConfirmDiscardDialog(true);
      return;
    }
    setActiveTab(ACCOUNT_DETAILS);
  };
  const submitOtpSetup = () => {
    setHasOtpCodeBeenModified(false);
    setActiveTab(ACCOUNT_DETAILS);
  };
  const handleNavigateOut = (
    action?: NavigateOutAction,
    event?: MouseEvent<HTMLElement>
  ) => {
    if (activeTab === LINKED_WEBSITES) {
      closeLinkedWebsitesViewWithDatalossPrevention(event);
      return;
    }
    if (activeTab === OTP_SETUP) {
      closeOtpSetupTab();
      return;
    }
    closeEditPanel();
  };
  const shouldNotCloseOnEscape =
    displayConfirmDeleteDialog || protectedItemsUnlockerShown;
  const shouldDisplayFrozenLimitedRightsWarning =
    isUserFrozen && getFormReadOnlyData().limitedPermissions;
  return (
    <EditPanel
      isUsingNewDesign
      isViewingExistingItem={true}
      itemHasBeenEdited={hasDataBeenModified}
      isSomeDialogOpen={
        displayLinkedWebsitesDataLossPreventionDialog ||
        linkedWebsitesDuplicatePreventionData.length > 0 ||
        displayConfirmDiscardDialog ||
        hasDialogsOpenedByChildren ||
        displayConfirmDeleteDialog
      }
      onSubmit={handleSubmit}
      secondaryActions={getSecondaryActions()}
      onNavigateOut={handleNavigateOut}
      onClickDelete={() => setDisplayConfirmDeleteDialog(true)}
      withoutDeleteButton={activeTab === LINKED_WEBSITES}
      withoutConfirmationDialog={activeTab === LINKED_WEBSITES}
      withoutCloseButton={activeTab === OTP_SETUP}
      ignoreCloseOnEscape={shouldNotCloseOnEscape}
      formId="edit_credential_panel"
      submitPending={isUpdatePending}
      header={
        <EditHeader
          credential={credential}
          displayTabs={isShared}
          changeTab={tryToSwitchTab}
          currentTab={activeTab}
        />
      }
    >
      {isShared && activeTab === SHARED_ACCESS ? (
        <div
          aria-labelledby="tab-credential-shared-access"
          id="content-credential-shared-access"
        >
          <SharedAccess isAdmin={isAdmin} id={credential.id} />
        </div>
      ) : null}

      {activeTab === ACCOUNT_DETAILS ? (
        <div
          sx={{ flex: 1, flexDirection: "column", position: "relative" }}
          aria-labelledby="tab-credential-detail"
          id="content-credential-detail"
        >
          {shouldDisplayFrozenLimitedRightsWarning ? (
            <FrozenLimitedRightsWarning />
          ) : (
            <CredentialHealthBox
              credentialId={credential.id}
              isShared={isShared}
              hasLimitedPermission={!isAdmin}
            />
          )}
          <div
            sx={{
              overflowY: "initial",
              overflowX: "visible",
            }}
          >
            <CredentialForm
              ref={form}
              activeSpaces={activeSpaces}
              editableValues={formEditableValues}
              setEditableValues={setFormEditableValues}
              readonlyValues={getFormReadOnlyData()}
              signalEditedValues={handleEditedForm}
              dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsites}
              areProtectedItemsUnlocked={areProtectedItemsUnlocked}
              openProtectedItemsUnlocker={openProtectedItemsUnlocker}
              protectedItemsUnlockerShown={protectedItemsUnlockerShown}
              onClickAddNewWebsite={() => openLinkedWebsitesView(true)}
              onClickSetup2FAToken={goToSetup2FATab}
              setHasOpenedDialogs={setHasDialogsOpenedByChildren}
            />
          </div>
        </div>
      ) : null}

      {activeTab === LINKED_WEBSITES ? (
        <LinkedWebsitesView
          credential={credential}
          dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsites}
          onClose={closeLinkedWebsitesViewWithDatalossPrevention}
          openWithNewUrlField={shouldOpenLinkedWebsitesWithNewUrlField}
          onUpdateLinkedWebsitesAddedByUser={setLinkedWebsitesAddedByUser}
          hasLimitedRights={isShared && !isAdmin}
        />
      ) : null}

      {activeTab === OTP_SETUP ? (
        <SetupOtpCodeCard
          credentialId={credential.id}
          title={credential.itemName}
          url={credential.URL}
          onClose={closeOtpSetupTab}
          onSubmit={submitOtpSetup}
          setHasDataBeenModified={setHasOtpCodeBeenModified}
        />
      ) : null}

      <ConfirmDeleteVaultItemDialog
        isVisible={displayConfirmDeleteDialog}
        itemId={credential.id}
        closeConfirmDeleteDialog={() => setDisplayConfirmDeleteDialog(false)}
        goToSharingAccess={goToSharingAccess}
        onDeletionSuccess={closeEditPanel}
        isShared={isShared}
        isSharedViaUserGroup={isSharedViaUserGroup}
        translations={deleteTranslations}
        vaultItemType={VaultItemType.Credential}
        isLastAdmin={isLastAdmin}
        isItemInCollection={isItemInCollection}
      />

      {displayLinkedWebsitesDataLossPreventionDialog ? (
        <LinkedWebsitesDataLossPreventionDialog
          onCancel={() =>
            setDisplayLinkedWebsitesDataLossPreventionDialog(false)
          }
          onLeavePageWithoutSaving={closeLinkedWebsitesView}
        />
      ) : null}

      {linkedWebsitesDuplicatePreventionData.length > 0 ? (
        <LinkedWebsitesDuplicateDialog
          duplicateData={linkedWebsitesDuplicatePreventionData}
          onCancel={() => setLinkedWebsitesDuplicatePreventionData([])}
          onSave={saveAndCloseLinkedWebsites}
        />
      ) : null}

      {displayConfirmDiscardDialog ? (
        <ConfirmDiscardDialog
          onDismissClick={() => setDisplayConfirmDiscardDialog(false)}
          onConfirmClick={confirmDiscardAndChangeTab}
        />
      ) : null}

      {displayLinkedWebsitesDataSavedAlert ? (
        <LinkedWebsitesSavedAlert
          onClose={() => setDisplayLinkedWebsitesDataSavedAlert(false)}
          setDisplayLinkedWebsitesDataSavedAlert={
            setDisplayLinkedWebsitesDataSavedAlert
          }
        />
      ) : null}
    </EditPanel>
  );
};
