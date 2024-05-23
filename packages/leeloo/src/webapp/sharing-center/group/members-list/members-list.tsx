import { Fragment } from 'react';
import { UserGroupMemberView } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { ContentCard } from 'webapp/panel/standard/content-card';
import { MemberRow } from 'webapp/sharing-center/group/members-list/member-row';
import { EmptySearchResults } from 'webapp/sharing-center/shared/empty-search-results';
import { MemberHeader } from 'webapp/sharing-center/group/members-list/members-header';
interface MemberListProps {
    members: UserGroupMemberView[];
}
interface MembersSplitByPermission {
    admins: UserGroupMemberView[];
    others: UserGroupMemberView[];
}
export const MembersList = ({ members }: MemberListProps) => {
    const { admins, others } = members.reduce((permSplit: MembersSplitByPermission, member) => {
        if (member.permission === 'admin') {
            permSplit.admins.push(member);
        }
        else {
            permSplit.others.push(member);
        }
        return permSplit;
    }, {
        admins: [],
        others: [],
    } as MembersSplitByPermission);
    return (<div sx={{
            height: '100%',
            overflowY: 'auto',
            mt: '15px',
            overflow: members.length === 0 ? 'hidden' : 'auto',
        }}>
      {members.length === 0 ? (<EmptySearchResults />) : (<>
          {admins.length ? (<ContentCard>
              <MemberHeader permissionLevel={'admin'}/>
              {admins.map((member: UserGroupMemberView) => (<MemberRow key={member.id} member={member}/>))}
            </ContentCard>) : null}
          {others.length ? (<ContentCard>
              <MemberHeader permissionLevel={'limited'}/>
              {others.map((member: UserGroupMemberView) => (<MemberRow key={member.id} member={member}/>))}
            </ContentCard>) : null}
        </>)}
    </div>);
};
