import { ThumbnailSize } from 'webapp/ids/types';
export const FiscalIdThumbnail = (size: ThumbnailSize) => {
    return `/fiscal-ids/${size}.svg`;
};
