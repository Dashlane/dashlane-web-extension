import { ActivateVpnAccountRequest } from "@dashlane/communication";
import { CoreServices } from "Services";
import { makeVpnLogger } from "VPN/Infrastructure/vpn-logger";
import { openDashlaneVpnAPI } from "../Infrastructure/dashlane-vpn-api";
import { CreateVpnService } from "../services";
export const activateVpnAccountHandler = async (
  services: CoreServices,
  params: ActivateVpnAccountRequest
) => {
  const vpn = CreateVpnService(
    {
      generator: openDashlaneVpnAPI(services.storeService),
      logger: makeVpnLogger(services),
    },
    services
  );
  const { user: userSessionService } = services.sessionService.getInstance();
  await vpn.generateCredential(userSessionService, params.email);
};
