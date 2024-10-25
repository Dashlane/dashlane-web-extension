import { contactInfoSelector } from "Account/ContactInfo/selectors";
import { VpnAccountActivationErrorType } from "@dashlane/communication";
import { createCredential } from "DataManagement/Credentials/services/createCredential";
import { updateCredential } from "DataManagement/Credentials/services/updateCredential";
import { DataManagementControllerServices } from "DataManagement/DataManagementController";
import { CarbonError } from "Libs/Error";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { userLoginSelector } from "Session/selectors";
import {
  vpnAccountActivatingAction,
  vpnAccountGenerationDoneAction,
  vpnAccountGenerationErrorAction,
} from "./actions";
import { VPN_CREDENTIAL_NAME, VPN_CREDENTIAL_URL } from "./constants";
import { VpnErrorType, VpnInfrastructure } from "./Infrastructure/types";
import { vpnCredentialSelector } from "./selectors";
import { UserSessionService } from "User/Services/types";
export interface VpnService {
  generateCredential: (
    userSessionService: UserSessionService,
    email?: string
  ) => Promise<void>;
}
interface VpnCredentialModel {
  email: string;
  password: string;
  url: string;
  login: string;
  title: string;
}
interface VpnCredentialUpdateModel {
  update: VpnCredentialModel;
}
const credentialUpdateMapper = ({
  update: { title },
}: VpnCredentialUpdateModel) => ({ Title: title });
const credentialCreateMapper = ({ title }: VpnCredentialModel) => ({
  Title: title,
});
export const CreateVpnService = (
  infrastructure: VpnInfrastructure,
  services: DataManagementControllerServices
): VpnService => {
  const saveCredential = async (
    email: string,
    password: string,
    login: string
  ): Promise<void> => {
    const credential = vpnCredentialSelector(services.storeService.getState());
    const credentialModel = {
      email: email,
      password: password,
      url: VPN_CREDENTIAL_URL,
      login,
      title: VPN_CREDENTIAL_NAME,
    };
    if (credential) {
      const credentialUpdateModel = {
        id: credential.Id,
        update: {
          ...credentialModel,
        },
      };
      await updateCredential<VpnCredentialUpdateModel>(
        {
          storeService: services.storeService,
          sessionService: services.sessionService,
          eventLoggerService: services.eventLoggerService,
          applicationModulesAccess: services.applicationModulesAccess,
        },
        credentialUpdateModel,
        credentialUpdateMapper
      );
    } else {
      await createCredential<VpnCredentialModel>(
        {
          storeService: services.storeService,
          sessionService: services.sessionService,
          eventLoggerService: services.eventLoggerService,
          applicationModulesAccess: services.applicationModulesAccess,
        },
        credentialModel,
        credentialCreateMapper
      );
    }
  };
  const updateErrorStateAndLog = async (error?: VpnErrorType) => {
    services.storeService.dispatch(
      vpnAccountGenerationErrorAction(
        error === VpnErrorType.AccountAlreadyExistError
          ? VpnAccountActivationErrorType.AccountAlreadyExistError
          : VpnAccountActivationErrorType.ServerError
      )
    );
    await infrastructure.logger.logError(error ?? VpnErrorType.ServerError);
  };
  const generateCredential = async (
    userSessionService: UserSessionService,
    email?: string
  ) => {
    await infrastructure.logger.logStart();
    services.storeService.dispatch(vpnAccountActivatingAction());
    try {
      await Promise.race([
        userSessionService.refreshContactInfo(),
        new Promise<undefined>((resolve) => self.setTimeout(resolve, 1000)),
      ]);
      const contactInfo = contactInfoSelector(services.storeService.getState());
      const login = userLoginSelector(services.storeService.getState());
      const contactEmail = email ?? contactInfo.email ?? login;
      const credentialsGenerationResult =
        await infrastructure.generator.generateCredential(login, contactEmail);
      switch (credentialsGenerationResult.success) {
        case true: {
          await saveCredential(
            contactEmail,
            credentialsGenerationResult.password,
            login
          );
          services.storeService.dispatch(vpnAccountGenerationDoneAction());
          await infrastructure.logger.logComplete();
          break;
        }
        case false: {
          updateErrorStateAndLog(credentialsGenerationResult.error);
          break;
        }
      }
    } catch (error) {
      updateErrorStateAndLog();
      const tag = "VPN";
      const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
        tag,
        "saveCredential"
      );
      logError({
        tag: [tag],
        message: `${augmentedError}`,
        details: { error },
      });
      sendExceptionLog({ error: augmentedError });
    }
  };
  return {
    generateCredential,
  };
};
