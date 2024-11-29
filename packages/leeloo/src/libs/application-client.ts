import type { ClientsOf as ApplicationClient } from "@dashlane/framework-contracts";
import type { LeelooDependencies } from "./application-dependencies";
let applicationClient: ApplicationClient<LeelooDependencies> | undefined =
  undefined;
export function getApplicationClient(): ApplicationClient<LeelooDependencies> {
  if (!applicationClient) {
    throw new Error("No application client available");
  }
  return applicationClient;
}
export function setApplicationClient(
  appClient: ApplicationClient<LeelooDependencies>
) {
  applicationClient = appClient;
}
