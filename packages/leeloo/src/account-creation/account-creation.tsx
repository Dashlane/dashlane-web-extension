import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Flex } from "@dashlane/design-system";
import { Lee } from "../lee";
import { AccountCreationForm } from "./account-creation-form/account-creation-form";
import {
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  ACCOUNT_CREATION_URL_SEGMENT,
  EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
} from "../app/routes/constants";
import { PanelNavigation } from "./panel-navigation/panel-navigation";
import useTranslate from "../libs/i18n/useTranslate";
import { useLocation, useRouterGlobalSettingsContext } from "../libs/router";
import { useAcceptTeamInvite } from "./hooks/use-accept-team-invite";
import { useSignUpDetection } from "../account-creation/hooks/use-signup-detection";
import transition from "./transition.css";
import { AccountCreationFlowType, AccountCreationStep } from "./types";
import { ACCOUNT_CREATION_STYLE } from "./style";
import { AccountCreationLeftPanel } from "./account-creation-left-panel";
import { getSignUpUrlQueryParameters } from "./helpers";
import { AdminTrialAccountCreation } from "./admin-trial-account-creation/admin-trial-account-creation";
interface AccountCreationProps {
  lee: Lee;
}
const I18N_KEYS = {
  ALREADY_HAVE_ACCOUNT_TEXT: "webapp_auth_panel_already_an_account",
  LOGIN_CTA: "webapp_auth_panel_login",
};
const getSignUpFlowFromPathname = (
  pathname: string
): AccountCreationFlowType => {
  switch (pathname) {
    case ACCOUNT_CREATION_TAC_URL_SEGMENT:
      return AccountCreationFlowType.ADMIN;
    case EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT:
      return AccountCreationFlowType.EMPLOYEE;
    case ACCOUNT_CREATION_URL_SEGMENT:
    default:
      return AccountCreationFlowType.B2C;
  }
};
export const AccountCreation = ({ lee }: AccountCreationProps) => {
  const { translate } = useTranslate();
  const { pathname, search } = useLocation();
  const { routes } = useRouterGlobalSettingsContext();
  const { withNewFlowQueryParam } = getSignUpUrlQueryParameters(search);
  useSignUpDetection();
  const [currentStep, setCurrentStep] = useState<AccountCreationStep>(
    AccountCreationStep.EnterAccountEmail
  );
  const { isAcceptTeamInviteCheckDone } = useAcceptTeamInvite();
  const signUpFlow = getSignUpFlowFromPathname(pathname);
  const isBusinessSignup =
    signUpFlow === AccountCreationFlowType.EMPLOYEE ||
    signUpFlow === AccountCreationFlowType.ADMIN;
  const canShowPanelNavigation = !isBusinessSignup || APP_PACKAGED_IN_EXTENSION;
  const [showPanelNavigation, setShowPanelNavigation] = useState<
    boolean | undefined
  >(canShowPanelNavigation);
  useEffect(() => {
    const isNotPendingInvitationScreen =
      currentStep !== AccountCreationStep.PendingInvitation &&
      currentStep !== AccountCreationStep.ExpiredInvitation;
    setShowPanelNavigation(
      canShowPanelNavigation && isNotPendingInvitationScreen
    );
  }, [canShowPanelNavigation, currentStep]);
  if (withNewFlowQueryParam && signUpFlow === AccountCreationFlowType.ADMIN) {
    return <AdminTrialAccountCreation lee={lee} />;
  }
  return (
    <div sx={ACCOUNT_CREATION_STYLE.MAIN_CONTAINER}>
      <AccountCreationLeftPanel
        currentStep={currentStep}
        signUpFlowType={signUpFlow}
      />
      <div sx={ACCOUNT_CREATION_STYLE.ACCOUNT_CREATION_FORM_CONTAINER}>
        {showPanelNavigation ? (
          <PanelNavigation
            redirectLocation={{
              pathname:
                signUpFlow === AccountCreationFlowType.ADMIN
                  ? routes.teamRoutesBasePath + LOGIN_URL_SEGMENT
                  : LOGIN_URL_SEGMENT,
              search: "",
              hash: "",
              state: { ignoreRedirect: true },
            }}
            helperText={translate(I18N_KEYS.ALREADY_HAVE_ACCOUNT_TEXT)}
            buttonText={translate(I18N_KEYS.LOGIN_CTA)}
          />
        ) : null}

        <TransitionGroup
          role="main"
          sx={{
            paddingTop: "64px",
            height: "calc(100% - 40px)",
          }}
        >
          <CSSTransition
            classNames={{ ...transition }}
            timeout={{
              appear: 500,
              enter: 0,
              exit: 0,
            }}
            appear={true}
          >
            <Flex
              flexDirection="column"
              alignContent="center"
              justifyContent="center"
              sx={{
                height: "100%",
              }}
            >
              <AccountCreationForm
                signUpFlow={signUpFlow}
                lee={lee}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isAcceptTeamInviteCheckDone={isAcceptTeamInviteCheckDone}
              />
            </Flex>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};
