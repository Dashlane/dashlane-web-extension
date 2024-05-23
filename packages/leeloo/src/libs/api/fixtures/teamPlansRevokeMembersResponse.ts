import { Auth } from 'libs/api/types';
import { getUrlSearch } from 'libs/router';
export default function teamPlansRevokeMembersResponse(params: {
    auth: Auth;
    memberLogins: string[];
}): Promise<any> {
    if (getUrlSearch().includes('pretendRevokeFailed')) {
        const removedMembers = {};
        const refusedMembers = {};
        const unproposedMembers = {};
        params.memberLogins.forEach((login: string) => {
            if (login === 'dummy-login@example.com') {
                refusedMembers[login] = 'cannot_remove_last_captain';
            }
            else if (login === 'john@example.com') {
                refusedMembers[login] = 'cannot_remove_last_billing_admin';
            }
            else if (login === 'joseph@example.com') {
                unproposedMembers[login] = true;
            }
            else {
                removedMembers[login] = true;
            }
        });
        return new Promise((resolve) => {
            setTimeout(() => resolve({
                code: 200,
                content: { removedMembers, refusedMembers, unproposedMembers },
            }), 500);
        });
    }
    else {
        return new Promise((resolve) => {
            setTimeout(() => resolve({
                code: 200,
            }), 500);
        });
    }
}
