import { appDefinition } from "@dashlane/application-extension-definition";
import type { ClientsOf as ApplicationClient } from "@dashlane/framework-contracts";
import {
  AcknowledgedChannel,
  createApplicationClient,
  LowLevelChannel,
  NoDynamicChannels,
} from "@dashlane/framework-application";
import { LeelooDependencies } from "../../libs/application-dependencies";
import { setApplicationClient } from "../../libs/application-client";
export async function initAppClient(
  channelToBackground: LowLevelChannel
): Promise<ApplicationClient<LeelooDependencies>> {
  const { client } = await createApplicationClient({
    clientName: "leeloo",
    appDefinition,
    channels: {
      background: new AcknowledgedChannel(channelToBackground),
    },
    channelsListener: NoDynamicChannels,
  });
  setApplicationClient(client);
  return client;
}
