import { ThumbnailSize } from 'webapp/ids/types';
export const PassportThumbnail = (size: ThumbnailSize) => {
    return `/passports/${size}.svg`;
};
