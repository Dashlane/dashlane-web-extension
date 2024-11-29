import { createSignUpCookie } from "../helpers";
import { useUserLogin } from "../../libs/hooks/useUserLogin";
import { AccountCreationFlowType } from "../types";
export const useSignUpCookie = () => {
  const login = useUserLogin();
  const setCookie = (flowType: AccountCreationFlowType): void => {
    createSignUpCookie({
      login: login ?? "",
      flowType,
    });
  };
  return { setCookie };
};
