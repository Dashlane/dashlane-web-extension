import { Email as CarbonEmail } from "@dashlane/communication";
import { Email, EmailType } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const emailMapper = (carbonEmail: CarbonEmail): Email => {
  const { EmailName, Email, Type, LocaleFormat, ...rest } = carbonEmail;
  return {
    ...mapKeysToLowercase(rest),
    itemName: EmailName,
    emailAddress: Email,
    type: <EmailType>Type,
  };
};
