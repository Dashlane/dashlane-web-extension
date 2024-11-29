import { Flex, Icon, Paragraph } from "@dashlane/design-system";
import {
  Permission,
  SharedCollectionUserOrGroupView,
  Status,
} from "@dashlane/sharing-contracts";
import { AvatarWithAbbreviatedText } from "../../../../../libs/dashlane-style/avatar/avatar-with-abbreviated-text";
import { useUserLoginStatus } from "../../../../../libs/carbon/hooks/useUserLoginStatus";
import { SharedAccessRoleSelect } from "./shared-access-role-select";
export type MemberToConfirmType = {
  status: Status;
  permission: Permission | undefined;
  label: string;
  id: string;
} & {
  isGroup?: boolean | undefined;
};
export interface MemberRowProps {
  isGroup?: boolean;
  isLastGroupMember?: boolean;
  isUpdatePending: boolean;
  memberToConfirm: MemberToConfirmType[];
  setEditorManagerMemberToConfirm: (member: MemberToConfirmType[]) => void;
  isUserCollectionManager: boolean;
  canEditRoles: boolean;
  member: SharedCollectionUserOrGroupView;
}
export const MemberRow = ({
  isGroup = false,
  isLastGroupMember = false,
  member,
  ...rest
}: MemberRowProps) => {
  const currentUser = useUserLoginStatus()?.login;
  return (
    <Flex
      flexWrap="nowrap"
      justifyContent="space-between"
      sx={{ width: "576px" }}
    >
      <Flex
        alignItems="center"
        flexWrap="nowrap"
        sx={{ height: "64px", overflow: "hidden" }}
      >
        {isGroup ? (
          <Flex
            alignItems="center"
            justifyContent="center"
            sx={{
              background: "ds.container.agnostic.neutral.standard",
              border: "1px solid ds.border.neutral.quiet.idle",
              borderRadius: "50%",
              height: "35px",
              width: "35px",
            }}
          >
            <Icon name="GroupOutlined" />
          </Flex>
        ) : (
          <AvatarWithAbbreviatedText
            email={member.label ?? ""}
            avatarSize={36}
            placeholderFontSize={18}
            placeholderTextType="firstTwoCharacters"
          />
        )}
        <Paragraph
          color="ds.text.neutral.catchy"
          textStyle="ds.body.standard.regular"
          sx={{ ml: "16px", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {member.label}
        </Paragraph>
      </Flex>
      <Flex
        alignItems="center"
        flexWrap="nowrap"
        sx={{ height: "64px", overflow: "hidden", flexShrink: "0" }}
      >
        <SharedAccessRoleSelect
          isLastGroupMember={isLastGroupMember}
          isGroup={isGroup}
          currentUser={currentUser}
          member={member}
          {...rest}
        />
      </Flex>
    </Flex>
  );
};
