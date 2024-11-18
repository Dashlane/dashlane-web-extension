import { CoreServices } from "Services";
interface IsPasswordWeakRequest {
  password: string;
}
export async function checkPasswordWeak(
  services: CoreServices,
  params: IsPasswordWeakRequest
): Promise<void> {
  const { password } = params;
  const { applicationModulesAccess } = services;
  const {
    commands: { temporaryCheckMasterPasswordWeak },
  } = applicationModulesAccess.createClients().masterPasswordSecurity;
  await temporaryCheckMasterPasswordWeak({ password });
  return;
}
