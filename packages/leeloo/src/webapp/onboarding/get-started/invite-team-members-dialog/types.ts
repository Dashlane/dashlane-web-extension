export enum InvitationStep {
  SUCCESS = "success",
  ERROR = "error",
  IDLE = "idle",
}
export type EmailField = {
  value: string;
  valid: boolean | null;
  id: string;
};
export type EmailFields = EmailField[];
