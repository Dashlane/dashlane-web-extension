import { AnalysisStatus } from '@dashlane/autofill-contracts';
import { getQueryValue } from '@dashlane/framework-application';
import { ClientsOf } from '@dashlane/framework-contracts';
import { isSuccess } from '@dashlane/framework-types';
import type { AutofillEngineApplicationDependencies, AutofillEngineConnectors, } from '../../../Api/server/context';
import { BrowserApi } from '../../../Api/types/browser/browser-api';
import { AutofillEngineMessageLogger } from '../../../Api/types/logger';
import { fetchFeatureFlips } from '../../../config/feature-flips';
import { AutofillEngineActionsWithOptions, AutofillEngineActionTarget, } from '../../abstractions/messaging/action-serializer';
export const replicateFFInStorage = (browserApi: BrowserApi, messageLogger: AutofillEngineMessageLogger, storage: {
    key: string;
    value: boolean;
}): Promise<void> => {
    const { key, value } = storage;
    try {
        return browserApi.storage.local
            .set({
            [key]: value,
        })
            .then(() => {
            if (!*****) {
                messageLogger(`Successfully wrote the ${key} feature flip status to local storage`, {
                    timestamp: Date.now(),
                });
            }
        });
    }
    catch {
        throw new Error(`Failed to write the ${key} FF to local storage`);
    }
};
export const isFeatureFFInStorage = (browserApi: BrowserApi, storageKey: string): Promise<boolean> => {
    return browserApi.storage.local
        .get(storageKey)
        .then((storedFeatureFlip) => Boolean(storedFeatureFlip[storageKey]));
};
export const checkFeatureInCarbonFFs = async (connectors: AutofillEngineConnectors, featureFlips: string[]): Promise<boolean> => {
    try {
        const result = await Promise.all(featureFlips.map((feature) => connectors.carbon.getHasFeature(feature)));
        return result.every((featureFlip) => featureFlip);
    }
    catch {
        throw new Error('Failed to get feature flips in checkFeatureInCarbonFFs');
    }
};
export const isAnalyisEnabledOnUrl = async (connectors: AutofillEngineConnectors, grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>, url: string) => {
    const isUserGivingConsent = (await connectors.carbon
        .getGlobalExtensionSettings()
        .catch(() => ({ personalDataConsent: false }))).personalDataConsent !== false;
    const analysisStatusOnUrlQueryResult = await getQueryValue(grapheneClient.autofillSettings.queries.getAnalysisStatusOnUrl({
        url,
    }));
    return (isUserGivingConsent &&
        isSuccess(analysisStatusOnUrlQueryResult) &&
        analysisStatusOnUrlQueryResult.data.analysisStatus ===
            AnalysisStatus.ANALYSIS_ENABLED);
};
export const updateDomainAnalysisStatus = async (connectors: AutofillEngineConnectors, grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>, actions: AutofillEngineActionsWithOptions, target: AutofillEngineActionTarget, url: string) => {
    const isAnalysisEnabled = await isAnalyisEnabledOnUrl(connectors, grapheneClient, url);
    actions.updateDomainAnalysisStatus(target, isAnalysisEnabled);
    if (!isAnalysisEnabled) {
        actions.updateAutofillRecipes(target, {});
    }
};
export const updateUserDetailsAndAnalysisStatus = async (connectors: AutofillEngineConnectors, grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>, actions: AutofillEngineActionsWithOptions, target: AutofillEngineActionTarget, url: string, isUserLoggedIn: boolean) => {
    const userFeatures = isUserLoggedIn
        ? await fetchFeatureFlips(connectors)
        : {};
    actions.updateUserLoginStatus(target, isUserLoggedIn);
    actions.updateUserFeatureFlips(target, userFeatures);
    await updateDomainAnalysisStatus(connectors, grapheneClient, actions, target, url);
};
