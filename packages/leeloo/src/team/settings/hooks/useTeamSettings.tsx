import * as React from 'react';
import { PlanTier, SetTeamSettingsRequest, TeamCapabilities, TeamSettings, } from '@dashlane/communication';
import { setTeamSettings } from 'libs/carbon/triggers';
import { getTeamInfo } from 'team/settings/team-settings-services';
interface UseTeamSettings {
    teamSettingsLoading: boolean;
    teamSettingsError: Error | null;
    teamSettings?: TeamSettings;
    updateTeamSettings: (settings: TeamSettings) => Promise<void>;
    planTier: PlanTier | null;
    teamCapabilities: TeamCapabilities | null;
}
export function useTeamSettings(teamId: number | null): UseTeamSettings {
    const [teamSettingsLoading, setTeamSettingsLoading] = React.useState(true);
    const [teamSettingsData, setTeamSettingsData] = React.useState<TeamSettings>({});
    const [teamSettingsError, setTeamSettingsError] = React.useState<Error | null>(null);
    const [teamCapabilities, setTeamCapabilities] = React.useState<TeamCapabilities | null>(null);
    const [planTier, setTeamPlanTier] = React.useState<PlanTier | null>(null);
    const updateTeamSettings = async (newSettings: TeamSettings) => {
        if (teamId === null) {
            return;
        }
        const setTeamSettingsRequest: SetTeamSettingsRequest = {
            teamId,
            settings: newSettings,
        };
        try {
            await setTeamSettings(setTeamSettingsRequest);
        }
        catch (e) {
            throw new Error(e?.additionalInfo?.message ?? 'Failed to save metadata');
        }
        const mergedSettings = { ...teamSettingsData, ...newSettings };
        setTeamSettingsData(mergedSettings);
    };
    React.useEffect(() => {
        if (teamId === undefined) {
            return;
        }
        const abortController = new AbortController();
        const loadTeamSettings = async () => {
            setTeamSettingsLoading(true);
            try {
                const { teamInfo: { ssoServiceProviderUrl, ssoIdpMetadata, ssoEnabled, recoveryEnabled, duoSecretKey, duoIntegrationKey, duoApiHostname, duo, activeDirectoryToken, activeDirectorySyncType, activeDirectorySyncStatus, uuid, }, capabilities, planTier: tier, } = await getTeamInfo();
                if (abortController.signal.aborted) {
                    return;
                }
                setTeamSettingsData({
                    ssoServiceProviderUrl,
                    ssoIdpMetadata,
                    ssoEnabled,
                    recoveryEnabled,
                    duoSecretKey,
                    duoIntegrationKey,
                    duoApiHostname,
                    duo,
                    activeDirectoryToken,
                    activeDirectorySyncType,
                    activeDirectorySyncStatus,
                    uuid,
                });
                setTeamPlanTier(tier);
                setTeamCapabilities(capabilities);
            }
            catch (error) {
                const augmentedError = new Error(`useTeamSettings: ${error}`);
                setTeamSettingsError(augmentedError);
            }
            finally {
                setTeamSettingsLoading(false);
            }
        };
        loadTeamSettings();
        return () => {
            abortController.abort();
        };
    }, [teamId]);
    return {
        teamSettingsLoading,
        teamSettingsError,
        teamSettings: teamSettingsData,
        updateTeamSettings,
        planTier,
        teamCapabilities,
    };
}
