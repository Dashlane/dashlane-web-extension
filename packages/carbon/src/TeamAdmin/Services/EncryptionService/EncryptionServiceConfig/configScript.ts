interface ConfigArguments {
  deviceSecretKey: string;
  deviceAccessKey: string;
  teamUuid: string;
  configEncryptionKey: string;
  encryptionServiceEndpoint?: string;
}
export const createAwsLinuxEncryptionServiceConfig = ({
  configEncryptionKey,
  deviceSecretKey,
  deviceAccessKey,
  teamUuid,
}: ConfigArguments): string => `DASHLANE_SSO_TEAM_DEVICE_ACCESS_KEY=${deviceAccessKey}
DASHLANE_SSO_TEAM_DEVICE_SECRET_KEY=${deviceSecretKey}
DASHLANE_SSO_TEAM_UUID=${teamUuid}
DASHLANE_CONFIG_ENCRYPTION_KEY=${configEncryptionKey}
`;
export const createAzureEncryptionServiceConfig = ({
  configEncryptionKey,
  deviceSecretKey,
  deviceAccessKey,
  teamUuid,
  encryptionServiceEndpoint,
}: ConfigArguments): string => {
  const { host } = new URL(encryptionServiceEndpoint);
  const siteName = host.split(".").slice(0, -2).join(".");
  return `{
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "siteName": {
          "value": "${siteName}"
        },
        "servicePlanSku": {
          "value": "B1"
        },
        "servicePlanCapacity": {
          "value": 1
        },
        "location": {
          "value": "[resourceGroup().location]"
        },
        "DASHLANE_CONFIG_ENCRYPTION_KEY": {
          "value": "${configEncryptionKey}"
        },
        "DASHLANE_SSO_TEAM_DEVICE_ACCESS_KEY": {
          "value": "${deviceAccessKey}"
        },
        "DASHLANE_SSO_TEAM_DEVICE_SECRET_KEY": {
          "value": "${deviceSecretKey}"
        },
        "DASHLANE_SSO_TEAM_UUID": {
          "value": "${teamUuid}"
        }
      }
    }
    `;
};
