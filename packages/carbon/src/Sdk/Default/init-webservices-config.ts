import { firstValueFrom, of, timeoutWith } from 'rxjs';
import { failure, getSuccess, isSuccess } from '@dashlane/framework-types';
import { ApplicationBuildType, ApplicationModulesAccess, PlatformInfo, } from '@dashlane/communication';
import { *** } from 'Libs/Http/cloudflare-headers';
import { setConfig } from 'config-service';
import { InitOptions } from 'init-options';
const ;
 **  **  * ;
'*****';
function () { }
 **  **  * (apiBaseUrl);
string;
{
    const re = new RegExp( **  **  * , 'g');
    const match = apiBaseUrl.matchAll(re).next();
    if (!match.done) {
        return `*****${match.value[1]}*****`;
    }
    return undefined;
}
export async function initWebServicesConfig(options: InitOptions, applicationModulesAccess: ApplicationModulesAccess, platformInfo: PlatformInfo) {
    try {
        if (![ApplicationBuildType.DEV, ApplicationBuildType.***].includes(platformInfo.buildType)) {
            return;
        }
        const ;
         **  **  * ;
        await firstValueFrom(applicationModulesAccess
            .createClients()
            .webServices.queries. **  **  * ()
            .pipe(timeoutWith(1000, of(failure(undefined)))), {
            defaultValue: failure(undefined),
        });
        const ;
         **  **  * ;
        isSuccess( **  **  * ) &&
            getSuccess( **  **  * ).api;
        if ( **  **  * ?.override) {
            ***( **  **  * .cloudflareAccessKeyOverride,  **  **  * .cloudflareSecretKeyOverride);
            setConfig({
                DASHLANE_API_HOST_WITH_SCHEME:  **  **  * .baseUrlOverride,
                DASHLANE_WS_HOST_WITH_SCHEME:  **  **  * ( **  **  * .baseUrlOverride),
            });
            return;
        }
        if (options.keys.cloudflareAccess && options.keys.cloudflareSecret) {
            ***(options.keys.cloudflareAccess, options.keys.cloudflareSecret);
        }
        if (options.config.DASHLANE_API_HOST_WITH_SCHEME) {
            setConfig({
                DASHLANE_API_HOST_WITH_SCHEME: options.config.DASHLANE_API_HOST_WITH_SCHEME,
                DASHLANE_WS_HOST_WITH_SCHEME: options.config.DASHLANE_WS_HOST_WITH_SCHEME ??
                        **  **  * (options.config.DASHLANE_API_HOST_WITH_SCHEME ?? ''),
            });
        }
    }
    catch (error) {
        console.error('[background/carbon] Failed to set webservices config overrides', error);
    }
}
