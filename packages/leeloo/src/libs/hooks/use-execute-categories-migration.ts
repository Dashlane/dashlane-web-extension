import { useEffect } from 'react';
import { DataStatus, useFeatureFlips, useModuleCommands, } from '@dashlane/framework-react';
import { vaultOrganizationApi } from '@dashlane/vault-contracts';
import { useUserLogin } from './useUserLogin';
import { hashSha256 } from 'libs/utils/hashSha256';
const COLLECTION_MIGRATION_PROD_FF = 'vault_web_collection_migration_space_prod_v2';
export const useExecuteCategoriesMigration = () => {
    const { migrateCategories } = useModuleCommands(vaultOrganizationApi);
    const username = useUserLogin();
    const retrievedFeatureFlips = useFeatureFlips();
    const isCollectionMigrationEnabled = retrievedFeatureFlips.status === DataStatus.Success &&
        retrievedFeatureFlips.data[COLLECTION_MIGRATION_PROD_FF];
    useEffect(() => {
        if (!username || !isCollectionMigrationEnabled) {
            return;
        }
        hashSha256(username)
            .then((hashedUsername: string) => {
            migrateCategories(hashedUsername);
        })
            .catch(() => {
        });
    }, [username, isCollectionMigrationEnabled]);
};
