import { linkedWebsitesApi } from '@dashlane/autofill-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import { useHasFeatureEnabled } from './useHasFeature';
import { useModuleCommands } from '@dashlane/framework-react';
export const AUTOFILL_GRAPHENE_MIGRATION_FF = 'autofill_web_grapheneMigration_dev';
export const AUTOFILL_GRAPHENE_MIGRATION_FF_PROD = 'autofill_web_grapheneMigration';
export const useUpdateLinkedWebsites = () => {
    const { updateLinkedWebsites } = useModuleCommands(linkedWebsitesApi);
    const hasAutofillGrapheneMigrationDevFF = useHasFeatureEnabled(AUTOFILL_GRAPHENE_MIGRATION_FF);
    const hasAutofillGrapheneMigrationProdFF = useHasFeatureEnabled(AUTOFILL_GRAPHENE_MIGRATION_FF_PROD);
    const updateLinkedWebsitesAddedByUser = async (credentialId: string, linkedWebsitesAddedByUser: string[]) => {
        if (hasAutofillGrapheneMigrationDevFF ||
            hasAutofillGrapheneMigrationProdFF) {
            updateLinkedWebsites({
                credentialId: credentialId,
                updatedLinkedWebsitesList: linkedWebsitesAddedByUser,
            });
        }
        else {
            await carbonConnector.updateLinkedWebsites({
                credentialId: credentialId,
                updatedLinkedWebsitesDomainList: linkedWebsitesAddedByUser,
            });
        }
    };
    return updateLinkedWebsitesAddedByUser;
};
