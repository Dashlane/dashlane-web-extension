import { add } from "date-fns";
import queryString from "query-string";
import { AccountCreationFlowType, SIGN_UP_FLOW_COOKIE } from "./types";
import {
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  DASHLANE_DOMAIN,
  EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
} from "../app/routes/constants";
export type SignUpUrlQueryParameters = {
  emailQueryParam: string;
  prefilledTeamKey: string;
  isFromMassDeployment: boolean;
  withNewFlowQueryParam: boolean;
  withSkipButtonQueryParam: boolean;
};
interface SignUpCookieParams {
  login: string;
  prefilledTeamKey?: string;
  flowType: string;
  withNewFlow?: boolean;
  showSkipInstallButton?: boolean;
}
export const createSignUpCookie = ({
  login,
  prefilledTeamKey = "",
  withNewFlow = false,
  showSkipInstallButton = false,
  flowType,
}: SignUpCookieParams): void => {
  const expiryDateString = add(new Date(), {
    days: 1,
  }).toUTCString();
  const cookieString = `${SIGN_UP_FLOW_COOKIE}=${login},${prefilledTeamKey},${flowType},${withNewFlow},${showSkipInstallButton}; domain=${DASHLANE_DOMAIN}; expires=${expiryDateString}`;
  window.document.cookie = cookieString;
};
export const getSignUpUrlQueryParameters = (
  search: string
): SignUpUrlQueryParameters => {
  const queryParams = queryString.parse(search);
  const emailQueryParam = `${queryParams.email ?? ""}`;
  const prefilledTeamKey = `${queryParams.team ?? ""}`;
  const isFromMassDeployment =
    queryParams.isFromMassDeployment === "true" ?? false;
  const withNewFlowQueryParam = queryParams.withNewFlow === "true" ?? false;
  const withSkipButtonQueryParam =
    queryParams.withSkipButton === "true" ?? false;
  return {
    emailQueryParam,
    prefilledTeamKey,
    isFromMassDeployment,
    withNewFlowQueryParam,
    withSkipButtonQueryParam,
  };
};
export const makeSignupURL = ({
  parsedEmail = "",
  parsedTeam = "",
  flowType = AccountCreationFlowType.EMPLOYEE,
  isFromMassDeployment = false,
  withNewFlow = false,
  withSkipButton = false,
}: {
  parsedEmail?: string;
  parsedTeam?: string;
  flowType?: string;
  isFromMassDeployment?: boolean;
  withNewFlow?: boolean;
  withSkipButton?: boolean;
}) => {
  const urlQueryParams = {
    isFromMassDeployment,
    email: encodeURIComponent(parsedEmail),
    team: parsedTeam,
    withNewFlow,
    withSkipButton,
  };
  const queryStringParams = Object.entries(urlQueryParams)
    .filter(([_, value]) => value !== "" && value !== false)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
  const urlSegment: string =
    flowType === AccountCreationFlowType.ADMIN
      ? ACCOUNT_CREATION_TAC_URL_SEGMENT
      : EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT;
  if (queryStringParams === "") {
    return urlSegment;
  }
  return `${urlSegment}?${queryStringParams}`;
};
