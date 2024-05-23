import { UserGroupMemberView } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import Row from 'webapp/list-view/row';
import { AvatarWithAbbreviatedText } from 'libs/dashlane-style/avatar/avatar-with-abbreviated-text';
import { FlexContainer } from '@dashlane/ui-components';
export interface MemberRowProps {
    member: UserGroupMemberView;
}
export const MemberRow = ({ member }: MemberRowProps) => {
    const getRowData = () => {
        return [
            {
                key: 'name',
                sxProps: { p: '0', minHeight: '60px' },
                content: (<FlexContainer alignItems="center">
            <AvatarWithAbbreviatedText email={member.id} avatarSize={36} placeholderFontSize={18} placeholderTextType="firstTwoCharacters"/>
            <h2 sx={{ ml: '16px' }}>{member.id}</h2>
          </FlexContainer>),
            },
        ];
    };
    return <Row data={getRowData()} key={member.id} style={{ padding: '0' }}/>;
};
