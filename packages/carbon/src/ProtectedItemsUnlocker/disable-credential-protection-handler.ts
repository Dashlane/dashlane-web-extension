import {
  DisableCredentialProtectionRequest,
  DisableCredentialProtectionResult,
  DisableCredentialProtectionStatus,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { disableCredentialProtection } from "./disable-credential-protection";
export async function disableCredentialProtectionHandler(
  coreServices: CoreServices,
  { credentialId }: DisableCredentialProtectionRequest
): Promise<DisableCredentialProtectionResult> {
  const {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  } = coreServices;
  try {
    await disableCredentialProtection(
      {
        storeService,
        sessionService,
        eventLoggerService,
        applicationModulesAccess,
      },
      credentialId
    );
    return { status: DisableCredentialProtectionStatus.SUCCESS };
  } catch (error) {
    return { status: DisableCredentialProtectionStatus.ERROR };
  }
}
