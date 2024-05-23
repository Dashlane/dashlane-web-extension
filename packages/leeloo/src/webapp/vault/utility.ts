import { Collection } from '@dashlane/vault-contracts';
export const sortCollections = <CollectionType extends Collection>(collections: CollectionType[]) => collections.sort((firstCollection, secondCollection) => firstCollection.name.localeCompare(secondCollection.name));
