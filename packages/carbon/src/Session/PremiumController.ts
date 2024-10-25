import { pick } from "ramda";
import { GetPremiumStatusBodyData } from "@dashlane/server-sdk/v1";
import {
  Capabilities,
  FamilyMembership as comFamilyMembership,
  PremiumStatus as comPremiumStatus,
  PremiumStatusResponse as comPremiumStatusResponse,
  PremiumStatusResponseCapability as comPremiumStatusResponseCapability,
  NodePremiumStatus,
  PremiumStatusCode,
  PremiumStatusSpace,
  SpaceStatus,
  SubscriptionInformation,
} from "@dashlane/communication";
import Debugger from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { premiumStatusUpdated } from "Session/Store/actions";
import { refreshSpaceData } from "Session/SpaceDataController";
import { B2CStatusCode, CapabilityFromApi } from "Session/types";
import { StoreService } from "Store/index";
import { WSService } from "Libs/WS/index";
import {
  getPremiumStatus,
  PremiumStatusResponse,
} from "Libs/DashlaneApi/services/account/get-premium-status";
import { getSubscriptionInformation } from "Libs/DashlaneApi/services/account/get-subscription-information";
import {
  localSettingsNodePremiumStatusUpdated,
  localSettingsSubscriptionInformationStatusUpdated,
} from "./Store/localSettings/actions";
import { isApiError } from "Libs/DashlaneApi";
export async function refreshPremiumStatus(
  storeService: StoreService,
  wsService: WSService,
  login: string,
  uki: string
): Promise<comPremiumStatus> {
  const currentPremiumStatus = storeService.getLocalSettings().premiumStatus;
  const currentNodePremiumStatus =
    storeService.getLocalSettings().nodePremiumStatus;
  const pastWaitingTime = currentNodePremiumStatus?.currentTimestampUnix
    ? Date.now() - currentNodePremiumStatus.currentTimestampUnix > 10000
    : true;
  if (!currentNodePremiumStatus || pastWaitingTime) {
    try {
      const [newPremiumStatus, newNodePremiumStatus] = await Promise.all([
        getFreshPremiumStatus(wsService, login, uki),
        getPremiumStatus(storeService, login).then((result) => {
          if (isApiError(result)) {
            throw new Error(`${result.message} (code: ${result.code})`);
          }
          return result;
        }),
        refreshSubscriptionInformation(storeService, login),
      ]);
      const newSpaces = newPremiumStatus?.spaces || [];
      const transformedPremiumStatus =
        transformNodePremiumStatus(newNodePremiumStatus);
      const formattedNewPremiumStatus = {
        ...newPremiumStatus,
        planName: newPremiumStatus?.planName?.toLowerCase() ?? null,
      };
      storeService.dispatch(premiumStatusUpdated(formattedNewPremiumStatus));
      storeService.dispatch(
        localSettingsNodePremiumStatusUpdated(transformedPremiumStatus)
      );
      refreshSpaceData(storeService, newSpaces);
      return newPremiumStatus;
    } catch (error) {
      const message = `[PremiumController] - refreshPremiumStatus: ${error}`;
      const augmentedError = new Error(message);
      Debugger.error(augmentedError);
      sendExceptionLog({ error: augmentedError });
      if (currentPremiumStatus) {
        return currentPremiumStatus;
      }
      throw error;
    }
  } else {
    return currentPremiumStatus;
  }
}
export async function refreshSubscriptionInformation(
  storeService: StoreService,
  login: string
): Promise<SubscriptionInformation> {
  const currentSubscriptionInformation =
    storeService.getLocalSettings().subscriptionInformation;
  try {
    const subscriptionInformation = await getSubscriptionInformation(
      storeService,
      login
    );
    if (isApiError(subscriptionInformation)) {
      throw new Error(
        `${subscriptionInformation.message} (code: ${subscriptionInformation.code})`
      );
    }
    storeService.dispatch(
      localSettingsSubscriptionInformationStatusUpdated(subscriptionInformation)
    );
    return subscriptionInformation;
  } catch (error) {
    const message = `[PremiumController] - refreshUserSubscriptionStatus: ${error}`;
    const augmentedError = new Error(message);
    Debugger.error(augmentedError);
    sendExceptionLog({ error: augmentedError });
    if (currentSubscriptionInformation) {
      return currentSubscriptionInformation;
    }
    throw error;
  }
}
const getCapabilitiesFrom = (
  premiumStatusResponse: comPremiumStatusResponse
): Capabilities | undefined => {
  if (
    !premiumStatusResponse.capabilities ||
    !premiumStatusResponse.capabilities.length
  ) {
    return undefined;
  }
  const capabilitiesToReturn = premiumStatusResponse.capabilities.reduce(
    (total, responseCapability: comPremiumStatusResponseCapability) => {
      const { capability, ...rest } = responseCapability;
      total[capability] = rest;
      return total;
    },
    {}
  ) as Capabilities;
  return capabilitiesToReturn;
};
const getFamilyMembershipFrom = (
  premiumStatusResponse: comPremiumStatusResponse
): comFamilyMembership | undefined => {
  if (!premiumStatusResponse.familyMembership) {
    return undefined;
  } else {
    return premiumStatusResponse.familyMembership[0];
  }
};
export function getFreshPremiumStatus(
  wsService: WSService,
  login: string,
  uki: string
): Promise<comPremiumStatus> {
  return wsService.premium
    .status({
      login,
      uki,
      billingInformation: true,
      spaces: true,
      autoRenewal: true,
      familyInformation: true,
      previousPlan: true,
      needsAutoRenewalFailed: true,
    })
    .then((premiumStatusResponse: comPremiumStatusResponse) => {
      const premiumStatus = pick(
        [
          "statusCode",
          "billingInformation",
          "planName",
          "planType",
          "planFeature",
          "endDate",
          "spaces",
          "autoRenewal",
          "previousPlan",
          "autoRenewalFailed",
          "autoRenewInfo",
          "recoveryHash",
        ],
        premiumStatusResponse
      ) as comPremiumStatus;
      premiumStatus.capabilities = getCapabilitiesFrom(premiumStatusResponse);
      if (premiumStatusResponse.hasOwnProperty("familyMembership")) {
        premiumStatus.familyMembership = getFamilyMembershipFrom(
          premiumStatusResponse
        );
      }
      return premiumStatus as comPremiumStatus;
    });
}
const getNodeCapabilitiesFrom = (
  premiumStatusResponse: PremiumStatusResponse
): Capabilities | undefined => {
  if (!premiumStatusResponse.capabilities?.length) {
    return undefined;
  }
  return premiumStatusResponse.capabilities.reduce(
    (total, responseCapability: CapabilityFromApi) => {
      const { capability, ...rest } = responseCapability;
      total[capability] = rest;
      return total;
    },
    {}
  ) as Capabilities;
};
const getStatusCodeFrom = (
  premiumStatusResponse: PremiumStatusResponse
): PremiumStatusCode => {
  switch (premiumStatusResponse.b2cStatus.statusCode) {
    case B2CStatusCode.Subscribed: {
      if (premiumStatusResponse.b2cStatus.planName.includes("grace")) {
        return PremiumStatusCode.GRACE_PERIOD;
      }
      if (premiumStatusResponse.b2cStatus.isTrial) {
        return PremiumStatusCode.NEW_USER;
      }
      if (premiumStatusResponse.b2cStatus.autoRenewal) {
        return PremiumStatusCode.PREMIUM_CANCELLED;
      }
      return PremiumStatusCode.PREMIUM;
    }
    case B2CStatusCode.Legacy: {
      return PremiumStatusCode.OLD_ACCOUNT;
    }
    case B2CStatusCode.Free:
    default:
      return PremiumStatusCode.NO_PREMIUM;
  }
};
function transformAdminsList(adminsList: string[]) {
  return adminsList.map((login) => ({
    login,
  }));
}
function transformTeams(
  b2bStatus: GetPremiumStatusBodyData["b2bStatus"]
): PremiumStatusSpace[] {
  const spaces: PremiumStatusSpace[] = [];
  if (b2bStatus.currentTeam) {
    spaces.push({
      associatedEmail: b2bStatus.currentTeam.associatedEmail,
      billingAdmins: transformAdminsList(
        b2bStatus.currentTeam.teamMembership.billingAdmins
      ),
      color: b2bStatus.currentTeam.teamInfo.color,
      companyName: b2bStatus.currentTeam.teamInfo.name,
      info: {
        ...b2bStatus.currentTeam.teamInfo,
      },
      invitationDate: b2bStatus.currentTeam.invitationDateUnix,
      isBillingAdmin: b2bStatus.currentTeam.teamMembership.isBillingAdmin,
      isSSOUser: b2bStatus.currentTeam.teamMembership.isSSOUser,
      isTeamAdmin: b2bStatus.currentTeam.teamMembership.isTeamAdmin,
      isGroupManager: b2bStatus.currentTeam.teamMembership.isGroupManager,
      joinDate: b2bStatus.currentTeam.joinDateUnix,
      letter: b2bStatus.currentTeam.teamInfo.letter,
      membersNumber: b2bStatus.currentTeam.teamInfo.membersNumber,
      planType: b2bStatus.currentTeam.teamInfo.planType,
      revokeDate: null,
      shouldDelete: false,
      status: SpaceStatus.Accepted,
      teamAdmins: transformAdminsList(
        b2bStatus.currentTeam.teamMembership.teamAdmins
      ),
      teamId: b2bStatus.currentTeam.teamId.toString(),
      teamName: b2bStatus.currentTeam.teamName,
      tier: b2bStatus.currentTeam.planFeature,
    });
  }
  if (b2bStatus.pastTeams) {
    b2bStatus.pastTeams.forEach((team) => {
      spaces.push({
        associatedEmail: team.associatedEmail,
        billingAdmins: transformAdminsList(team.teamMembership.billingAdmins),
        color: team.teamInfo.color,
        companyName: team.teamName,
        info: {
          ...team.teamInfo,
        },
        invitationDate: team.invitationDateUnix,
        isBillingAdmin: team.teamMembership.isBillingAdmin,
        isSSOUser: team.teamMembership.isSSOUser,
        isTeamAdmin: team.teamMembership.isTeamAdmin,
        isGroupManager: team.teamMembership.isGroupManager,
        joinDate: team.joinDateUnix,
        letter: team.teamInfo.letter,
        membersNumber: team.teamInfo.membersNumber,
        planType: team.teamInfo.planType,
        revokeDate: team.revokeDateUnix,
        shouldDelete: team.shouldDelete,
        status: team.status,
        teamAdmins: transformAdminsList(team.teamMembership.teamAdmins),
        teamId: team.teamId.toString(),
        teamName: team.teamName,
        tier: team.planFeature,
      });
    });
  }
  return spaces;
}
function transformCurrentTeam(
  currentTeam: PremiumStatusResponse["b2bStatus"]["currentTeam"]
): NodePremiumStatus["b2bStatus"]["currentTeam"] {
  return {
    ...currentTeam,
    teamMembership: {
      ...currentTeam.teamMembership,
      billingAdmins: currentTeam.teamMembership.billingAdmins.map((login) => ({
        login,
      })),
      teamAdmins: currentTeam.teamMembership.teamAdmins.map((login) => ({
        login,
      })),
    },
  };
}
function transformPastTeam(
  currentTeam: PremiumStatusResponse["b2bStatus"]["pastTeams"][number]
): NodePremiumStatus["b2bStatus"]["pastTeams"][number] {
  return {
    ...currentTeam,
    teamMembership: {
      ...currentTeam.teamMembership,
      billingAdmins: transformAdminsList(
        currentTeam.teamMembership.billingAdmins
      ),
      teamAdmins: transformAdminsList(currentTeam.teamMembership.teamAdmins),
    },
  };
}
export function transformNodePremiumStatus(
  premiumStatusResponse: PremiumStatusResponse
): NodePremiumStatus {
  const currentTeamObj = premiumStatusResponse.b2bStatus?.currentTeam
    ? {
        currentTeam: transformCurrentTeam(
          premiumStatusResponse.b2bStatus.currentTeam
        ),
      }
    : {};
  const pastTeamsObj = premiumStatusResponse.b2bStatus?.pastTeams
    ? {
        pastTeams:
          premiumStatusResponse.b2bStatus.pastTeams.map(transformPastTeam),
      }
    : {};
  return {
    ...premiumStatusResponse.b2cStatus,
    planName: premiumStatusResponse.b2cStatus?.planName?.toLowerCase() ?? null,
    currentTimestampUnix: Date.now(),
    isTrial: premiumStatusResponse.b2cStatus.isTrial,
    statusCode: getStatusCodeFrom(premiumStatusResponse),
    spaces: premiumStatusResponse.b2bStatus
      ? transformTeams(premiumStatusResponse.b2bStatus)
      : [],
    b2bStatus: {
      statusCode: premiumStatusResponse.b2bStatus?.statusCode,
      hasPaid: premiumStatusResponse.b2bStatus?.hasPaid,
      ...currentTeamObj,
      ...pastTeamsObj,
    },
    capabilities: getNodeCapabilitiesFrom(premiumStatusResponse),
  };
}
