import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { DomainIconDetailsQuery } from "@dashlane/vault-contracts";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { UnsafeMd5Hasher } from "@dashlane/framework-dashlane-application";
import { bufferToHex, textToArrayBuffer } from "@dashlane/framework-encoding";
import { CarbonLegacyClient } from "@dashlane/communication";
import { isDomainIconDetailsMap } from "./is-domain-icon-details-map";
@QueryHandler(DomainIconDetailsQuery)
export class DomainIconDetailsQueryHandler
  implements IQueryHandler<DomainIconDetailsQuery>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private md5Hasher: UnsafeMd5Hasher
  ) {}
  public execute({
    body: { domain },
  }: DomainIconDetailsQuery): QueryHandlerResponseOf<DomainIconDetailsQuery> {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return carbonState({
      path: "userSession.iconsCache.domains",
    }).pipe(
      mapSuccessObservable((domainIconsDetails) => {
        if (!isDomainIconDetailsMap(domainIconsDetails)) {
          throw new Error("Bad domain icons cache format");
        }
        return domainIconsDetails.get(
          bufferToHex(this.md5Hasher.compute(textToArrayBuffer(domain)))
        );
      })
    );
  }
}
