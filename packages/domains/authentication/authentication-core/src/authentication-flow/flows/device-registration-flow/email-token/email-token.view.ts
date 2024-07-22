import { AuthenticationBaseError } from "../../main-flow/types";
import { EmailTokenContext } from "./email.token.machine";
interface EmailTokenView {
  login: string;
  emailToken?: string;
  error?: AuthenticationBaseError;
}
const getEmailTokenView = (context: EmailTokenContext): EmailTokenView => {
  return {
    login: context.login ?? "",
    emailToken: context.emailToken ?? "",
    error: context.error,
  };
};
export const emailTokenViewMapper = [
  {
    values: [
      "SendEmailToken",
      "WaitingForEmailToken",
      "ValidatingEmailToken",
      "FinishingEmailToken",
    ],
    view: getEmailTokenView,
  },
];
