import { Trigger } from "@dashlane/hermes";
import { CoreServices } from "Services";
export async function forceSyncHandler({
  sessionService,
}: CoreServices): Promise<void> {
  await sessionService.getInstance().user.attemptSync(Trigger.Manual);
}
