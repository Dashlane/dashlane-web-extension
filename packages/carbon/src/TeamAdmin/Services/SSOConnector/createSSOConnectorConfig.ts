import {
  CreateConfigRequest,
  CreateConfigResult,
  TeamDevicePlatform,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { registerTeamDevice } from "TeamAdmin/Services/Device/registerTeamDevice";
import { createConfigString } from "TeamAdmin/Services/SSOConnector/ScriptTemplates/configScript";
import { parseMetadataFields } from "TeamAdmin/Services/SamlMetadataParser/samlMetadataParser";
import { setTeamSettings } from "Team/SettingsController";
import { getCurrentUserInfo } from "Session/utils";
import { currentTeamIdSelector } from "TeamAdmin/Services/selectors";
export async function createSSOConnectorConfig(
  services: CoreServices,
  params: CreateConfigRequest
): Promise<CreateConfigResult> {
  const { connectorUrl, connectorKey, idpMetadata } = params;
  if (!connectorUrl || !idpMetadata) {
    throw new Error(`[createConfig] : Missing request information -
                Received connectorUrl : ${!!connectorUrl} or
                Received idpMetadata: ${!!idpMetadata}
            `);
  }
  const registeredDevice = await registerTeamDevice(services, {
    platform: TeamDevicePlatform.SSO_CONNECTOR,
    deviceName: "SSO Connector",
  });
  if (registeredDevice.success === false) {
    return {
      success: false,
      error: {
        code: registeredDevice.error.code,
      },
    };
  }
  const deviceSecretKey = registeredDevice.data.deviceSecretKey;
  const deviceAccessKey = registeredDevice.data.deviceAccessKey;
  const teamUuid = registeredDevice.data.teamUuid;
  try {
    const { samlIdpCertificate, samlIdpEntryPoint } = await parseMetadataFields(
      idpMetadata
    );
    const { storeService, wsService } = services;
    const currentTeamIdString = currentTeamIdSelector(storeService.getState());
    const teamId = parseInt(currentTeamIdString, 10);
    if (isNaN(teamId)) {
      throw new Error(
        `[createSSOConnectorConfig] : Unable to retrieve teamId from [parseInt(currentTeamIdString, 10)]`
      );
    }
    await setTeamSettings(
      storeService,
      wsService,
      getCurrentUserInfo(storeService),
      { teamId, settings: { ssoIdpEntrypoint: samlIdpEntryPoint } }
    );
    const config = createConfigString(
      connectorKey || "",
      connectorUrl.toLowerCase(),
      deviceSecretKey,
      deviceAccessKey,
      teamUuid,
      samlIdpCertificate,
      samlIdpEntryPoint
    );
    return {
      success: true,
      config,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: error.message,
      },
    };
  }
}
