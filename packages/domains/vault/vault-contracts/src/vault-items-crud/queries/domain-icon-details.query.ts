import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { DomainIconDetails } from "../types/domain-icon-details.types";
export interface DomainIconDetailsQueryParam {
  domain: string;
}
export class DomainIconDetailsQuery extends defineQuery<
  DomainIconDetails | undefined,
  never,
  DomainIconDetailsQueryParam
>({
  scope: UseCaseScope.User,
  useCache: true,
}) {}
