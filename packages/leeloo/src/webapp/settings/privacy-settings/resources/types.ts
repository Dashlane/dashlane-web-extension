export type CheckboxState = {
  initialValue: boolean;
  value: boolean;
};
export type ConsentData = Record<
  string,
  {
    status: "accepted" | "refused";
  }
>;
export enum ActionTrigger {
  UNKNOWN = "unknown",
  ACCOUNT_CREATION = "account_creation",
  B2B_FREE_TRIAL = "B2B_free_trial",
  PRIVACY_SETTINGS = "privacy_settings",
  ACCOUNT_RECREATION = "account_recreation",
  ACCOUNT_DELETION = "account_deletion",
  BACKFILL = "backfill",
  BRAZE_WEBHOOK = "braze_webhook",
}
export interface FormValues {
  EmailsOffersAndTips: boolean;
}
