import { ThumbnailSize } from "../../../types";
export const PassportThumbnail = (size: ThumbnailSize) => {
  return `/passports/${size}.svg`;
};
