import { ThumbnailSize } from 'webapp/ids/types';
const regionMapping = {
    FR: 'fr',
    UNIVERSAL: 'row',
};
export const IdCardThumbnail = (size: ThumbnailSize, country: string) => {
    const region = regionMapping[country] ?? regionMapping.UNIVERSAL;
    return `/id-cards/${region}-${size}.svg`;
};
