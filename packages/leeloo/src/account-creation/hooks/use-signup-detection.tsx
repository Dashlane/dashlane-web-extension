import { useEffect } from "react";
import {
  cookiesGetAll,
  cookiesRemove,
  tabsQuery,
  tabsRemove,
} from "@dashlane/webextensions-apis";
import {
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  ACCOUNT_CREATION_URL_SEGMENT,
  DASHLANE_DOMAIN,
  EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
} from "../../app/routes/constants";
import { SIGN_UP_FLOW_COOKIE } from "../types";
import { getUrlSearchParams, useHistory, useLocation } from "../../libs/router";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { accountCreationApi } from "@dashlane/account-contracts";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { makeSignupURL } from "../helpers";
export const useSignUpDetection = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { markMassDeployFirstInitDone } = useModuleCommands(accountCreationApi);
  const accountCreationPoliciesResult = useModuleQuery(
    accountCreationApi,
    "accountCreationMassDeployPolicies"
  );
  const isSignUpPage =
    pathname === ACCOUNT_CREATION_TAC_URL_SEGMENT ||
    pathname === ACCOUNT_CREATION_URL_SEGMENT ||
    pathname === EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT;
  useEffect(() => {
    if (!APP_PACKAGED_IN_EXTENSION) {
      return;
    }
    const checkSignUpRedirect = async () => {
      const tabs = await tabsQuery({
        url: `*://*.${DASHLANE_DOMAIN}/*`,
      });
      const allInactiveTabs = tabs.filter((tab) => {
        return tab.url && !tab.active;
      });
      const signupTab = allInactiveTabs.find((tab) =>
        tab.url?.includes(ACCOUNT_CREATION_URL_SEGMENT)
      );
      const { data: acPolicies } = accountCreationPoliciesResult;
      if (acPolicies?.firstMassDeployOpening) {
        markMassDeployFirstInitDone();
        history.push(
          makeSignupURL({
            parsedTeam: acPolicies?.teamKey,
            isFromMassDeployment: true,
          })
        );
        return;
      }
      const cookies = await cookiesGetAll({
        domain: DASHLANE_DOMAIN,
        name: SIGN_UP_FLOW_COOKIE,
      });
      const signupCookie = cookies[0];
      if (signupCookie || signupTab) {
        const [
          cookieEmail,
          cookieTeam,
          cookieFlowType,
          cookieWithNewFlow,
          cookieWithSkipButton,
        ] = signupCookie?.value?.split(",") ?? [];
        const signUpTabUrl = signupTab?.url ? signupTab?.url : undefined;
        const parsedEmail =
          cookieEmail ?? getUrlSearchParams(signUpTabUrl).get("email") ?? "";
        const parsedTeam =
          cookieTeam ??
          getUrlSearchParams(signUpTabUrl).get("team") ??
          acPolicies?.teamKey ??
          "";
        const parsedWithNewFlow = cookieWithNewFlow === "true" ?? false;
        const parsedWithSkipButton = cookieWithSkipButton === "true" ?? false;
        if (signupCookie) {
          await cookiesRemove({
            url: `__REDACTED__${DASHLANE_DOMAIN}`,
            name: SIGN_UP_FLOW_COOKIE,
          });
        }
        if (isSignUpPage) {
          const inactiveTabIds: number[] = allInactiveTabs
            .filter(
              (
                tab
              ): tab is chrome.tabs.Tab & {
                id: number;
              } => tab.id !== undefined
            )
            .map((tab) => tab.id);
          if (inactiveTabIds.length > 0) {
            await tabsRemove(inactiveTabIds);
          }
          history.push(
            makeSignupURL({
              parsedEmail,
              parsedTeam,
              flowType: cookieFlowType,
              isFromMassDeployment: acPolicies?.firstMassDeployOpening,
              withNewFlow: parsedWithNewFlow,
              withSkipButton: parsedWithSkipButton,
            })
          );
        }
      }
    };
    if (accountCreationPoliciesResult?.status === DataStatus.Success) {
      checkSignUpRedirect();
    }
  }, [
    accountCreationPoliciesResult,
    history,
    isSignUpPage,
    markMassDeployFirstInitDone,
  ]);
};
