import { vaultItemsCrudApi } from "@dashlane/vault-contracts";
import { BaseEventEmitter, Injectable } from "@dashlane/framework-application";
@Injectable()
export class VaultItemsCommandEventsEmitter extends BaseEventEmitter<
  typeof vaultItemsCrudApi
> {}
