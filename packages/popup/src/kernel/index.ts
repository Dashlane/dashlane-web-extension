import { locales, translationService } from "../libs/i18n";
import { TranslationService } from "../libs/i18n/types";
import { BrowserActions, makeBrowserActions } from "./browserActions";
import {
  AcknowledgedChannel,
  Channel,
  createApplicationClient,
  MemoryChannel,
  NoDynamicChannels,
} from "@dashlane/framework-application";
import { AppModules, ClientsOf } from "@dashlane/framework-contracts";
import {
  AppDefinition,
  appDefinition,
} from "@dashlane/application-extension-definition";
import { BrowserPortConnector } from "@dashlane/framework-infra";
import { GrapheneBroadcastChannel } from "./graphene-broadcast-channel";
const FOREGROUND_TO_BACKGROUND_CHANNEL_NAME = "graphene-background-port";
export interface Kernel {
  browser: BrowserActions;
  getTranslator: () => TranslationService;
  getAvailableLocales: () => string[];
  readonly coreClient: ClientsOf<AppModules<AppDefinition>>;
}
function getTranslator(): TranslationService {
  return translationService;
}
function getAvailableLocales(): string[] {
  return locales;
}
function createModulesChannel(): Channel {
  if (!window.chrome?.runtime) {
    return new MemoryChannel();
  }
  return new AcknowledgedChannel(
    new BrowserPortConnector(FOREGROUND_TO_BACKGROUND_CHANNEL_NAME)
  );
}
export let kernel: Kernel;
export async function buildKernel(): Promise<Kernel> {
  const coreClient = (
    await createApplicationClient({
      clientName: "popup",
      appDefinition,
      channels: {
        background: createModulesChannel(),
      },
      channelsListener: NoDynamicChannels,
    })
  ).client;
  kernel = {
    browser: makeBrowserActions(),
    getTranslator,
    getAvailableLocales,
    coreClient,
  };
  return kernel;
}
