import { Flex } from "@dashlane/design-system";
import Row from "../../../list-view/row";
import { AvatarWithAbbreviatedText } from "../../../../libs/dashlane-style/avatar/avatar-with-abbreviated-text";
export interface MemberRowProps {
  member: string;
}
export const GroupMemberRow = ({ member }: MemberRowProps) => {
  const getRowData = () => {
    return [
      {
        key: "name",
        sxProps: { p: "0", minHeight: "60px" },
        content: (
          <Flex alignItems="center">
            <AvatarWithAbbreviatedText
              email={member}
              avatarSize={36}
              placeholderFontSize={18}
              placeholderTextType="firstTwoCharacters"
            />
            <h2 sx={{ ml: "16px" }}>{member}</h2>
          </Flex>
        ),
      },
    ];
  };
  return <Row data={getRowData()} key={member} style={{ padding: "0" }} />;
};
