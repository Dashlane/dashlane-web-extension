import * as React from 'react';
import { UserGroupView } from '@dashlane/communication';
import { FlexContainer, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { AvatarWithAbbreviatedText } from 'libs/dashlane-style/avatar/avatar-with-abbreviated-text';
import Row, { RowLinkProps } from 'webapp/list-view/row';
import GroupAvatar from 'webapp/sharing-center/group/list/group-avatar.svg';
import styles from './group-list-styles.css';
const I18N_KEYS = {
    GROUP_MEMBERS_OTHER: 'webapp_sharing_center_members_content',
    ITEMS_SHARED: 'webapp_sharing_center_item_shared',
};
export interface GroupRowProps {
    group: UserGroupView;
    itemCount: number;
}
const MEMBER_AVATAR_COUNT = 5;
export const GroupRow = ({ group, itemCount }: GroupRowProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const createMembersContent = (groupView: UserGroupView) => {
        const groupUserCount = groupView.users.length;
        return (<FlexContainer alignItems="center">
        <FlexContainer flexDirection="row-reverse">
          {groupView.users.slice(0, MEMBER_AVATAR_COUNT).map((user) => {
                return (<div key={user.id} className={styles.memberIconPlacement}>
                <AvatarWithAbbreviatedText email={user.id} avatarSize={36} placeholderTextType="firstTwoCharacters"/>
              </div>);
            })}
        </FlexContainer>
        {groupUserCount > MEMBER_AVATAR_COUNT ? (<p className={styles.additionalMemberText}>
            {`${translate(I18N_KEYS.GROUP_MEMBERS_OTHER, {
                    count: groupUserCount - MEMBER_AVATAR_COUNT,
                })}
            `}
          </p>) : null}
      </FlexContainer>);
    };
    const formatGroup = (): RowLinkProps => {
        return {
            link: routes.userSharingGroupInfo(group.id),
            type: 'link',
            data: [
                {
                    key: 'name',
                    content: (<FlexContainer alignItems="center" gap="18px">
              <img src={GroupAvatar} width={48} height={48} className={styles.nameCellGroupImage}/>
              <Paragraph size="medium" color="ds.text.neutral.standard">
                <strong>{group.name}</strong>
              </Paragraph>
            </FlexContainer>),
                },
                {
                    key: 'itemsShared',
                    content: translate(I18N_KEYS.ITEMS_SHARED, {
                        count: itemCount,
                    }),
                    className: styles.groupListRowCellItems,
                },
                {
                    key: 'members',
                    content: createMembersContent(group),
                    className: styles.groupListCellMembers,
                },
            ],
        };
    };
    const content = formatGroup();
    return <Row {...content} key={group.id}/>;
};
