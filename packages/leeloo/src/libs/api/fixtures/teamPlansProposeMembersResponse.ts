import { Auth, TeamPlansProposeMembersResult, TeamPlansProposeMembersResultContent, } from 'libs/api/types';
import { getUrlSearch } from 'libs/router';
export default function teamPlansProposeMembersResponse(params: {
    auth: Auth;
    memberLogins: string;
    force?: boolean;
}): Promise<TeamPlansProposeMembersResult> {
    let responseContents: TeamPlansProposeMembersResultContent = {
        refusedMembers: {},
        proposedMembers: {},
    };
    if (getUrlSearch().includes('pretendInvitesFailed')) {
        const proposedMemberLogins = JSON.parse(params.memberLogins);
        const refusedMemberCount = proposedMemberLogins.length < 2 ? 0 : proposedMemberLogins.length - 1;
        const refusedMembers = {};
        const proposedMembers = {};
        proposedMemberLogins.forEach((email: string, index: number) => {
            if (index < refusedMemberCount) {
                if (index % 2) {
                    refusedMembers[email] = 'already_member_other_team';
                }
                else {
                    refusedMembers[email] = 'has_automatic_renew';
                }
            }
            else {
                proposedMembers[email] = true;
            }
        });
        responseContents = {
            refusedMembers: refusedMemberCount ? refusedMembers : {},
            proposedMembers: refusedMemberCount ? proposedMembers : {},
        };
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            code: 200,
            message: 'OK',
            content: responseContents,
        }), 500);
    });
}
