import { CoreServices } from "Services";
import { IsPasswordLeakedRequest } from "PasswordLeak/command-types";
export async function checkPasswordLeaked(
  services: CoreServices,
  params: IsPasswordLeakedRequest
): Promise<void> {
  const { password } = params;
  const { applicationModulesAccess } = services;
  const {
    commands: { temporaryCheckMasterPassword },
  } = applicationModulesAccess.createClients().masterPasswordSecurity;
  await temporaryCheckMasterPassword({ password });
  return;
}
