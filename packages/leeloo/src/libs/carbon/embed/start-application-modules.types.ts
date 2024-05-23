import { AppDefinition } from '@dashlane/application-extension-definition';
import { CarbonApiEvents, CarbonLeelooConnector, } from '@dashlane/communication';
import { CoreServices } from '@dashlane/carbon';
import { App, LowLevelChannel } from '@dashlane/framework-application';
export interface CarbonReadyHandler {
    app: App<AppDefinition>;
    signalCarbonReady: (services: CoreServices, events: CarbonApiEvents, leelooEvents: typeof CarbonLeelooConnector) => void;
    grapheneChannel: LowLevelChannel;
}
