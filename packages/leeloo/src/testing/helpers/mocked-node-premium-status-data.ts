import { NodePremiumStatus, PremiumStatusCode, SpaceTiers, } from '@dashlane/communication';
export const mockedNodePremiumStatusData: NodePremiumStatus = {
    statusCode: PremiumStatusCode.PREMIUM,
    b2bStatus: {
        statusCode: 'in_team',
        currentTeam: {
            teamMembership: {
                isSSOUser: false,
                isGroupManager: true,
                teamAdmins: [],
                billingAdmins: [
                    {
                        login: 'admin@potato.inc',
                    },
                ],
                isTeamAdmin: true,
                isBillingAdmin: true,
            },
            joinDateUnix: 0,
            planFeature: SpaceTiers.Business,
            isSoftDiscontinued: false,
            planName: '2022_team_business_tier',
            teamId: 0,
            teamInfo: {
                name: 'Potato',
                membersNumber: 2,
                planType: 'business',
            },
        },
    },
};
