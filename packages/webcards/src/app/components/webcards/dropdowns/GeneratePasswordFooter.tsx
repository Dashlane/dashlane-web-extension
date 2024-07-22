import * as React from "react";
import {
  AutofillButton,
  BrowseComponent,
  PageView,
  UserAutofillClickEvent,
} from "@dashlane/hermes";
import {
  AutofillDropdownWebcardWarningType,
  GeneratePasswordWebcardData,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { useCommunication } from "../../../context/communication";
import { WebcardPropsBase } from "../config";
import { DropdownMessage } from "./common/DropdownMessage";
const uuidRegex = new RegExp("{[-a-zA-Z0-9]{36}}");
interface Props extends WebcardPropsBase {
  data: GeneratePasswordWebcardData;
}
export const GeneratePasswordFooter = ({ data, closeWebcard }: Props) => {
  const { autofillEngineCommands } = useCommunication();
  const warningType =
    data.warningType ?? AutofillDropdownWebcardWarningType.None;
  const warningContext = data.context;
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownSuggestion,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onSeeCredentialOnWebapp = async () => {
    autofillEngineCommands?.openWebapp({
      id: warningContext,
      route: "/passwords",
    });
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.SeeAllPasswords,
      })
    );
    closeWebcard();
  };
  let showWarning = warningType !== AutofillDropdownWebcardWarningType.None;
  if (
    warningType ===
      AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration &&
    !uuidRegex.test(warningContext || "")
  ) {
    showWarning = false;
  }
  return showWarning ? (
    <DropdownMessage
      type={warningType}
      onSeeCredentialOnWebapp={onSeeCredentialOnWebapp}
    />
  ) : null;
};
