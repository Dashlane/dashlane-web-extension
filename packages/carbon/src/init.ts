import { InitOptions } from "init-options";
import { CoreServices, getCoreServices } from "Services/";
import { initCarbon } from "Sdk/Default";
export async function init(options: InitOptions): Promise<CoreServices> {
  const carbonServices = await initCarbon(options);
  const services = getCoreServices(carbonServices);
  return services;
}
