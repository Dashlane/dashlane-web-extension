import { pinCodeApi } from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { useState } from "react";
import { useUserLogin } from "../../../hooks/use-user-login";
export enum PinEnforcementStep {
  EnterPinCode = "enterPinCode",
  ConfirmPinCode = "confirmPinCode",
}
export function usePinEnforcement() {
  const loginEmail = useUserLogin() ?? "";
  const [pinCode, setPinCode] = useState("");
  const [pinEnforcementStep, setPinEnforcementStep] =
    useState<PinEnforcementStep>(PinEnforcementStep.EnterPinCode);
  const { activate } = useModuleCommands(pinCodeApi);
  return {
    loginEmail,
    pinCode,
    pinEnforcementStep,
    setPinCode,
    setPinEnforcementStep,
    activate,
  };
}
