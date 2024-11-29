import {
  GetTeamInfoError,
  PlanTier,
  Seats,
  TeamCapabilities,
  TeamInfo,
} from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
export interface TeamInfoResponseData {
  teamInfo: TeamInfo;
  planTier: PlanTier;
  capabilities: TeamCapabilities;
  seats: Seats;
}
export async function getTeamInfo(): Promise<TeamInfoResponseData> {
  const result = await carbonConnector.getTeamInfo();
  if (result.success) {
    const {
      data: { teamInfo, planTier, capabilities, seats },
    } = result;
    return { teamInfo, planTier, capabilities, seats };
  } else {
    const { message } = result as GetTeamInfoError;
    throw new Error(`getTeamInfo: failed with error: ${message}`);
  }
}
export interface LastADSyncDateData {
  lastSyncRequestForTeamUnix: number;
  lastSuccessfulSyncRequestForTeamUnix: number;
}
export async function getLastADSyncDate(): Promise<LastADSyncDateData> {
  const result = await carbonConnector.getLastADSyncDate();
  if (result.success) {
    return {
      lastSyncRequestForTeamUnix: result.data.lastSyncRequestForTeam,
      lastSuccessfulSyncRequestForTeamUnix:
        result.data.lastSuccessfulSyncRequestForTeam,
    };
  }
  throw new Error(`getScimLastSyncDate: failed with error ${result.error}`);
}
