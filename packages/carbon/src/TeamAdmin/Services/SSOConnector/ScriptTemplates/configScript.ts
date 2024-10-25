export const createConfigString = (
  generatedKey: string,
  connectorHostname: string,
  deviceSecretKey: string,
  deviceAccessKey: string,
  teamUuid: string,
  idpCertificate: string,
  idpEntrypoint: string
): string => `
DASHLANE_SSO_CONNECTOR_ENDPOINT=${connectorHostname}
DASHLANE_SSO_SAML_IDP_CERTIFICATE=${idpCertificate}
DASHLANE_SSO_SAML_IDP_ENTRYPOINT=${idpEntrypoint}
DASHLANE_SSO_CONNECTOR_KEY=${generatedKey}
DASHLANE_SSO_TEAM_DEVICE_ACCESS_KEY=${deviceAccessKey}
DASHLANE_SSO_TEAM_DEVICE_SECRET_KEY=${deviceSecretKey}
DASHLANE_SSO_TEAM_UUID=${teamUuid}
`;
