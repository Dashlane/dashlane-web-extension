import { useState } from 'react';
import { ExpectedTaxInformation } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
interface UseExpectedTaxInformationProps {
    total: number | null | undefined;
    onError?: () => void;
}
interface UseExpectedTaxInformationOutput {
    isLoading: boolean;
    expectedTaxInformation: ExpectedTaxInformation | undefined;
}
export function useExpectedTaxInformation({ total, onError, }: UseExpectedTaxInformationProps): UseExpectedTaxInformationOutput {
    const [currentTotal, setCurrentTotal] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);
    const [expectedTaxInformation, setExpectedTaxInformation] = useState<ExpectedTaxInformation>();
    const getExpectedTaxInformation = async () => {
        if (total && total <= 0) {
            setIsLoading(false);
            setExpectedTaxInformation({
                expectedTaxesInCents: 0,
            });
        }
        else if (total) {
            const result = await carbonConnector.getExpectedTaxInformation({
                priceInCents: total,
            });
            setIsLoading(false);
            if (!result.success) {
                if (onError) {
                    onError();
                }
                return;
            }
            setExpectedTaxInformation(() => result.data);
        }
    };
    if (total && total !== currentTotal) {
        setCurrentTotal(total);
        setIsLoading(true);
        getExpectedTaxInformation();
    }
    return { isLoading, expectedTaxInformation };
}
