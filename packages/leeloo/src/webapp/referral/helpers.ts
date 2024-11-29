import { EMAIL_REGEX } from "../../libs/validators";
import { Invites } from "./referral";
export const splitEmails = (emails: string) => {
  return emails.split(",").map((email) => email.trim());
};
export const filterInvalidEmails = (emails: string[]) => {
  return emails.filter((email) => !EMAIL_REGEX.test(email));
};
export const parseInvites = (invites: Invites) => {
  const successfulInvites = invites
    ? invites.filter((invite) => invite.accountCreationDateUnix !== null)
    : null;
  const pendingInvites = invites
    ? invites.filter((invite) => invite.accountCreationDateUnix === null)
    : null;
  return { pendingInvites, successfulInvites };
};
