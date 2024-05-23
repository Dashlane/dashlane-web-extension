import { PremiumStatusResult } from 'libs/api/types';
import { addDays, getUnixTime } from 'date-fns';
export default function premiumStatusResponse(): Promise<PremiumStatusResult> {
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            endDate: getUnixTime(addDays(new Date(), 25)),
            planName: 'FreeTrial',
            teamMembership: {
                teamId: 5774,
                billingAdmins: ['john@example.com'],
            },
            autoRenewal: false,
        }), 200);
    });
}
