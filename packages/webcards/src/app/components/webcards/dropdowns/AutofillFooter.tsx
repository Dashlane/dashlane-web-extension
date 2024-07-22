import * as React from "react";
import { AutofillDropdownWebcardWarningType } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { useCommunication } from "../../../context/communication";
import { DropdownMessage } from "./common/DropdownMessage";
interface Props {
  context?: string;
  closeWebcard: () => void;
  warningType?: AutofillDropdownWebcardWarningType;
}
export const AutofillFooter = ({
  context,
  closeWebcard,
  warningType,
}: Props) => {
  const { autofillEngineCommands } = useCommunication();
  const onSeeCredentialOnWebapp = async () => {
    autofillEngineCommands?.openWebapp({
      id: context,
      route: "/passwords",
    });
    closeWebcard();
  };
  const autofillWarningProps = {
    onSeeCredentialOnWebapp,
  };
  return warningType ? (
    <DropdownMessage type={warningType} {...autofillWarningProps} />
  ) : null;
};
