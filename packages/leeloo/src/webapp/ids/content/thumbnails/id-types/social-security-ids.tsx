import { ThumbnailSize } from 'webapp/ids/types';
const regionMapping = {
    FR: 'fr',
    GB: 'uk',
    US: 'us',
    UNIVERSAL: 'row',
};
export const SocialSecurityIdThumbnail = (size: ThumbnailSize, country: string) => {
    const region = regionMapping[country] ?? regionMapping.UNIVERSAL;
    return `/social-security-ids/${region}-${size}.svg`;
};
