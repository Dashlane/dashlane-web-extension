import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { VaultItemsQuery } from "@dashlane/vault-contracts";
import { VaultRepository } from "../../../vault-repository";
@QueryHandler(VaultItemsQuery)
export class VaultItemsQueryHandler implements IQueryHandler<VaultItemsQuery> {
  constructor(private vaultRepository: VaultRepository) {}
  public execute({
    body,
  }: VaultItemsQuery): QueryHandlerResponseOf<VaultItemsQuery> {
    return this.vaultRepository.fetchVaultItems$(body);
  }
}
