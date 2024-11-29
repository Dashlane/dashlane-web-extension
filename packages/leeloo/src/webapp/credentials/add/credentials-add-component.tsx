import { createRef, useEffect, useRef, useState } from "react";
import { equals } from "ramda";
import { PageView } from "@dashlane/hermes";
import { AlertSeverity } from "@dashlane/ui-components";
import { DataModelType, PremiumStatusSpace } from "@dashlane/communication";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  Credential,
  OperationType,
  vaultItemsCrudApi,
  VaultItemType,
  vaultOrganizationApi,
} from "@dashlane/vault-contracts";
import { Permission, sharingCollectionsApi } from "@dashlane/sharing-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { logPageView } from "../../../libs/logs/logEvent";
import { usePasswordLimitPaywall } from "../../../libs/paywall/paywallContext";
import {
  getUrlSearchParams,
  redirect,
  useLocation,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { AddWebsiteRouteState } from "../../../app/routes/types";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { EditPanel } from "../../panel";
import { ProtectedItemsUnlockerProps } from "../../unlock-items/types";
import {
  CredentialForm,
  CredentialFormRef,
  FormEditableData,
  FormReadOnlyData,
} from "../form/credential-form";
import { PasswordLimitDialog } from "../header/password-limit-dialog";
import { AddHeader } from "./header";
import { autofillSettingsApi } from "@dashlane/autofill-contracts";
import { FieldCollection } from "../form/collections-field/collections-field-context";
export type SearchParamsAccepted = "name" | "website";
export const SEARCH_PARAMS_ACCEPTED_LIST: SearchParamsAccepted[] = [
  "name",
  "website",
];
const SEARCH_PARAMS_TO_VALUES_MAP: Record<
  SearchParamsAccepted,
  keyof Credential
> = {
  name: "itemName",
  website: "URL",
};
export interface Props extends ProtectedItemsUnlockerProps {
  activeSpaces: PremiumStatusSpace[];
  onClose: () => void;
}
export const CredentialAddPanelComponent = ({
  activeSpaces,
  onClose,
  protectedItemsUnlockerShown,
  openProtectedItemsUnlocker,
  areProtectedItemsUnlocked,
}: Props) => {
  const form = createRef<CredentialFormRef>();
  const [isSavePending, setIsSavePending] = useState(false);
  const { routes } = useRouterGlobalSettingsContext();
  const { currentSpaceId } = useTeamSpaceContext();
  const alertContext = useAlert();
  const { translate } = useTranslate();
  const usePasswordLimitResult = usePasswordLimitPaywall();
  const shouldShowAtOrOverLimitContent =
    !usePasswordLimitResult.isLoading &&
    usePasswordLimitResult.shouldShowAtOrOverLimitContent;
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const { createCollection, updateCollection } =
    useModuleCommands(vaultOrganizationApi);
  const { addItemsToCollections } = useModuleCommands(sharingCollectionsApi);
  const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
  const { updateCredentialPreferences } =
    useModuleCommands(autofillSettingsApi);
  const [isGoPremiumDialogOpen, setIsGoPremiumDialogOpen] = useState(false);
  const [hasDialogsOpenedByChildren, setHasDialogsOpenedByChildren] =
    useState(false);
  const location = useLocation<AddWebsiteRouteState>();
  const prefilledPasswordRef = useRef(
    location.state?.previouslyGeneratedPassword
  );
  const [hasDataBeenModified, setHasDataBeenModified] = useState(
    Boolean(prefilledPasswordRef.current)
  );
  const [hasDetailsChanged, setHasDetailsChanged] = useState(false);
  const isFormValid = () => Boolean(form.current?.isFormValid());
  const handleEditedForm = () => setHasDataBeenModified(true);
  const formReadonlyValues: FormReadOnlyData = {
    id: "",
    limitedPermissions: false,
    linkedURLs: [],
  };
  const getValuesFromSearchParams = (): Partial<Credential> => {
    const searchParams = getUrlSearchParams();
    return SEARCH_PARAMS_ACCEPTED_LIST.reduce((acc, key) => {
      acc[SEARCH_PARAMS_TO_VALUES_MAP[key] || key] = searchParams.get(key);
      return acc;
    }, {} as any);
  };
  const valuesFromSearchParams = getValuesFromSearchParams();
  const initialFormEditableValues: FormEditableData = {
    alternativeUsername: "",
    email: "",
    itemName: "",
    linkedURLs: [],
    note: "",
    otpURL: "",
    password: prefilledPasswordRef.current ?? "",
    spaceId:
      activeSpaces.length > 0 && !activeSpaces[0].info?.personalSpaceEnabled
        ? activeSpaces[0].teamId
        : currentSpaceId ?? "",
    username: "",
    ...valuesFromSearchParams,
    URL: location.state?.website ?? valuesFromSearchParams.URL,
    onlyAutofillExactDomain: false,
    requireMasterPassword: false,
    useAutoLogin: true,
  };
  const [formEditableValues, setFormEditableValues] = useState(
    initialFormEditableValues
  );
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
    } = initialFormEditableValues;
    const diff =
      !equals(formEditableValues, initialFormEditableValues) &&
      !shouldShowAtOrOverLimitContent;
    setHasDataBeenModified(diff);
    setHasDetailsChanged(!equals(credentialDetailsEdited, credentialDetails));
  }, [formEditableValues]);
  const openGoPremiumDialog = () => {
    setIsGoPremiumDialogOpen(true);
  };
  useEffect(() => {
    if (shouldShowAtOrOverLimitContent) {
      openGoPremiumDialog();
    }
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
      onClose();
    }
  }, [shouldShowAtOrOverLimitContent, shouldShowFrozenStateDialog]);
  useEffect(() => {
    logPageView(PageView.ItemCredentialCreate);
  }, []);
  const displayGenericError = () =>
    alertContext.showAlert(
      translate("_common_generic_error"),
      AlertSeverity.ERROR
    );
  const showListView = () => {
    logPageView(PageView.ItemCredentialList);
    if (isGoPremiumDialogOpen) {
      redirect(routes.userCredentials);
    } else if (onClose) {
      onClose();
    } else {
      redirect(routes.userCredentials);
    }
  };
  const saveAddedCredentialCollections = async (
    credentialId: string,
    collections: FieldCollection[]
  ) => {
    const sharedCollectionIds = [];
    for (const collection of collections) {
      if (collection.isShared) {
        sharedCollectionIds.push({
          collectionId: collection.id,
          permission: collection.itemPermission ?? Permission.Limited,
        });
        continue;
      }
      collection.vaultItems = [
        {
          id: credentialId,
          type: DataModelType.KWAuthentifiant,
          url: formEditableValues.URL,
        },
      ];
      if (collection.id) {
        await updateCollection({
          id: collection.id,
          collection,
          operationType: OperationType.APPEND_VAULT_ITEMS,
        });
      } else {
        await createCollection({
          content: collection,
        });
      }
    }
    if (sharedCollectionIds.length) {
      await addItemsToCollections({
        collectionPermissions: sharedCollectionIds,
        itemIds: [credentialId],
      });
    }
  };
  const saveCredential = async () => {
    const addedCollections = form.current?.getVaultItemCollections();
    const {
      onlyAutofillExactDomain,
      useAutoLogin,
      requireMasterPassword,
      ...credentialFormValues
    } = formEditableValues;
    const hasPreferencesChanged =
      onlyAutofillExactDomain !==
        initialFormEditableValues.onlyAutofillExactDomain ||
      useAutoLogin !== initialFormEditableValues.useAutoLogin ||
      requireMasterPassword !== initialFormEditableValues.requireMasterPassword;
    try {
      const createResult = await createVaultItem({
        vaultItemType: VaultItemType.Credential,
        content: credentialFormValues,
        shouldSkipSync: !!hasPreferencesChanged,
      });
      if (!isSuccess(createResult)) {
        displayGenericError();
        return;
      }
      const createdCredentialId = getSuccess(createResult).id;
      const promises: Promise<any>[] = [];
      if (hasPreferencesChanged) {
        promises.push(
          updateCredentialPreferences({
            credentialId: createdCredentialId,
            credentialUrl: credentialFormValues.URL,
            onlyAutofillExactDomain,
            useAutoLogin,
            requireMasterPassword,
            shouldSkipSync: addedCollections?.some((c) => c.isShared),
          })
        );
      }
      if (addedCollections?.length) {
        promises.push(
          saveAddedCredentialCollections(createdCredentialId, addedCollections)
        );
      }
      await Promise.all(promises);
    } catch (_) {
      displayGenericError();
    }
  };
  const handleSubmit = async (): Promise<void> => {
    if (!isFormValid()) {
      return;
    }
    setIsSavePending(true);
    await saveCredential();
    if (shouldShowAtOrOverLimitContent) {
      openGoPremiumDialog();
    } else {
      showListView();
    }
  };
  if (
    usePasswordLimitResult.isLoading ||
    shouldShowFrozenStateDialog === null
  ) {
    return null;
  }
  return (
    <EditPanel
      isUsingNewDesign
      isViewingExistingItem={false}
      isSomeDialogOpen={hasDialogsOpenedByChildren}
      itemHasBeenEdited={hasDataBeenModified}
      onSubmit={handleSubmit}
      onNavigateOut={showListView}
      formId="add_credential_panel"
      header={<AddHeader />}
      submitPending={isSavePending}
    >
      <CredentialForm
        ref={form}
        editableValues={formEditableValues}
        setEditableValues={setFormEditableValues}
        readonlyValues={formReadonlyValues}
        isNewItem={true}
        signalEditedValues={handleEditedForm}
        activeSpaces={activeSpaces}
        areProtectedItemsUnlocked={areProtectedItemsUnlocked}
        openProtectedItemsUnlocker={openProtectedItemsUnlocker}
        protectedItemsUnlockerShown={protectedItemsUnlockerShown}
        setHasOpenedDialogs={setHasDialogsOpenedByChildren}
      />
      {isGoPremiumDialogOpen && (
        <PasswordLimitDialog
          isVisible={isGoPremiumDialogOpen}
          handleDismiss={showListView}
        />
      )}
    </EditPanel>
  );
};
