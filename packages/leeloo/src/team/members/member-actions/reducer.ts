import { TeamMemberInfo } from '@dashlane/communication';
import { Maybe } from 'tsmonad';
import { makeLocalReducer } from 'redux-cursor';
import { State } from '..';
import { getUnixTime } from 'date-fns';
const reducer = makeLocalReducer<State>('members', {
    members: Maybe.nothing<TeamMemberInfo[]>(),
    totalSeatCount: Maybe.nothing<number>(),
    isFreeTrial: Maybe.nothing(),
    teamName: Maybe.nothing<string>(),
    teamSecurityScore: Maybe.nothing(),
});
export const statusLoaded = reducer.action<{
    extraFreeSlots: number;
    membersNumber: number;
    isFreeTrial: boolean;
    teamName: string;
    teamSecurityScore: number;
}>('status-loaded', ({ param }) => ({
    isFreeTrial: Maybe.just(param.isFreeTrial),
    totalSeatCount: Maybe.just(param.membersNumber + param.extraFreeSlots),
    teamName: Maybe.maybe(param.teamName),
    teamSecurityScore: Maybe.maybe(param.teamSecurityScore),
}));
export const membersLoaded = reducer.action<{
    members: TeamMemberInfo[];
}>('members-loaded', ({ param }) => ({
    members: Maybe.just(param.members),
}));
export const userResentInvitation = reducer.action<TeamMemberInfo>('user-resent-invitation', ({ param, state }) => ({
    members: state.members.map((members) => members.map((member) => member.login === param.login
        ? Object.assign({}, member, {
            status: 'pending',
            isChecked: false,
            isTeamCaptain: false,
            isGroupManager: false,
        })
        : member)),
}));
export const userResentInvitationFailed = reducer.action<TeamMemberInfo>('user-resent-invitation-failed', ({ param, state }) => ({
    members: state.members.map((members) => members.map((member) => (member.login === param.login ? param : member))),
}));
export const userDemotedCaptain = reducer.action<TeamMemberInfo>('user-demoted-captain', ({ state, param }) => ({
    members: state.members.fmap((members) => members.map((member) => Object.assign({}, member, {
        isTeamCaptain: member.login === param.login ? false : member.isTeamCaptain,
    }))),
}));
export const userPromotedCaptain = reducer.action<TeamMemberInfo>('user-promoted-captain', ({ state, param }) => ({
    members: state.members.map((members) => members.map((member) => Object.assign({}, member, {
        isTeamCaptain: member.login === param.login ? true : member.isTeamCaptain,
    }))),
}));
export const userRemovedGroupManager = reducer.action<TeamMemberInfo>('user-removed-group-manager', ({ state, param }) => ({
    members: state.members.fmap((members) => members.map((member) => Object.assign({}, member, {
        isGroupManager: member.login === param.login ? false : member.isGroupManager,
    }))),
}));
export const userAddedGroupManager = reducer.action<TeamMemberInfo>('user-added-group-manager', ({ state, param }) => ({
    members: state.members.map((members) => members.map((member) => Object.assign({}, member, {
        isGroupManager: member.login === param.login ? true : member.isGroupManager,
    }))),
}));
export const userRevokedSingleMember = reducer.action<TeamMemberInfo>('user-revoked-single-member', ({ state, param }) => ({
    members: state.members.map((members) => {
        return members
            .map((member) => {
            if (member.login === param.login) {
                return Object.assign({}, member, {
                    revokedDateUnix: getUnixTime(new Date()),
                    status: 'removed',
                });
            }
            return member;
        })
            .filter((member) => Boolean(member));
    }),
}));
export const userRevokedSingleMemberFailed = reducer.action<TeamMemberInfo>('user-revoked-single-member-failed', ({ state, param }) => {
    return {
        members: state.members.map((members) => [
            ...members.filter((m) => m.login !== param.login),
            param,
        ]),
    };
});
export const newMembersProposedAction = reducer.action<string[]>('members-proposed', ({ state, param }) => ({
    members: Maybe.just(state.members.valueOr([] as TeamMemberInfo[]).concat(param.map((email) => ({
        login: email,
        status: 'pending',
        isTeamCaptain: false,
        isGroupManager: false,
        lastUpdateDateUnix: getUnixTime(new Date()),
    } as TeamMemberInfo)))),
    totalSeatCount: state.totalSeatCount.map((amount) => Math.max(amount, param.length +
        state.members
            .valueOr([] as TeamMemberInfo[])
            .filter((member) => member.status !== 'removed').length)),
}));
export default reducer;
