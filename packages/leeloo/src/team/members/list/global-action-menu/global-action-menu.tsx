import { TeamMemberInfo } from "@dashlane/communication";
import { Button, Icon } from "@dashlane/design-system";
import { DropdownMenu } from "@dashlane/ui-components";
import { Button as EventButtonLogType, UserClickEvent } from "@dashlane/hermes";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { AvailableFeatureFlips } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { MemberAction } from "../../types";
import { getPendingUsers } from "../../get-pending-users";
import { useInviteLinkData } from "../../../settings/hooks/useInviteLinkData";
import { useInviteLinkDataGraphene } from "../../../settings/hooks/use-invite-link";
import { downloadTeamMembersCSV } from "./download-team-members-csv";
import { FormatedDropdownElement } from "./formated-dropdown-element";
const I18N_KEYS = {
  RESEND_INVITES: "team_members_resend_invite_all",
  SHARE_INVITE_LINK: "team_members_share_invite_link",
  DOWNLOAD_TEAM_MEMBERS_CSV: "team_members_download_csv",
  DOWNLOAD_TEAM_MEMBERS_CSV_DESCRIPTION:
    "team_members_download_csv_description",
  ARIA_LABEL_EXPAND_INVITE_OPTION: "team_members_expand_invite_option",
};
interface Props {
  members: TeamMemberInfo[];
  onMembersActionSelect: (
    actionName: MemberAction,
    members?: TeamMemberInfo[]
  ) => void;
}
export const GlobalActionMenu = ({ members, onMembersActionSelect }: Props) => {
  const { translate } = useTranslate();
  const { getInviteLinkDataForAdmin } = useInviteLinkData();
  const isInviteLinkGrapheneFF = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const inviteLinkDataGraphene = useInviteLinkDataGraphene();
  const teamData =
    inviteLinkDataGraphene.status === DataStatus.Success
      ? inviteLinkDataGraphene
      : undefined;
  if (isInviteLinkGrapheneFF === null || isInviteLinkGrapheneFF === undefined) {
    return null;
  }
  const downloadCSV = () => {
    logEvent(new UserClickEvent({ button: EventButtonLogType.DownloadCsv }));
    downloadTeamMembersCSV(members);
  };
  const resendInvitePendingUsers = () => {
    onMembersActionSelect("reinviteAll", getPendingUsers(members));
  };
  const handleShareInviteLink = async () => {
    const inviteLinkDataForAdmin = isInviteLinkGrapheneFF
      ? null
      : await getInviteLinkDataForAdmin();
    const isInviteLinkDisabled = isInviteLinkGrapheneFF
      ? !teamData?.enabled
      : !inviteLinkDataForAdmin?.teamKey || inviteLinkDataForAdmin?.disabled;
    const action = isInviteLinkDisabled
      ? "enableInviteLink"
      : "shareInviteLink";
    onMembersActionSelect(action);
  };
  return (
    <DropdownMenu
      sx={{ zIndex: 1001 }}
      content={[
        <FormatedDropdownElement
          key="resendInvite"
          onClick={resendInvitePendingUsers}
          icon="NotificationOutlined"
          title={translate(I18N_KEYS.RESEND_INVITES)}
        />,
        <FormatedDropdownElement
          key="shareInviteLink"
          onClick={handleShareInviteLink}
          icon="ActionCopyOutlined"
          title={translate(I18N_KEYS.SHARE_INVITE_LINK)}
        />,
        <FormatedDropdownElement
          key="exportUserCSV"
          onClick={downloadCSV}
          icon="DownloadOutlined"
          title={translate(I18N_KEYS.DOWNLOAD_TEAM_MEMBERS_CSV)}
          description={translate(
            I18N_KEYS.DOWNLOAD_TEAM_MEMBERS_CSV_DESCRIPTION
          )}
        />,
      ].filter(Boolean)}
    >
      <Button
        id="expand-invite-option"
        aria-label={translate(I18N_KEYS.ARIA_LABEL_EXPAND_INVITE_OPTION)}
        intensity="quiet"
        mood="neutral"
        size="medium"
        layout="iconOnly"
        sx={{ marginLeft: "16px" }}
        icon={
          <Icon
            name="ActionMoreOutlined"
            size="medium"
            color="ds.text.neutral.standard"
          />
        }
      />
    </DropdownMenu>
  );
};
