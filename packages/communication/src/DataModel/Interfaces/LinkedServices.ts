export enum LinkedWebsiteSource {
  Manual = "manual",
  Remember = "remember",
}
export type LinkedWebsiteDomain = string;
export type LinkedWebsite = {
  domain: LinkedWebsiteDomain;
  source: LinkedWebsiteSource;
};
export type LinkedAndroidApp = {
  package_name: string;
  name?: string;
  link_source: string;
  sha256_cert_fingerprints: {
    type: string;
  }[];
};
export type CredentialLinkedServices = {
  associated_domains: LinkedWebsite[];
  associated_android_apps?: LinkedAndroidApp[];
};
