import { useCallback, useState } from 'react';
import { ChangeInviteLinkTeamKeySuccessData, CreateInviteLinkSuccessData, GetInviteLinkForAdminSuccessData, GetInviteLinkSuccessData, InviteLinkResponseFailure, RequestInviteLinkTokenSuccessData, ToggleInviteLinkSuccessData, UnknownTeamAdminError, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
interface UseInviteLinkData {
    inviteLinkDataLoading: boolean;
    inviteLinkError: InviteLinkResponseFailure['error']['code'] | null;
    inviteLinkData: GetInviteLinkSuccessData | null;
    inviteLinkDataForAdmin: GetInviteLinkForAdminSuccessData | null;
    getInviteLinkData: (teamKey: string) => Promise<GetInviteLinkSuccessData | null>;
    requestInviteLinkToken: (teamUuid: string, login: string) => Promise<RequestInviteLinkTokenSuccessData | null>;
    getInviteLinkDataForAdmin: () => Promise<GetInviteLinkForAdminSuccessData | null>;
    createInviteLink: (displayName: string) => Promise<CreateInviteLinkSuccessData | null>;
    changeInviteLinkTeamKey: () => Promise<ChangeInviteLinkTeamKeySuccessData | null>;
    toggleInviteLink: (disabled: boolean) => Promise<ToggleInviteLinkSuccessData | null>;
}
export function useInviteLinkData(): UseInviteLinkData {
    const [inviteLinkDataLoading, setInviteLinkDataLoading] = useState(true);
    const [inviteLinkData, setInviteLinkData] = useState<GetInviteLinkSuccessData | null>(null);
    const [inviteLinkDataForAdmin, setInviteLinkDataForAdmin] = useState<GetInviteLinkForAdminSuccessData | null>(null);
    const [inviteLinkError, setInviteLinkError] = useState<InviteLinkResponseFailure['error']['code'] | null>(null);
    const requestInviteLinkToken = useCallback(async (teamUuid: string, login: string) => {
        try {
            const result = await carbonConnector.requestInviteLinkToken({
                teamUuid,
                login,
            });
            if (!result.success) {
                setInviteLinkError(result.error.code);
            }
            else {
                return result.data;
            }
        }
        catch {
            setInviteLinkError(UnknownTeamAdminError);
        }
        return null;
    }, []);
    const getInviteLinkData = useCallback(async (teamKey: string) => {
        setInviteLinkDataLoading(true);
        try {
            const result = await carbonConnector.getInviteLink({ teamKey });
            if (!result.success) {
                setInviteLinkError(result.error.code);
            }
            else {
                setInviteLinkData(result.data);
                return result.data;
            }
        }
        catch {
            setInviteLinkError(UnknownTeamAdminError);
        }
        finally {
            setInviteLinkDataLoading(false);
        }
        return null;
    }, []);
    const getInviteLinkDataForAdmin = useCallback(async () => {
        setInviteLinkDataLoading(true);
        try {
            const result = await carbonConnector.getInviteLinkForAdmin({});
            if (!result.success) {
                setInviteLinkError(result.error.code);
            }
            else {
                setInviteLinkDataForAdmin(result.data);
                return result.data;
            }
        }
        catch {
            setInviteLinkError(UnknownTeamAdminError);
        }
        finally {
            setInviteLinkDataLoading(false);
        }
        return null;
    }, []);
    const createInviteLink = useCallback(async (displayName: string) => {
        setInviteLinkDataLoading(true);
        try {
            const result = await carbonConnector.createInviteLink({ displayName });
            if (!result.success) {
                setInviteLinkError(result.error.code);
            }
            else {
                return result.data;
            }
        }
        catch {
            setInviteLinkError(UnknownTeamAdminError);
        }
        finally {
            setInviteLinkDataLoading(false);
        }
        return null;
    }, []);
    const changeInviteLinkTeamKey = useCallback(async () => {
        setInviteLinkDataLoading(true);
        try {
            const result = await carbonConnector.changeInviteLinkTeamKey({});
            if (!result.success) {
                setInviteLinkError(result.error.code);
            }
            else {
                return result.data;
            }
        }
        catch {
            setInviteLinkError(UnknownTeamAdminError);
        }
        finally {
            setInviteLinkDataLoading(false);
        }
        return null;
    }, []);
    const toggleInviteLink = useCallback(async (disabled: boolean) => {
        setInviteLinkDataLoading(true);
        try {
            const result = await carbonConnector.toggleInviteLink({ disabled });
            if (!result.success) {
                setInviteLinkError(result.error.code);
            }
            else {
                return result.data;
            }
        }
        catch {
            setInviteLinkError(UnknownTeamAdminError);
        }
        finally {
            setInviteLinkDataLoading(false);
        }
        return null;
    }, []);
    return {
        inviteLinkDataLoading,
        inviteLinkError,
        inviteLinkData,
        inviteLinkDataForAdmin,
        getInviteLinkData,
        requestInviteLinkToken,
        getInviteLinkDataForAdmin,
        createInviteLink,
        changeInviteLinkTeamKey,
        toggleInviteLink,
    };
}
