import {
  Address,
  BankAccount,
  Collection,
  Company,
  Credential,
  DriverLicense,
  Email,
  FiscalId,
  GeneratedPassword,
  IdCard,
  Identity,
  Note,
  Passkey,
  Passport,
  PaymentCard,
  PersonalWebsite,
  Phone,
  PremiumStatusSpace,
  Secret,
  SocialSecurityId,
  Space,
} from "@dashlane/communication";
import { ChangeHistory } from "./ChangeHistory/types";
type QuarantinableItem =
  | Address
  | BankAccount
  | Company
  | Credential
  | Collection
  | ChangeHistory
  | DriverLicense
  | Email
  | FiscalId
  | GeneratedPassword
  | IdCard
  | Identity
  | Note
  | Passkey
  | Passport
  | PaymentCard
  | PersonalWebsite
  | Phone
  | Secret
  | SocialSecurityId;
const findPremiumSpaceForItem = (
  item: QuarantinableItem,
  spaces: Space[]
): PremiumStatusSpace | null => {
  const premiumSpace = spaces.find(
    (space) => space.details && space.teamId === item.SpaceId
  );
  return premiumSpace ? premiumSpace.details : null;
};
const itemIsInQuarantineSpace = <T extends QuarantinableItem>(
  item: T,
  space: PremiumStatusSpace
): boolean => {
  return item.SpaceId === space.teamId;
};
export const itemIsNotQuarantined = <T extends QuarantinableItem>(
  quarantinedSpaces: Space[],
  item: T
): boolean => {
  const quarantinedSpace = findPremiumSpaceForItem(item, quarantinedSpaces);
  return quarantinedSpace
    ? !itemIsInQuarantineSpace(item, quarantinedSpace)
    : true;
};
export const filterOutQuarantinedItems = <T extends QuarantinableItem>(
  items: T[],
  quarantinedSpaces: Space[]
): T[] => {
  if (quarantinedSpaces.length === 0) {
    return items;
  }
  const isNotQuarantined = (item: T) =>
    itemIsNotQuarantined(quarantinedSpaces, item);
  return items.filter(isNotQuarantined);
};
