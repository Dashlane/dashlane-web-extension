import { webservicesApiKeys } from '../server-sdk-api-keys';
const styxDevApiKeys = {
    styxAccess: '*****',
    styxSecret: '*****',
};
const styxProdApiKeys = {
    styxAccess: '*****',
    styxSecret: '*****',
};
const styxApiKeys = ***** ? styxProdApiKeys : styxDevApiKeys;
export const getCloudflareKeys = (): {
    cloudflareAccess: string;
    cloudflareSecret: string;
} | undefined => {
    if (!USE_CLOUDFLARE_HEADERS) {
        return undefined;
    }
    return {
        cloudflareAccess: CLOUDFLARE_ACCESS_KEY,
        cloudflareSecret: CLOUDFLARE_SECRET_KEY,
    };
};
export const serverApiKeys = {
    ...webservicesApiKeys,
    ...styxApiKeys,
    ...(getCloudflareKeys() ?? {}),
};
