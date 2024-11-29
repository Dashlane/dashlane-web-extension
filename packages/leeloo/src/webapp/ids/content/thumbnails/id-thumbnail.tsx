import { memo } from "react";
import { Country, VaultItemType } from "@dashlane/vault-contracts";
import { IdVaultItemType, ThumbnailSize } from "../../types";
import { DriverLicenseThumbnail } from "./id-types/driver-licenses";
import { FiscalIdThumbnail } from "./id-types/fiscal-ids";
import { IdCardThumbnail } from "./id-types/id-cards";
import { PassportThumbnail } from "./id-types/passports";
import { SocialSecurityIdThumbnail } from "./id-types/social-security-ids";
interface Props {
  country?: string;
  size: ThumbnailSize;
  type: IdVaultItemType;
}
const sizeMap = {
  small: {
    width: "48",
    height: "32",
  },
  medium: {
    width: "96",
    height: "64",
  },
  large: {
    width: "168",
    height: "108",
  },
};
const idMapping = {
  [VaultItemType.DriversLicense]: DriverLicenseThumbnail,
  [VaultItemType.FiscalId]: FiscalIdThumbnail,
  [VaultItemType.IdCard]: IdCardThumbnail,
  [VaultItemType.Passport]: PassportThumbnail,
  [VaultItemType.SocialSecurityId]: SocialSecurityIdThumbnail,
};
export const IdThumbnailComponent = ({ country, size, type }: Props) => {
  const thumbnailPath =
    `${PUBLIC_PATH}assets/ids/thumbnails` +
    idMapping[type](size, country ? country : Country.UNIVERSAL);
  return (
    <img
      src={thumbnailPath}
      sx={{
        flexShrink: 0,
        userSelect: "none",
      }}
      alt=""
      width={sizeMap[size].width}
      height={sizeMap[size].height}
    />
  );
};
export const IdThumbnail = memo(IdThumbnailComponent);
