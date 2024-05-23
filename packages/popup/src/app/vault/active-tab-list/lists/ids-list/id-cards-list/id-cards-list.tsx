import { jsx } from '@dashlane/ui-components';
import { IdCard, ItemsQueryResult } from '@dashlane/vault-contracts';
import { VaultItemsList } from '../../common';
import { IdCardListItem } from './id-card-list-item';
interface Props {
    idCardsResult: ItemsQueryResult<IdCard>;
}
export const IdCardsList = ({ idCardsResult }: Props) => (<VaultItemsList ItemComponent={IdCardListItem} items={idCardsResult.items} titleKey={'tab/all_items/ids/id_card/title'} totalItemsCount={idCardsResult.matchCount}/>);
