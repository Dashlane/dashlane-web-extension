export type QueryCategories =
  | "addresses"
  | "bankAccounts"
  | "companies"
  | "credentials"
  | "driverLicenses"
  | "emails"
  | "fiscalIds"
  | "idCards"
  | "identities"
  | "notes"
  | "passports"
  | "paymentCards"
  | "personalWebsites"
  | "phones"
  | "socialSecurityIds";
export type QueryCounts = Record<QueryCategories, number>;
