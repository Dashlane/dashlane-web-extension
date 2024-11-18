import { TeamDeviceConfigParameters } from "@dashlane/communication";
type GeneratedSSOParameters = "connectorKey";
type GeneratedSCIMParameters =
  | "scimSignatureKey"
  | "teamDevicePublicKey"
  | "teamDevicePrivateKey";
type UserProvidedSSOParameters =
  | "connectorEndpoint"
  | "samlIdpCertificate"
  | "samlIdpEntryPoint";
type UserProvidedSCIMParameters = "scimAuthToken" | "scimEnabled";
const KNOWN_KEYS: Record<
  keyof TeamDeviceConfigParameters,
  {
    defaultValue: TeamDeviceConfigParameters[keyof TeamDeviceConfigParameters];
    configMapping: string;
  }
> = {
  scimSignatureKey: {
    defaultValue: "",
    configMapping: "DASHLANE_SCIM_SIGNATURE_KEY",
  },
  scimAuthToken: {
    defaultValue: "",
    configMapping: "DASHLANE_SCIM_AUTHENTICATION_TOKEN",
  },
  scimEnabled: {
    defaultValue: false,
    configMapping: "DASHLANE_SCIM_ENABLED",
  },
  teamDevicePublicKey: {
    defaultValue: "",
    configMapping: "DASHLANE_SCIM_TEAMDEVICE_PUBLIC_KEY",
  },
  teamDevicePrivateKey: {
    defaultValue: "",
    configMapping: "DASHLANE_SCIM_TEAMDEVICE_PRIVATE_KEY",
  },
  connectorEndpoint: {
    defaultValue: "",
    configMapping: "DASHLANE_SSO_CONNECTOR_ENDPOINT",
  },
  connectorKey: {
    defaultValue: "",
    configMapping: "DASHLANE_SSO_CONNECTOR_KEY",
  },
  samlIdpCertificate: {
    defaultValue: "",
    configMapping: "DASHLANE_SSO_SAML_IDP_CERTIFICATE",
  },
  samlIdpEntryPoint: {
    defaultValue: "",
    configMapping: "DASHLANE_SSO_SAML_IDP_ENTRYPOINT",
  },
};
const castValueForConfigString = <T>(fallback: T, givenValue: T): string => {
  if (typeof givenValue === "boolean" || typeof fallback === "boolean") {
    return givenValue ?? fallback ? "true" : "false";
  }
  return `${givenValue ?? fallback}`;
};
const castValueFromConfigString = (
  fallback: string | boolean,
  givenValue?: string
): string | boolean => {
  if (!givenValue) {
    return fallback;
  }
  if (givenValue.length > 0 && typeof fallback === "boolean") {
    return givenValue === "true";
  } else if (typeof fallback === "boolean") {
    return fallback;
  }
  return givenValue ?? fallback;
};
export const generateTeamDeviceEncryptedConfig = (
  params: Partial<
    Pick<
      TeamDeviceConfigParameters,
      | UserProvidedSCIMParameters
      | UserProvidedSSOParameters
      | GeneratedSCIMParameters
      | GeneratedSSOParameters
    >
  >
): string => {
  return Object.entries(KNOWN_KEYS)
    .map(([configKey, metaData]) => {
      return `${metaData.configMapping}=${castValueForConfigString(
        metaData.defaultValue,
        params[configKey]
      )}`;
    })
    .join("\n");
};
const isCompleteConfig = (
  parameters: Record<string, unknown>
): parameters is TeamDeviceConfigParameters => {
  const allKeys = Object.keys(
    KNOWN_KEYS
  ) as (keyof TeamDeviceConfigParameters)[];
  return allKeys.every((key) => key in parameters);
};
export const mapTeamDeviceEncryptedConfig = (
  decryptedConfig: string
): TeamDeviceConfigParameters => {
  const mapped: Record<string, string> = decryptedConfig
    .split("\n")
    .reduce((acc, line) => {
      const delimiterIndex = line.indexOf("=");
      const [configKey, configValue] = [
        line.slice(0, delimiterIndex),
        line.slice(delimiterIndex + 1),
      ];
      return { ...acc, [configKey]: configValue };
    }, {});
  const parameters = Object.entries(KNOWN_KEYS).reduce(
    (acc, [internalKey, { configMapping, defaultValue }]) => ({
      ...acc,
      [internalKey]: castValueFromConfigString(
        defaultValue,
        mapped[configMapping]
      ),
    }),
    {}
  );
  if (isCompleteConfig(parameters)) {
    return parameters;
  }
  throw new Error("incomplete data when creating object from config string");
};
