import {
  AnonymousAutofillSubmitFormEvent,
  DomainType,
  FieldsFilledByCount,
  hashDomain,
  UserAutofillSubmitFormEvent,
} from "@dashlane/hermes";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  FormInformation,
  FormSubmitLogOptions,
} from "../../../Api/types/autofill";
import { AutofillEngineActionsWithOptions } from "../messaging/action-serializer";
export const logFormSubmitHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  log: FormSubmitLogOptions,
  formInformation: FormInformation
) => {
  if (!sender.tab?.url || !sender.url) {
    return;
  }
  const userLoginStatus = await context.connectors.carbon.getUserLoginStatus();
  if (!userLoginStatus.loggedIn) {
    return;
  }
  const userLog = new UserAutofillSubmitFormEvent({
    ...log,
    fieldsFilledBy: {
      ...log.fieldsFilledBy,
      manually_typed_count: log.fieldsFilledBy.manually_typed_count,
    } as FieldsFilledByCount,
  });
  const anonymousLog = new AnonymousAutofillSubmitFormEvent({
    ...userLog,
    domain: {
      type: DomainType.Web,
      id: await hashDomain(formInformation.domain),
    },
  });
  await context.connectors.carbon.logEvent({ event: userLog });
  await context.connectors.carbon.logEvent({ event: anonymousLog });
};
