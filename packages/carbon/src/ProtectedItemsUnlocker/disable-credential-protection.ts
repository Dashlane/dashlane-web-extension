import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { UpdateCredentialServices } from "../DataManagement/Credentials/services/saveCredentialAsPersonalDataItem";
import { updateCredential } from "DataManagement/Credentials/services/updateCredential";
interface DisableCredentialProtectionModel {
  autoprotected: boolean;
}
interface DisableCredentialProtectionUpdateModel {
  update: DisableCredentialProtectionModel;
}
const disableCredentialProtectionMapper = ({
  update: { autoprotected },
}: DisableCredentialProtectionUpdateModel) => ({
  AutoProtected: autoprotected,
});
export async function disableCredentialProtection(
  {
    storeService,
    sessionService,
    eventLoggerService,
    applicationModulesAccess,
  }: UpdateCredentialServices,
  credentialId: string
): Promise<void> {
  const state = storeService.getState();
  const existingCredential = credentialSelector(state, credentialId);
  if (!existingCredential) {
    throw new Error("Credential does not exist, cant update");
  }
  updateCredential(
    {
      storeService,
      sessionService,
      eventLoggerService,
      applicationModulesAccess,
    },
    {
      id: credentialId,
      update: {
        autoprotected: false,
      },
    },
    disableCredentialProtectionMapper
  );
}
