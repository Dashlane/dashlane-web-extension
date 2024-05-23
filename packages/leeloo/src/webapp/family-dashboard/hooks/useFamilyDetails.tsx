import React from 'react';
import { GetFamilyDetailsError, GetFamilyDetailsSuccess, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export interface UseFamilyDetails {
    familyDetails: GetFamilyDetailsSuccess['response'] | null;
    familyDetailsError: string | null;
    removeMemberFromFamilyDetails: (userId: number) => void;
}
export const useFamilyDetails = (): UseFamilyDetails => {
    const [details, setDetails] = React.useState<GetFamilyDetailsSuccess['response'] | null>(null);
    const [error, setError] = React.useState<GetFamilyDetailsError | null>(null);
    async function getFamilyDetails() {
        try {
            const result = await carbonConnector.getFamilyDetails();
            if (!result.success) {
                setError(result.error.code);
                return;
            }
            setDetails(result.response);
        }
        catch (error) {
            setError('UNKNOWN_ERROR');
        }
    }
    React.useEffect(() => {
        getFamilyDetails();
    }, []);
    const removeMember = (userId: number) => {
        if (!details) {
            return;
        }
        const regularMembers = details.members.regular.filter((member) => member.userId !== userId);
        setDetails({
            ...details,
            members: {
                ...details.members,
                regular: regularMembers,
            },
            spots: details.spots + 1,
        });
    };
    return {
        familyDetails: details,
        familyDetailsError: error,
        removeMemberFromFamilyDetails: removeMember,
    };
};
