import { AnyModuleApis, ClientsOf as ApplicationClient, } from '@dashlane/framework-contracts';
let applicationClient: ApplicationClient<AnyModuleApis> | undefined = undefined;
export function getApplicationClient(): ApplicationClient<AnyModuleApis> {
    if (!applicationClient) {
        throw new Error('No application client available');
    }
    return applicationClient;
}
export function setApplicationClient(appClient: ApplicationClient<AnyModuleApis>) {
    applicationClient = appClient;
}
