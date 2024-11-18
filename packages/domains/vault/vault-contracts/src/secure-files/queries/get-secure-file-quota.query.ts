import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SecureFilesQuota } from "../types";
export type GetSecureFileQuotaQueryResult = SecureFilesQuota;
export class GetSecureFileQuotaQuery extends defineQuery<GetSecureFileQuotaQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
