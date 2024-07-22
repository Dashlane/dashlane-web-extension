import { map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { GetVaultNotificationsStatusQuery } from "@dashlane/vault-contracts";
import { VaultNotificationsStore } from "../../stores/vault-notifications.store";
@QueryHandler(GetVaultNotificationsStatusQuery)
export class GetVaultNotificationsStatusQueryHandler
  implements IQueryHandler<GetVaultNotificationsStatusQuery>
{
  constructor(private readonly store: VaultNotificationsStore) {}
  execute(): QueryHandlerResponseOf<GetVaultNotificationsStatusQuery> {
    return this.store.state$.pipe(map(success));
  }
}
