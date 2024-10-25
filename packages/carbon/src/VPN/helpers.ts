import { Credential } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import {
  VPN_DASHLANE_HOTSPOTSHIELD_SUBDOMAIN,
  VPN_HOTSPOTSHIELD_DOMAIN,
} from "./constants";
export const vpnCredentialMatcher = (credential: Credential) => {
  const parsedUrl = new ParsedURL(credential.Url);
  return (
    credential.Password &&
    credential.Email &&
    parsedUrl &&
    parsedUrl.getRootDomain() === VPN_HOTSPOTSHIELD_DOMAIN &&
    parsedUrl.getSubdomain() === VPN_DASHLANE_HOTSPOTSHIELD_SUBDOMAIN
  );
};
