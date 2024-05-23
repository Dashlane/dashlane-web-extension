import React from 'react';
import { SocialSecurityId, VaultItemType } from '@dashlane/vault-contracts';
import { IdItemArticle } from './id-item-article';
interface Props {
    item: SocialSecurityId;
    route: string;
}
export const SocialSecurityIdArticle = ({ item, route }: Props) => {
    return (<IdItemArticle itemId={item.id} title={item.idName} description={item.idNumber} country={item.country} type={VaultItemType.SocialSecurityId} editRoute={route} copiableValue={item.idNumber}/>);
};
