import React from 'react';
import { BankData } from '@dashlane/communication';
import { areBanksReady, useBanks } from './useBanks';
export const EMPTY_COUNTRY_BANKS: BankData[] = [];
export const areCountryBanksReady = (banks: BankData[]): boolean => banks !== EMPTY_COUNTRY_BANKS;
export const useCountryBanks = (country: string): BankData[] => {
    const allBanks = useBanks();
    return React.useMemo(() => {
        const allBanksReady = areBanksReady(allBanks);
        if (!allBanksReady) {
            return EMPTY_COUNTRY_BANKS;
        }
        const countryBanks = allBanks[country] ?? [];
        const copy = countryBanks.slice();
        copy.sort((a: BankData, b: BankData) => a.localizedString.localeCompare(b.localizedString));
        return copy;
    }, [allBanks, country]);
};
