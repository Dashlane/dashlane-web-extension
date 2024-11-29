import { useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { ClickOrigin, Origin } from "@dashlane/hermes";
import { Permission } from "@dashlane/sharing-contracts";
import { useCollectionsContext } from "../collections/collections-context";
import {
  CollectionSharingPaywall,
  TrialBusinessCollectionSharingInfobox,
  useCollectionSharingStatus,
} from "../paywall/paywall/collection-sharing";
import { SharingInviteStep } from "../sharing-invite/types";
import {
  CollectionRecipientsStep,
  CollectionSharingRoles,
} from "./sharing-collection-recipients";
import { PermissionStep } from "../sharing-invite/permission";
import { AdminSharingCollectionPaywall } from "./paywall/admin-sharing-collection-paywall";
import { NonAdminSharingCollectionPaywall } from "./paywall/non-admin-sharing-collection-paywall";
import { useShareCollection } from "./hooks/use-share-collection";
import { useMultiselectContext } from "../list-view/multi-select/multi-select-context";
interface ShareCollectionProps {
  step: SharingInviteStep;
  goToStep: (step: SharingInviteStep) => void;
  recipientsOnlyShowSelected: boolean;
  setRecipientsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
  setDoRecipientsOnlyShowSelected: (event: boolean) => void;
  onDismiss: () => void;
  origin: Origin;
  selectedCollectionId: string;
}
export const ShareCollection = ({
  step,
  setDoRecipientsOnlyShowSelected,
  origin,
  onDismiss,
  goToStep,
  selectedCollectionId,
  ...rest
}: ShareCollectionProps) => {
  const { sharedCollections } = useCollectionsContext();
  const { getSelectedItems } = useMultiselectContext();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<CollectionSharingRoles[]>([]);
  const [itemPermissions, setItemPermissions] = useState(Permission.Limited);
  const {
    hasSharingCollectionPaywall,
    canShareCollection,
    isStarterTeam,
    isBusinessTrialTeam,
    isAdmin,
  } = useCollectionSharingStatus();
  const selectedUsers = getSelectedItems(["users"]);
  const selectedGroups = getSelectedItems(["groups"]);
  const { shareCollection } = useShareCollection({
    selectedGroups,
    selectedUsers,
    origin,
    onDismiss,
    goToStep,
    setIsLoading,
    selectedCollectionId,
    roles,
    itemPermissions,
  });
  const collectionIsShared = !!sharedCollections.find(
    (collection) => collection.id === selectedCollectionId
  );
  const displaySharingCollectionInformativePaywall = Boolean(
    hasSharingCollectionPaywall &&
      isAdmin &&
      canShareCollection &&
      !collectionIsShared
  );
  const displayAdminSharingCollectionEnforcedPaywall = Boolean(
    hasSharingCollectionPaywall &&
      isAdmin &&
      !canShareCollection &&
      !collectionIsShared
  );
  const displayNonAdminSharingCollectionPaywall =
    hasSharingCollectionPaywall && !isAdmin;
  const isStarterAdmin = isStarterTeam && isAdmin;
  const compareByRoleId = (item1: string, item2: CollectionSharingRoles) => {
    return item1 === item2.id;
  };
  const combinedRoles = useMemo(() => {
    const filteredUsersRoles = roles.filter((role) =>
      selectedUsers.some((user) => compareByRoleId(user, role))
    );
    const filteredGroupsRoles = roles.filter((role) =>
      selectedGroups.some((group) => compareByRoleId(group, role))
    );
    return [...filteredUsersRoles, ...filteredGroupsRoles];
  }, [roles, selectedUsers, selectedGroups]);
  useEffect(() => {
    if (!isEqual(combinedRoles, roles)) {
      setRoles(combinedRoles);
    }
  }, [combinedRoles, roles]);
  return (
    <>
      {step === SharingInviteStep.CollectionRecipients ? (
        displayNonAdminSharingCollectionPaywall ? (
          <NonAdminSharingCollectionPaywall onDismiss={onDismiss} />
        ) : displayAdminSharingCollectionEnforcedPaywall ? (
          <AdminSharingCollectionPaywall />
        ) : (
          <CollectionRecipientsStep
            {...rest}
            isAlreadyShared={collectionIsShared}
            setRoles={setRoles}
            origin={origin}
            onDismiss={onDismiss}
            roles={roles}
            isLoading={isLoading}
            itemPermissions={itemPermissions}
            setRecipientsOnlyShowSelected={(event) =>
              setDoRecipientsOnlyShowSelected(event.currentTarget.checked)
            }
            shareCollection={shareCollection}
            goToStep={goToStep}
            isStarterAdmin={isStarterAdmin}
            infobox={
              displaySharingCollectionInformativePaywall ? (
                <CollectionSharingPaywall
                  canShareCollection={true}
                  buttonIntensity="quiet"
                  clickOrigin={
                    ClickOrigin.CollectionsSharingStarterLimitCloseToBeReachedModal
                  }
                />
              ) : isBusinessTrialTeam ? (
                <TrialBusinessCollectionSharingInfobox />
              ) : undefined
            }
          />
        )
      ) : null}

      {step === SharingInviteStep.CollectionItemPermissions ? (
        <PermissionStep
          goToStep={() => goToStep(SharingInviteStep.CollectionRecipients)}
          onClick={shareCollection}
          isCollectionSharing
          isLoading={isLoading}
          permission={itemPermissions}
          onSelectPermission={setItemPermissions}
        />
      ) : null}
    </>
  );
};
