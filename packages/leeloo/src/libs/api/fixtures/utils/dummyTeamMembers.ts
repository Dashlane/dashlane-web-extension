import { SpaceStatus, TeamMemberInfo, TeamMemberStatus, } from '@dashlane/communication';
import { getUnixTime, parseISO } from 'date-fns';
export interface DummyMember {
    name?: string;
    isBillingAdmin?: boolean;
    isCaptain?: boolean;
    email?: string;
    status?: TeamMemberStatus;
    securityIndex?: number;
    nbrPasswords?: number;
    lastLogin?: string;
    revokedDate?: string;
    passwordStrength80_100Count?: number;
    compromisedPasswords?: number;
    weakPasswords?: number;
    reused?: number;
    reusedDistinct?: number;
}
interface DummyMembersCache {
    members?: TeamMemberInfo[];
}
const CACHE: DummyMembersCache = {};
function random(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}
function randomName(): string {
    let name = '';
    const consonants = 'bcdfghjklmnprstvwz';
    const vowels = 'aeiou';
    for (let i = 0; i < random(2, 4); i++) {
        name += consonants[random(0, 17)] + vowels[random(0, 4)];
    }
    return name;
}
export default function dummyMembers(): TeamMemberInfo[] {
    if (!CACHE.members) {
        const members: DummyMember[] = [
            { isCaptain: true },
            { isBillingAdmin: true },
            {},
            { status: SpaceStatus.Pending },
            { status: SpaceStatus.Removed, revokedDate: '2001-02-09' },
        ];
        for (let i = 0; i < 120; i++) {
            members.push({});
        }
        CACHE.members = members.map((member: DummyMember, index: number): TeamMemberInfo => {
            const lastLogin = [
                random(2010, 2016),
                random(101, 112).toString().substr(1, 2),
                random(101, 128).toString().substr(1, 2),
            ].join('-');
            const nbrPasswords = random(1, 250);
            const compromisedPasswords = random(0, nbrPasswords);
            const weakPasswords = random(0, nbrPasswords);
            const reused = random(0, nbrPasswords);
            return {
                login: !index
                    ? 'dummy-login@example.com'
                    : `${(member.name ?? '') + index}@example.com`,
                status: member.status ? member.status : 'accepted',
                isBillingAdmin: !!member.isCaptain,
                isTeamCaptain: !!member.isCaptain,
                name: member.name ?? randomName(),
                lastUpdateDateUnix: getUnixTime(parseISO(member.lastLogin ?? lastLogin)),
                revokedDateUnix: member.revokedDate
                    ? getUnixTime(parseISO(member.revokedDate))
                    : null,
                securityIndex: member.securityIndex ?? random(1, 100),
                passwordStrength80_100Count: member.passwordStrength80_100Count ?? random(1, 100),
                nbrPasswords: member.nbrPasswords ?? nbrPasswords,
                compromisedPasswords: member.compromisedPasswords ?? compromisedPasswords,
                weakPasswords: member.weakPasswords ?? weakPasswords,
                reused: member.reused ?? reused,
                reusedDistinct: member.reusedDistinct ?? 0,
            } as TeamMemberInfo;
        });
    }
    return CACHE.members;
}
