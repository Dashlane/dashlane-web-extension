import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import {
  AuthenticationFlowView,
  GetSsoProviderInfoQueryResult,
  GetSsoUserSettingsQueryResult,
} from "./authentication-flow.types";
export class AuthenticationFlowStatusQuery extends defineQuery<AuthenticationFlowView>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class GetSsoUserSettingsQuery extends defineQuery<GetSsoUserSettingsQueryResult>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class GetSsoProviderInfoQuery extends defineQuery<GetSsoProviderInfoQueryResult>(
  {
    scope: UseCaseScope.Device,
  }
) {}
