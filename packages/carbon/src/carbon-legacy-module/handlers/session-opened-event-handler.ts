import { EventHandler, IEventHandler } from "@dashlane/framework-application";
import { SessionOpenedEvent } from "@dashlane/session-contracts";
import { CarbonLegacyInfrastructure } from "carbon-legacy-module/carbon-legacy-infrastructure";
@EventHandler(SessionOpenedEvent)
export class SessionOpenedEventHandler
  implements IEventHandler<SessionOpenedEvent>
{
  constructor(private readonly infra: CarbonLegacyInfrastructure) {}
  async handle({ body: { login } }: SessionOpenedEvent) {
    const carbon = await this.infra.getCarbon();
    void carbon.coreServices.eventBusService._sessionOpened({ login });
  }
}
