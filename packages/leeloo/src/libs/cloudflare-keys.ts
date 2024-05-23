export const getCloudflareKeys = () => {
    if (!USE_CLOUDFLARE_HEADERS) {
        return undefined;
    }
    return {
        cloudflareAccess: CLOUDFLARE_ACCESS_KEY,
        cloudflareSecret: CLOUDFLARE_SECRET_KEY,
    };
};
