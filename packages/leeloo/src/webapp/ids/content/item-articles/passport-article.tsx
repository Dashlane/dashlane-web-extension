import React from 'react';
import { Country, Passport, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { IdItemArticle } from './id-item-article';
interface Props {
    item: Passport;
    route: string;
}
export const PassportArticle = ({ item, route }: Props) => {
    const { translate } = useTranslate();
    const country = item.country !== Country.UNIVERSAL && item.country !== Country.NO_TYPE
        ? item.country
        : undefined;
    return (<IdItemArticle itemId={item.id} title={item.idName} description={item.idNumber} additionalDescription={country ? translate(`country_name_${country}`) : undefined} country={item.country} type={VaultItemType.Passport} editRoute={route} copiableValue={item.idNumber}/>);
};
