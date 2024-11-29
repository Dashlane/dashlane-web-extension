import { useEffect, useState } from "react";
import classNames from "classnames";
import { pinCodeApi } from "@dashlane/authentication-contracts";
import {
  Dialog,
  Flex,
  IndeterminateLoader,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { useEventWrapper, useModuleCommands } from "@dashlane/framework-react";
import { assertUnreachable } from "@dashlane/framework-types";
import { allIgnoreClickOutsideClassName } from "../../../../variables";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { HELP_CENTER_CONTACT_SUPPORT_URL } from "../../../../../app/routes/constants";
export enum PinDeactivationState {
  Loading,
  Success,
  Error,
}
export const I18N_KEYS = {
  DISMISS_DIALOG: "_common_action_cancel",
  CANCEL_DIALOG: "_common_action_cancel",
  CLOSE_DIALOG: "webapp_security_settings_activate_pin_code_flow_close",
  LOADING_TITLE:
    "webapp_security_settings_deactivate_pin_code_flow_deactivating_title",
  SUCCESS_TITLE:
    "webapp_security_settings_deactivate_pin_code_flow_success_title",
  SUCCESS_CONTENT:
    "webapp_security_settings_deactivation_pin_code_flow_success_content",
  ERROR_CONTENT: "webapp_security_settings_activate_pin_code_flow_error_title",
  ERROR_TITLE: "webapp_security_settings_activate_pin_code_flow_error_content",
  CONTACT_SUPPORT_BUTTON:
    "webapp_security_settings_activate_pin_code_flow_error_contact_support",
};
interface PinCodeDeactivationFlowContainerProps {
  onComplete: () => void;
  onCancel: () => void;
}
export const PinCodeDeactivationFlowContainer = ({
  onCancel,
  onComplete,
}: PinCodeDeactivationFlowContainerProps) => {
  const { translate } = useTranslate();
  const [state, setState] = useState(PinDeactivationState.Loading);
  const eventWrapper = useEventWrapper();
  const { deactivate } = useModuleCommands(pinCodeApi);
  const safeDeactivate = eventWrapper.wrap(
    async () => {
      await deactivate();
      setState(PinDeactivationState.Success);
    },
    () => {
      setState(PinDeactivationState.Error);
    }
  );
  useEffect(() => {
    safeDeactivate();
  }, []);
  switch (state) {
    case PinDeactivationState.Loading:
      return (
        <Dialog
          isOpen
          onClose={onCancel}
          closeActionLabel=""
          isMandatory
          dialogClassName={classNames(allIgnoreClickOutsideClassName)}
          title={translate(I18N_KEYS.LOADING_TITLE)}
        >
          <Flex flexDirection="column" alignItems="center">
            <IndeterminateLoader size={72} />
          </Flex>
        </Dialog>
      );
    case PinDeactivationState.Error:
      return (
        <Dialog
          isOpen
          dialogClassName={classNames(allIgnoreClickOutsideClassName)}
          title={translate(I18N_KEYS.ERROR_TITLE)}
          closeActionLabel={translate(I18N_KEYS.CANCEL_DIALOG)}
          onClose={onCancel}
          actions={{
            secondary: {
              children: (
                <LinkButton
                  href={HELP_CENTER_CONTACT_SUPPORT_URL}
                  onClick={onCancel}
                  isExternal
                >
                  {translate(I18N_KEYS.CONTACT_SUPPORT_BUTTON)}
                </LinkButton>
              ),
            },
          }}
        >
          <Paragraph textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.ERROR_CONTENT)}
          </Paragraph>
        </Dialog>
      );
    case PinDeactivationState.Success:
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
