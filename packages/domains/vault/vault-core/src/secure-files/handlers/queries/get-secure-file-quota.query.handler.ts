import { GetSecureFileQuotaQuery } from "@dashlane/vault-contracts";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { map } from "rxjs";
import { SecureFilesQuotaStore } from "../../stores/secure-file-quota.store";
@QueryHandler(GetSecureFileQuotaQuery)
export class GetSecureFileQuotaQueryHandler
  implements IQueryHandler<GetSecureFileQuotaQuery>
{
  constructor(private readonly quotaStore: SecureFilesQuotaStore) {}
  execute() {
    return this.quotaStore.state$.pipe(
      map((quotaState) => success(quotaState))
    );
  }
}
