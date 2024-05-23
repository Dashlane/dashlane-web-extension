import { SpaceTiers } from '@dashlane/communication';
import { addYears } from 'date-fns';
import dummyTeamMembers from './utils/dummyTeamMembers';
import { TeamPlansStatusResult } from 'libs/api/types';
export default function teamPlansStatusResponse(): Promise<TeamPlansStatusResult> {
    const currentDate = new Date();
    const currentDateUnix = Math.floor(currentDate.getTime() / 1000);
    return new Promise<TeamPlansStatusResult>((resolve) => {
        setTimeout(() => resolve({
            code: 200,
            content: {
                team: {
                    assignedPlanDetails: {
                        currency: 'usd',
                        duration: 'y-1',
                        name: 'stripeAnnualC_team',
                        planType: 'stripe',
                        priceRanges: [
                            {
                                startMembers: 0,
                                price: 2400,
                                equivalentPrice: 2400,
                            },
                            {
                                startMembers: 11,
                                price: 1800,
                                equivalentPrice: 1800,
                            },
                            {
                                startMembers: 16,
                                price: 1500,
                                equivalentPrice: 1500,
                            },
                        ],
                    },
                    planDetails: {
                        currency: 'usd',
                        duration: 'y-1',
                        name: 'stripeAnnualC_team',
                        planType: 'stripe',
                        priceRanges: [
                            {
                                startMembers: 0,
                                price: 2400,
                                equivalentPrice: 2400,
                            },
                            {
                                startMembers: 11,
                                price: 1800,
                                equivalentPrice: 1800,
                            },
                            {
                                startMembers: 16,
                                price: 1500,
                                equivalentPrice: 1500,
                            },
                        ],
                    },
                    info: {
                        name: 'Testers',
                        teamDomains: ['team.com'],
                        sharingDisabled: false,
                        mpPersistenceDisabled: false,
                        forcedDomainsEnabled: false,
                        removeForcedContentEnabled: false,
                        lockOnExit: false,
                        collectSensitiveDataAuditLogsEnabled: false,
                        autologinDomainDisabledArray: ['evil.com', 'bigcorp.com'],
                        forceAutomaticLogout: 30,
                        cryptoForcedPayload: '',
                    },
                    membersNumber: 150,
                    extraFreeSlots: 5,
                    isFreeTrial: false,
                    isExpiringSoon: false,
                    isGracePeriod: false,
                    creationDateUnix: currentDateUnix,
                    lastBillingDateUnix: currentDateUnix,
                    nextBillingDetails: {
                        amount: 23992,
                        currency: 'usd',
                        dateUnix: Math.floor(addYears(currentDate, 1).getTime() / 1000),
                    },
                    planId: 'freetrial_1month30licenses',
                    planType: 'free_trial',
                    planTier: SpaceTiers.Legacy,
                    remainingSlots: 30 - dummyTeamMembers().length,
                    statusCode: 1,
                    usersToBeRenewedCount: dummyTeamMembers().filter((member) => member.status !== 'removed').length,
                    securityIndex: 42,
                },
            },
            message: 'OK',
        }), 1000);
    });
}
