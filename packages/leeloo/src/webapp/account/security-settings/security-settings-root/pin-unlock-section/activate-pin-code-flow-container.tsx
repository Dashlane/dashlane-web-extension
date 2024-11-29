import classNames from "classnames";
import { useState } from "react";
import { pinCodeApi } from "@dashlane/authentication-contracts";
import {
  Dialog,
  Flex,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import { assertUnreachable } from "@dashlane/framework-types";
import { useEventWrapper, useModuleCommands } from "@dashlane/framework-react";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../webapp/variables";
import { EnterPinCode } from "./steps/enter-pin-code";
import { ConfirmPinCode } from "./steps/confirm-pin-code";
import { ErrorActivatingPinCode } from "./steps/error-activating-pin-code";
enum PinActivationState {
  Enter,
  Confirm,
  Success,
  Error,
  Loading,
}
const I18N_KEYS = {
  CANCEL_DIALOG: "_common_action_cancel",
  CLOSE_DIALOG: "webapp_security_settings_activate_pin_code_flow_close",
  NEXT: "webapp_security_settings_activate_pin_code_flow_next",
  BACK: "webapp_security_settings_activate_pin_code_flow_back",
  SUCCESS_TITLE:
    "webapp_security_settings_activate_pin_code_flow_success_title",
  SUCCESS_CONTENT:
    "webapp_security_settings_activate_pin_code_flow_success_content",
  ACTIVATING_TITLE:
    "webapp_security_settings_activate_pin_code_flow_activating_title",
};
interface PinCodeActivationFlowContainerProps {
  onComplete: () => void;
  onCancel: () => void;
}
export const PinCodeActivationFlowContainer = ({
  onCancel,
  onComplete,
}: PinCodeActivationFlowContainerProps) => {
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState(PinActivationState.Enter);
  const { activate } = useModuleCommands(pinCodeApi);
  const { translate } = useTranslate();
  const eventWrapper = useEventWrapper();
  const safeActivate = eventWrapper.wrap(
    async () => {
      setState(PinActivationState.Loading);
      await activate({ pinCode });
      setState(PinActivationState.Success);
    },
    () => {
      setState(PinActivationState.Error);
    }
  );
  const reset = () => {
    setPinCode("");
    setState(PinActivationState.Enter);
  };
  switch (state) {
    case PinActivationState.Enter:
      return (
        <EnterPinCode
          onCancel={onCancel}
          onNext={(v) => {
            setPinCode(v);
            setState(PinActivationState.Confirm);
          }}
        />
      );
    case PinActivationState.Confirm:
      return (
        <ConfirmPinCode
          onBack={reset}
          onCancel={onCancel}
          onNext={safeActivate}
          pinCode={pinCode}
        />
      );
    case PinActivationState.Loading:
      return (
        <Dialog
          isOpen
          onClose={onCancel}
          closeActionLabel=""
          isMandatory
          dialogClassName={classNames(allIgnoreClickOutsideClassName)}
          title={translate(I18N_KEYS.ACTIVATING_TITLE)}
        >
          <Flex flexDirection="column" alignItems="center">
            <IndeterminateLoader size={72} />
          </Flex>
        </Dialog>
      );
    case PinActivationState.Error:
      return <ErrorActivatingPinCode onTryAgain={reset} onCancel={onCancel} />;
    case PinActivationState.Success:
      return (
        <Dialog
          isOpen
          dialogClassName={classNames(allIgnoreClickOutsideClassName)}
          title={translate(I18N_KEYS.SUCCESS_TITLE)}
          onClose={onComplete}
          closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG)}
          actions={{
            primary: {
              children: translate(I18N_KEYS.CLOSE_DIALOG),
              onClick: onComplete,
            },
          }}
        >
          <Paragraph textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.SUCCESS_CONTENT)}
          </Paragraph>
        </Dialog>
      );
    default:
      assertUnreachable(state);
  }
};
