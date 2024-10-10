import { PaymentUpdateToken } from "@dashlane/communication";
import { CoreServices } from "Services";
import { ukiSelector } from "Authentication";
import { isApiError } from "Libs/DashlaneApi";
import { isAuthenticatedSelector, userLoginSelector } from "Session/selectors";
import {
  getCurrentTeamId,
  isBillingAdminInCurrentSpace,
  isTeamAdminInCurrentSpace,
} from "Store/helpers/spaceData";
import { getAuthenticationTokenForCardUpdate } from "Libs/DashlaneApi/services/authentication/get-authentication-token-for-card-update";
import { NewCardToken, NewCardTokenResponse } from "Libs/WS/NewCardToken";
export async function requestPaymentUpdateAuthenticationToken(
  services: CoreServices
): Promise<PaymentUpdateToken> {
  try {
    const { storeService } = services;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    if (!isAuthenticatedSelector(state)) {
      return { success: false };
    }
    const response = await getAuthenticationTokenForCardUpdate(
      storeService,
      login
    );
    if (isApiError(response)) {
      return { success: false };
    }
    const teamId = getCurrentTeamId(state.userSession.spaceData);
    const isTeamAdmin = isTeamAdminInCurrentSpace(state.userSession.spaceData);
    const isTeamBillingAdmin = isBillingAdminInCurrentSpace(
      state.userSession.spaceData
    );
    const auth = {
      login,
      uki: ukiSelector(state),
      teamId,
    };
    let b2bCardResponse: NewCardTokenResponse;
    let b2bPaymentTokens = {};
    if (teamId && (isTeamAdmin || isTeamBillingAdmin)) {
      const wsInfo = {
        name: "teamPlans",
        version: 1,
      };
      b2bCardResponse = await NewCardToken(auth, wsInfo);
      if (b2bCardResponse.code !== 200) {
        return { success: false };
      }
      b2bPaymentTokens = {
        customerId: b2bCardResponse.content.customerId,
        tokenId: b2bCardResponse.content.tokenId,
      };
    }
    let b2cPaymentTokens = {};
    const wsInfo = {
      name: "premium",
      version: 3,
    };
    const b2cCardResponse = await NewCardToken(auth, wsInfo);
    if (b2cCardResponse.code !== 200) {
      return { success: false };
    }
    b2cPaymentTokens = {
      customerId: b2cCardResponse.content.customerId,
      tokenId: b2cCardResponse.content.tokenId,
    };
    return {
      success: true,
      accessKey: response.accessKey,
      creationDateUnix: response.creationDateUnix,
      expirationDateUnix: response.expirationDateUnix,
      secretKey: response.secretKey,
      livemode: response.livemode,
      b2bPaymentTokens,
      b2cPaymentTokens,
    };
  } catch (error) {
    return { success: false };
  }
}
