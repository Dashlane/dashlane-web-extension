import { useState } from "react";
import {
  GroupRecipient,
  Recipient,
  ShareItemResponse,
  UserRecipient,
} from "@dashlane/communication";
import {
  Permission,
  ShareItemsErrorType,
  SharingItemsFeatureFlips,
} from "@dashlane/sharing-contracts";
import { getFailure, isFailure } from "@dashlane/framework-types";
import { Origin } from "@dashlane/hermes";
import { useFeatureFlip } from "@dashlane/framework-react";
import { shareItem } from "../../libs/carbon/triggers";
import { CollectionsProvider } from "../collections/collections-context";
import { UnlockItemsDialog } from "./unlock-items-dialog";
import { DetailedError, ItemsTabs, Sharing, SharingInviteStep } from "./types";
import { ElementsStep } from "./elements/elements";
import { FailureStep } from "./failure/step";
import { PermissionStep } from "./permission";
import { SharingItemsRecipientsStep } from "./recipients/sharing-items-recipients-step";
import { ShareLoading } from "./loading";
import { SharingSuccess } from "./sharing-success";
import { UnlockCollectionDialog } from "./unlock-collection-dialog";
import { ShareCollection } from "../sharing-collection/share-collection";
import { useShareItems } from "./hooks/use-share-items";
import { ShareInviteFailureStep } from "./failure/share-invite-failure-step";
import { useMultiselectContext } from "../list-view/multi-select/multi-select-context";
export interface SharingInviteProps {
  onDismiss: () => void;
  recipientsOnlyShowSelected: boolean | undefined;
  sharing: Sharing;
  origin: Origin;
}
export const SharingInvite = ({
  onDismiss,
  recipientsOnlyShowSelected,
  sharing,
  origin,
}: SharingInviteProps) => {
  const { getSelectedItems } = useMultiselectContext();
  const [limitExceededError, setLimitExceededError] = useState<boolean>(false);
  const [credentialErrors, setCredentialErrors] = useState<DetailedError[]>([]);
  const [noteErrors, setNoteErrors] = useState<DetailedError[]>([]);
  const [secretErrors, setSecretErrors] = useState<DetailedError[]>([]);
  const [doRecipientsOnlyShowSelected, setDoRecipientsOnlyShowSelected] =
    useState(recipientsOnlyShowSelected ?? false);
  const [doElsOnlyShowSelected, setDoElsOnlyShowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUsers, setNewUsers] = useState<string[]>([]);
  const [permission, setPermission] = useState(sharing.permission);
  const [step, setStep] = useState(sharing?.step);
  const [tab, setTab] = useState(sharing?.tab ?? ItemsTabs.Passwords);
  const selectedCredentials = getSelectedItems(["credentials"]);
  const selectedNotes = getSelectedItems(["notes"]);
  const selectedSecrets = getSelectedItems(["secrets"]);
  const itemsCount =
    selectedCredentials.length + selectedNotes.length + selectedSecrets.length;
  const { shareItems } = useShareItems();
  const shareItemsGrapheneFF = useFeatureFlip(
    SharingItemsFeatureFlips.SharingItemsGrapheneMigrationDev
  );
  const goToStep = (newStep: SharingInviteStep) => setStep(newStep);
  const onSelectPermission = (selectedPermission: Permission) =>
    setPermission(selectedPermission);
  const selectNotesTab = () => setTab(ItemsTabs.SecureNotes);
  const selectSecretsTab = () => setTab(ItemsTabs.Secrets);
  const selectPasswordsTab = () => setTab(ItemsTabs.Passwords);
  const getDetailedErrors = (
    results: ShareItemResponse[],
    selectedItemIds: string[]
  ): DetailedError[] =>
    results.reduce((detailedErrors, result, index) => {
      if (result.success) {
        return detailedErrors;
      }
      const itemId = selectedItemIds[index];
      const detailedError: DetailedError = { result, itemId: itemId };
      return [...detailedErrors, detailedError];
    }, []);
  const shareOneItem = (
    itemId: string,
    itemPermission: Permission,
    recipients: Recipient[]
  ): Promise<ShareItemResponse> =>
    shareItem(itemId, itemPermission, recipients);
  const shareAllItems = async () => {
    const selectedUserIds = getSelectedItems(["users"]);
    const selectedGroupIds = getSelectedItems(["groups"]);
    if (shareItemsGrapheneFF) {
      try {
        const shareItemsPromise = shareItems({
          permission,
          userLogins: selectedUserIds,
          userGroupIds: selectedGroupIds,
          vaultItemIds: [
            ...selectedCredentials,
            ...selectedNotes,
            ...selectedSecrets,
          ],
        });
        if (itemsCount > 30) {
          goToStep(SharingInviteStep.Loading);
        } else {
          setIsLoading(true);
        }
        const shareItemsResult = await shareItemsPromise;
        if (isFailure(shareItemsResult)) {
          const error = getFailure(shareItemsResult);
          if (error.tag === ShareItemsErrorType.LIMIT_EXCEEDED) {
            setLimitExceededError(true);
          }
          goToStep(SharingInviteStep.Failure);
        } else {
          goToStep(SharingInviteStep.Success);
        }
      } catch (error) {
        goToStep(SharingInviteStep.Failure);
      }
      setIsLoading(false);
      return;
    }
    const userRecipients: UserRecipient[] = selectedUserIds.map((alias) => ({
      type: "user",
      alias,
    }));
    const groupRecipients = selectedGroupIds.map(
      (groupId): GroupRecipient => ({ type: "userGroup", groupId })
    );
    const recipients: Recipient[] = [...userRecipients, ...groupRecipients];
    const credentialsPromises = selectedCredentials.map((itemId: string) =>
      shareOneItem(itemId, permission, recipients)
    );
    const notesPromises = selectedNotes.map((itemId: string) =>
      shareOneItem(itemId, permission, recipients)
    );
    const secretsPromises = selectedSecrets.map((itemId: string) =>
      shareOneItem(itemId, permission, recipients)
    );
    if (itemsCount > 10) {
      goToStep(SharingInviteStep.Loading);
    } else {
      setIsLoading(true);
    }
    try {
      const credentialResults = await Promise.all(credentialsPromises);
      const noteResults = await Promise.all(notesPromises);
      const secretResults = await Promise.all(secretsPromises);
      const newCredentialErrors = getDetailedErrors(
        credentialResults,
        selectedCredentials
      );
      const newNoteErrors = getDetailedErrors(noteResults, selectedNotes);
      const newSecretErrors = getDetailedErrors(secretResults, selectedSecrets);
      if (
        newCredentialErrors.length > 0 ||
        newNoteErrors.length > 0 ||
        newSecretErrors.length > 0
      ) {
        setCredentialErrors(newCredentialErrors);
        setNoteErrors(newNoteErrors);
        setSecretErrors(secretErrors);
        goToStep(SharingInviteStep.Failure);
      } else {
        goToStep(SharingInviteStep.Success);
      }
    } catch (_e) {
      goToStep(SharingInviteStep.Failure);
    }
    setIsLoading(false);
  };
  return (
    <>
      {step === SharingInviteStep.UnlockProtectedItems ? (
        <UnlockItemsDialog goToStep={goToStep} />
      ) : null}

      {step === SharingInviteStep.UnlockProtectedCollection ? (
        <UnlockCollectionDialog goToStep={goToStep} onDismiss={onDismiss} />
      ) : null}

      {step === SharingInviteStep.Elements ? (
        <ElementsStep
          elementsOnlyShowSelected={doElsOnlyShowSelected}
          goToStep={goToStep}
          selectedCredentials={selectedCredentials}
          selectedNotes={selectedNotes}
          selectedSecrets={selectedSecrets}
          selectNotesTab={selectNotesTab}
          selectSecretsTab={selectSecretsTab}
          selectPasswordsTab={selectPasswordsTab}
          setElementsOnlyShowSelected={(event) =>
            setDoElsOnlyShowSelected(event.currentTarget.checked)
          }
          tab={tab}
        />
      ) : null}

      {step === SharingInviteStep.Failure && !shareItemsGrapheneFF ? (
        <FailureStep
          credentialErrors={credentialErrors}
          itemsCount={itemsCount}
          isLoading={isLoading}
          noteErrors={noteErrors}
          onDismiss={onDismiss}
          shareAllItems={shareAllItems}
        />
      ) : null}

      {step === SharingInviteStep.Failure && shareItemsGrapheneFF ? (
        <ShareInviteFailureStep
          itemsCount={itemsCount}
          isLoading={isLoading}
          onDismiss={() => {
            setLimitExceededError(false);
            onDismiss();
          }}
          limitExceededError={limitExceededError}
          shareAllItems={shareAllItems}
        />
      ) : null}

      {step === SharingInviteStep.Loading ? <ShareLoading /> : null}

      {step === SharingInviteStep.Permission ? (
        <PermissionStep
          goToStep={() => goToStep(SharingInviteStep.Recipients)}
          onClick={shareAllItems}
          isLoading={isLoading}
          permission={permission}
          onSelectPermission={onSelectPermission}
        />
      ) : null}

      {step === SharingInviteStep.Recipients ? (
        <SharingItemsRecipientsStep
          goToStep={goToStep}
          newUsers={newUsers}
          recipientsOnlyShowSelected={doRecipientsOnlyShowSelected}
          setNewUsers={setNewUsers}
          setRecipientsOnlyShowSelected={(event) =>
            setDoRecipientsOnlyShowSelected(event.currentTarget.checked)
          }
        />
      ) : null}

      {step === SharingInviteStep.CollectionRecipients ||
      step === SharingInviteStep.CollectionItemPermissions ? (
        <CollectionsProvider>
          <ShareCollection
            step={step}
            goToStep={goToStep}
            recipientsOnlyShowSelected={doRecipientsOnlyShowSelected}
            setRecipientsOnlyShowSelected={(event) =>
              setDoRecipientsOnlyShowSelected(event.currentTarget.checked)
            }
            setDoRecipientsOnlyShowSelected={setDoRecipientsOnlyShowSelected}
            onDismiss={onDismiss}
            origin={origin}
            selectedCollectionId={sharing.selectedPrivateCollections[0]}
          />
        </CollectionsProvider>
      ) : null}

      {step === SharingInviteStep.Success ? (
        <SharingSuccess
          itemsCount={itemsCount}
          isLoading={isLoading}
          onDismiss={onDismiss}
        />
      ) : null}
    </>
  );
};
