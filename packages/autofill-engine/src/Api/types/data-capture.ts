import {
  CountryForAutofill,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
type DataCaptureWebcardItemBase<T extends VaultSourceType> = {
  readonly type: T;
  readonly content: string;
};
interface DataCaptureWebcardItemProperties {
  [VaultSourceType.Address]: {
    addressFull: string;
    city: string;
    zipCode: string;
    country: string;
    localeFormat: CountryForAutofill;
  };
  [VaultSourceType.Email]: {
    email: string;
  };
  [VaultSourceType.Identity]: {
    firstName: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
  };
  [VaultSourceType.Phone]: {
    number: string;
    localeFormat: CountryForAutofill;
  };
  [VaultSourceType.PersonalWebsite]: {
    website: string;
  };
  [VaultSourceType.PaymentCard]: {
    cardName: string;
    cardNumber: string;
    ownerName: string;
    expireMonth: string;
    expireYear: string;
    securityCode: string;
  };
}
export type SomeDataCaptureWebcardItem<
  T extends keyof DataCaptureWebcardItemProperties
> = DataCaptureWebcardItemBase<T> & DataCaptureWebcardItemProperties[T];
export type AllDataCaptureWebcardItem<T> =
  T extends keyof DataCaptureWebcardItemProperties
    ? SomeDataCaptureWebcardItem<T>
    : never;
export type DataCaptureWebcardItem = AllDataCaptureWebcardItem<VaultSourceType>;
