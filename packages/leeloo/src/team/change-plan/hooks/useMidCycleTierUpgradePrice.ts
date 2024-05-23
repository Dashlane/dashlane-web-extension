import { useState } from 'react';
import { carbonConnector } from 'libs/carbon/connector';
import { MidCycleTierUpgradePrice } from '@dashlane/communication';
interface UseMidCycleTierUpgradePriceProps {
    seats: number;
    planName?: string;
    onError?: () => void;
}
interface UseMidCycleTierUpgradePriceOutput {
    isLoading: boolean;
    midCycleTierUpgradePrice?: MidCycleTierUpgradePrice;
}
export function useMidCycleTierUpgradePrice({ seats, planName, onError, }: UseMidCycleTierUpgradePriceProps): UseMidCycleTierUpgradePriceOutput {
    const [currentSeats, setCurrentSeats] = useState<number>(0);
    const [currentPlanName, setCurrentPlanName] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [midCycleTierUpgradePrice, setMidCycleTierUpgradePrice] = useState<MidCycleTierUpgradePrice>();
    const getMidCycleTierUpgradePrice = async () => {
        if (seats !== undefined && planName) {
            const result = await carbonConnector.getMidCycleTierUpgradePrice({
                numberOfSeats: seats,
                newPlan: planName,
            });
            setIsLoading(false);
            if (!result.success) {
                if (onError) {
                    onError();
                }
                return;
            }
            setMidCycleTierUpgradePrice(() => result.data);
        }
    };
    if (seats !== currentSeats || (planName && planName !== currentPlanName)) {
        setCurrentSeats(seats);
        setCurrentPlanName(planName);
        setIsLoading(true);
        getMidCycleTierUpgradePrice();
    }
    return { isLoading, midCycleTierUpgradePrice };
}
