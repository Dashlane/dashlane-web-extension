import { useState } from "react";
import illustrationLight from "@dashlane/design-system/assets/illustrations/create-manage-share-collections@2x-light.webp";
import illustrationDark from "@dashlane/design-system/assets/illustrations/create-manage-share-collections@2x-dark.webp";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Infobox } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { InviteTeamMembersDialog } from "../../../onboarding/get-started/invite-team-members-dialog/invite-team-members-dialog";
import { EmptyStateBase } from "../../../empty-state/shared/empty-state-base";
import { NextStep } from "../../../empty-state/shared/next-step";
import { SharingStep } from "../steps/sharing-step";
import { useHasSharableItems } from "../hooks/use-has-sharable-items";
import { useHasTeamMembers } from "../hooks/use-has-team-members";
import { LoginsStep } from "../steps/logins-step";
const I18N_KEYS = {
  title: {
    addLogins:
      "webapp_sharing_center_empty_state_title_admins_with_team_limited_sharing_add_logins",
    inviteMembers:
      "webapp_sharing_center_empty_state_title_admins_with_team_limited_sharing_invite_members",
    addLoginsWhileHavingTeamMembers:
      "webapp_sharing_center_empty_state_title_admins_with_team_limited_sharing_add_logins_while_having_members",
    startSharing:
      "webapp_sharing_center_empty_state_title_admins_with_team_limited_sharing_start_sharing",
  },
  description: {
    addLogins:
      "webapp_sharing_center_empty_state_admins_with_team_limited_sharing_description_add_logins",
    inviteMembers:
      "webapp_sharing_center_empty_state_admins_with_team_limited_sharing_description_invite_members",
    addLoginsWhileHavingTeamMembers:
      "webapp_sharing_center_empty_state_admins_with_team_limited_sharing_description_add_logins_while_having_members",
    startSharing:
      "webapp_sharing_center_empty_state_admins_with_team_limited_sharing_description_start_sharing",
  },
  nextStep: {
    inviteMembers: {
      title: "webapp_sharing_center_empty_state_next_step_invite_members_title",
      description:
        "webapp_sharing_center_empty_state_next_step_invite_members_description_markup",
      button:
        "webapp_sharing_center_empty_state_next_step_invite_members_button",
      infobox: {
        title:
          "webapp_sharing_center_empty_state_next_step_invite_members_infobox_title",
        description:
          "webapp_sharing_center_empty_state_next_step_invite_members_infobox_description",
      },
    },
  },
};
interface Props {
  teamId: number;
}
export const SharingCenterEmptyStateForAdminWithTeamLimitedSharing = ({
  teamId,
}: Props) => {
  const [openInviteMembersDialog, setOpenInviteMembersDialog] = useState(false);
  const { translate } = useTranslate();
  const hasTeamMembers = useHasTeamMembers({ teamId });
  const hasSharableItems = useHasSharableItems();
  if (
    hasTeamMembers.status !== DataStatus.Success ||
    hasSharableItems.status !== DataStatus.Success
  ) {
    return null;
  }
  const onInviteMembers = () => {
    setOpenInviteMembersDialog(true);
  };
  const InviteStep = () => (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        width: "100%",
      }}
    >
      {hasTeamMembers.hasInvitations ? (
        <Infobox
          title={translate(I18N_KEYS.nextStep.inviteMembers.infobox.title)}
          description={translate(
            I18N_KEYS.nextStep.inviteMembers.infobox.description
          )}
          mood="warning"
          sx={{ margin: "0 24px" }}
        />
      ) : null}

      <NextStep
        title={translate(I18N_KEYS.nextStep.inviteMembers.title)}
        description={translate.markup(
          I18N_KEYS.nextStep.inviteMembers.description
        )}
        button={{
          children: translate(I18N_KEYS.nextStep.inviteMembers.button),
          layout: "iconTrailing",
          icon: "ArrowRightOutlined",
          mood: "brand",
          intensity: "catchy",
          onClick: onInviteMembers,
        }}
      />

      <InviteTeamMembersDialog
        isShown={openInviteMembersDialog}
        setIsShown={setOpenInviteMembersDialog}
      />
    </div>
  );
  const keyWhenHavingSharableItems = hasTeamMembers.hasTeamMembers
    ? "startSharing"
    : "inviteMembers";
  const keyWhenHavingNoSharableItem = hasTeamMembers.hasTeamMembers
    ? "addLoginsWhileHavingTeamMembers"
    : "addLogins";
  const headerKey = hasSharableItems.hasSharableItems
    ? keyWhenHavingSharableItems
    : keyWhenHavingNoSharableItem;
  return (
    <EmptyStateBase
      title={translate(I18N_KEYS.title[headerKey])}
      description={translate(I18N_KEYS.description[headerKey])}
      illustrationLightSrc={illustrationLight}
      illustrationDarkSrc={illustrationDark}
    >
      {hasSharableItems.hasSharableItems ? (
        hasTeamMembers.hasTeamMembers ? (
          <SharingStep />
        ) : (
          <InviteStep />
        )
      ) : (
        <LoginsStep />
      )}
    </EmptyStateBase>
  );
};
