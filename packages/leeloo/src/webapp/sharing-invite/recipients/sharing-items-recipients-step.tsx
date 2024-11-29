import { DataStatus } from "@dashlane/carbon-api-consumers";
import { IndeterminateLoader } from "@dashlane/design-system";
import { SortDirection } from "@dashlane/sharing-contracts";
import { useCapabilities } from "../../../libs/carbon/hooks/useCapabilities";
import { useUserLoginStatus } from "../../../libs/carbon/hooks/useUserLoginStatus";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { useSharingUsers } from "../../sharing-center/sharing-users/useSharingUsers";
import { useAreProtectedItemsUnlocked } from "../../unlock-items/hooks/use-are-protected-items-unlocked";
import { useSharingTeamLogins } from "../hooks/useSharingTeamLogins";
import { SharingInviteStep } from "../types";
import { SharingRecipientsDialog } from "./sharing-recipients-dialog";
import { useMultiselectContext } from "../../list-view/multi-select/multi-select-context";
import { checkForProtectedItems } from "../helpers";
import { useEffect, useState } from "react";
const I18N_KEYS = {
  ADD_ITEMS: "webapp_sharing_invite_add_more_items",
  ITEM_QUERY_ERROR: "webapp_sharing_invite_item_query_error",
  NEXT: "webapp_sharing_invite_next",
  SELECT_TITLE: "webapp_sharing_invite_select_recipients_title",
  SECRET_QUERY_ERROR: "webapp_sharing_invite_secret_query_error",
};
export interface SharingItemsRecipientsStepProps {
  goToStep: (step: SharingInviteStep) => void;
  newUsers: string[];
  recipientsOnlyShowSelected: boolean;
  setNewUsers: (newUsers: string[]) => void;
  setRecipientsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
}
export const SharingItemsRecipientsStep = ({
  goToStep,
  ...rest
}: SharingItemsRecipientsStepProps) => {
  const { currentSpaceId } = useTeamSpaceContext();
  const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
  const capabilityResult = useCapabilities(["internalSharingOnly"]);
  const currentUserLogin = useUserLoginStatus()?.login;
  const userRequest = useSharingUsers(SortDirection.Ascend, currentSpaceId);
  const teamLogins = useSharingTeamLogins();
  const { getSelectedItems } = useMultiselectContext();
  const [areProtectedItemsSelected, setAreProtectedItemsSelected] =
    useState(false);
  useEffect(() => {
    const checkProtectedCredentials = async () => {
      const selectedCredentials = getSelectedItems(["credentials"]);
      const selectedNotes = getSelectedItems(["notes"]);
      const areNewProtectedItemsSelected = await checkForProtectedItems(
        selectedCredentials,
        selectedNotes
      );
      setAreProtectedItemsSelected(areNewProtectedItemsSelected);
    };
    checkProtectedCredentials();
  }, [getSelectedItems]);
  const isSharingSecrets = getSelectedItems(["secrets"]).length;
  if (
    userRequest.status !== DataStatus.Success ||
    capabilityResult.status !== DataStatus.Success ||
    teamLogins.status !== DataStatus.Success
  ) {
    return <IndeterminateLoader color="ds.text.brand.standard" />;
  }
  const isSharingRestrictedToTeam = !!isSharingSecrets || capabilityResult.data;
  const users = isSharingRestrictedToTeam
    ? teamLogins.data?.userLogins
        .filter((login) => login !== currentUserLogin)
        .map((teamLogin) => ({
          id: teamLogin,
          itemCount: 0,
        }))
    : userRequest.data;
  const selectedUsersOrGroups = getSelectedItems(["users", "groups"]);
  const hasSelection = selectedUsersOrGroups.length > 0;
  const handleNextButtonClicked = () =>
    goToStep(
      areProtectedItemsSelected && !areProtectedItemsUnlocked
        ? SharingInviteStep.UnlockProtectedItems
        : SharingInviteStep.Permission
    );
  const dialogPrimaryAction = {
    onClick: handleNextButtonClicked,
    children: I18N_KEYS.NEXT,
    props: {
      disabled: !hasSelection,
    },
  };
  const dialogSecondaryAction = {
    onClick: () => goToStep(SharingInviteStep.Elements),
    children: I18N_KEYS.ADD_ITEMS,
  };
  const emailQueryErrorKey = isSharingSecrets
    ? I18N_KEYS.SECRET_QUERY_ERROR
    : I18N_KEYS.ITEM_QUERY_ERROR;
  return (
    <SharingRecipientsDialog
      headingTitle={I18N_KEYS.SELECT_TITLE}
      emailQueryErrorKey={emailQueryErrorKey}
      dialogPrimaryAction={dialogPrimaryAction}
      dialogSecondaryAction={dialogSecondaryAction}
      users={users}
      allowNewContacts={!isSharingRestrictedToTeam}
      {...rest}
    />
  );
};
