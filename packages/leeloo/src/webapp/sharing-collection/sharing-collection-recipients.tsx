import { Permission, SharedCollectionRole } from "@dashlane/sharing-contracts";
import { Origin } from "@dashlane/hermes";
import { useUserLoginStatus } from "../../libs/carbon/hooks/useUserLoginStatus";
import { useSharingTeamLoginsData } from "../sharing-invite/hooks/useSharingTeamLogins";
import { SharingRecipientsDialog } from "../sharing-invite/recipients/sharing-recipients-dialog";
import { SharingInviteStep } from "../sharing-invite/types";
import { useMultiselectContext } from "../list-view/multi-select/multi-select-context";
const I18N_KEYS = {
  COLLECTION_RECIPIENTS_TITLE:
    "webapp_sharing_invite_collection_recipients_title",
  COLLECTION_SHARE_SUCCESS:
    "webapp_sharing_invite_collection_share_success_message",
  COLLECTION_SHARE_ERROR: "webapp_sharing_invite_collection_share_error",
  COLLECTION_QUERY_ERROR: "webapp_sharing_invite_collection_query_error",
  COLLECTION_PERMISSIONS_INFO:
    "webapp_sharing_invite_collection_permissions_info",
  COLLECTION_BUTTON_NEXT: "webapp_sharing_invite_collection_next_button",
  SHARE: "_common_action_share",
};
export interface RecipientsStepProps {
  goToStep: (step: SharingInviteStep) => void;
  shareCollection: () => void;
  recipientsOnlyShowSelected: boolean;
  setRecipientsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
  onDismiss: () => void;
  itemPermissions: Permission;
  origin: Origin;
  setRoles: (roles: CollectionSharingRoles[]) => void;
  roles: CollectionSharingRoles[];
  isLoading: boolean;
  infobox?: JSX.Element;
  isStarterAdmin?: boolean;
  isAlreadyShared: boolean;
}
export type CollectionSharingRoles = {
  id: string;
  role: SharedCollectionRole;
};
export const CollectionRecipientsStep = ({
  goToStep,
  shareCollection,
  isLoading,
  setRoles,
  roles,
  infobox,
  isStarterAdmin,
  isAlreadyShared,
  ...rest
}: RecipientsStepProps) => {
  const { getSelectedItems } = useMultiselectContext();
  const teamLogins = useSharingTeamLoginsData();
  const currentUserLogin = useUserLoginStatus()?.login;
  const users = teamLogins
    .filter((login) => login !== currentUserLogin)
    .map((teamLogin) => ({
      id: teamLogin,
      itemCount: 0,
    }));
  const selectedUsersOrGroups = getSelectedItems(["users", "groups"]);
  const hasSelection = selectedUsersOrGroups.length > 0;
  const shouldShowPermissionStep = !isAlreadyShared;
  const dialogPrimaryAction = {
    onClick: shouldShowPermissionStep
      ? () => goToStep(SharingInviteStep.CollectionItemPermissions)
      : shareCollection,
    children: shouldShowPermissionStep
      ? I18N_KEYS.COLLECTION_BUTTON_NEXT
      : I18N_KEYS.SHARE,
    props: {
      disabled: !hasSelection || isLoading || !roles.length,
    },
  };
  return (
    <SharingRecipientsDialog
      headingTitle={I18N_KEYS.COLLECTION_RECIPIENTS_TITLE}
      emailQueryErrorKey={I18N_KEYS.COLLECTION_QUERY_ERROR}
      dialogPrimaryAction={dialogPrimaryAction}
      users={users}
      roles={roles}
      onRolesChanged={setRoles}
      infobox={infobox}
      isStarterAdmin={isStarterAdmin}
      {...rest}
    />
  );
};
