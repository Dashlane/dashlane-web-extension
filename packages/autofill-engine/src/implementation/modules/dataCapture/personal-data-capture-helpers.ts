import { ParsedURL } from "@dashlane/url-parser";
import {
  IdentityAutofillView,
  PaymentCardAutofillView,
  PhoneAutofillView,
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import {
  AutofillableElementValue,
  AutofillableElementValues,
  AutofillIngredient,
  FieldFormat,
  isVaultIngredient,
  VaultIngredient,
} from "../../../types";
import { isEmail, isPhoneNumber } from "./format-helpers";
export const shouldShowDataCaptureForVaultTypeMap: Record<
  VaultSourceType,
  boolean
> = {
  [VaultSourceType.Address]: true,
  [VaultSourceType.BankAccount]: false,
  [VaultSourceType.Company]: false,
  [VaultSourceType.Credential]: false,
  [VaultSourceType.DriverLicense]: false,
  [VaultSourceType.Email]: true,
  [VaultSourceType.FiscalId]: false,
  [VaultSourceType.GeneratedPassword]: false,
  [VaultSourceType.IdCard]: false,
  [VaultSourceType.Identity]: true,
  [VaultSourceType.Note]: false,
  [VaultSourceType.Passkey]: false,
  [VaultSourceType.Passport]: false,
  [VaultSourceType.PaymentCard]: true,
  [VaultSourceType.PersonalWebsite]: true,
  [VaultSourceType.Phone]: true,
  [VaultSourceType.SocialSecurityId]: false,
  [VaultSourceType.Secret]: false,
};
export const minimumNumberOfDataCaptureFieldsMap: Record<
  VaultSourceType,
  number
> = {
  [VaultSourceType.Address]: 3,
  [VaultSourceType.BankAccount]: 0,
  [VaultSourceType.Company]: 0,
  [VaultSourceType.Credential]: 0,
  [VaultSourceType.DriverLicense]: 0,
  [VaultSourceType.Email]: 1,
  [VaultSourceType.FiscalId]: 0,
  [VaultSourceType.GeneratedPassword]: 0,
  [VaultSourceType.IdCard]: 0,
  [VaultSourceType.Identity]: 2,
  [VaultSourceType.Note]: 0,
  [VaultSourceType.Passkey]: 0,
  [VaultSourceType.Passport]: 0,
  [VaultSourceType.PaymentCard]: 3,
  [VaultSourceType.PersonalWebsite]: 1,
  [VaultSourceType.Phone]: 1,
  [VaultSourceType.SocialSecurityId]: 0,
  [VaultSourceType.Secret]: 0,
};
const isIngredientUsefulForDataCaptureOfVaultType = (
  ingredient: AutofillIngredient,
  vaultType: VaultSourceType
) => {
  return (
    ingredient.type === vaultType ||
    (vaultType === VaultSourceType.Phone &&
      ingredient.type === VaultSourceType.Address &&
      ingredient.property === "country")
  );
};
const isCapturedValueValidForIngredientAndVaultType = (
  capturedValue: string,
  ingredient: VaultIngredient,
  vaultType: VaultSourceType
) => {
  if (ingredient.type !== vaultType) {
    return false;
  }
  const isCapturedValueAnURL = new ParsedURL(capturedValue).isUrlValid();
  switch (ingredient.type) {
    case VaultSourceType.Email:
      return !(ingredient.property === "email" && !isEmail(capturedValue));
    case VaultSourceType.PersonalWebsite:
      return !(ingredient.property === "website" && !isCapturedValueAnURL);
    case VaultSourceType.Phone:
      return !(
        (ingredient.property === "number" ||
          ingredient.property === "numberInternational") &&
        !isPhoneNumber(capturedValue)
      );
    default:
      return true;
  }
};
const findCapturableValuesAndPropertiesForVaultType = (
  allEltValues: AutofillableElementValue[],
  vaultType: VaultSourceType
): CapturedValuesAndProperties<VaultSourceType> => {
  const capturedValues: CapturedValuesAndProperties<VaultSourceType> = [];
  allEltValues.forEach((element) => {
    element.ingredients.forEach((ingredient) => {
      if (
        isVaultIngredient(ingredient) &&
        isIngredientUsefulForDataCaptureOfVaultType(ingredient, vaultType) &&
        isCapturedValueValidForIngredientAndVaultType(
          element.value,
          ingredient,
          vaultType
        )
      ) {
        capturedValues.push({
          value: element.value,
          property: ingredient.property,
          format: ingredient.format,
        } as SomeCapturedValueAndProperty<VaultSourceType>);
      }
    });
  });
  if (
    vaultType === VaultSourceType.Phone &&
    !capturedValues.find(
      (someCapturedValueAndProperty) =>
        someCapturedValueAndProperty.property ===
        ("number" as keyof PhoneAutofillView)
    )
  ) {
    return [];
  }
  if (
    vaultType === VaultSourceType.Identity &&
    !capturedValues.find(
      ({ property }) =>
        property === ("firstName" as keyof IdentityAutofillView) ||
        property === ("lastName" as keyof IdentityAutofillView)
    )
  ) {
    return [];
  }
  if (
    vaultType === VaultSourceType.PaymentCard &&
    !capturedValues.find(
      ({ property }) =>
        property === ("cardNumber" as keyof PaymentCardAutofillView)
    )
  ) {
    return [];
  }
  return capturedValues;
};
type VaultPropertyAndFormat<T extends keyof VaultAutofillViewInterfaces> = {
  property: keyof VaultAutofillViewInterfaces[T];
  format?: FieldFormat;
};
export type SomeVaultIngredient<T extends keyof VaultAutofillViewInterfaces> = {
  type: T;
} & VaultPropertyAndFormat<T>;
type SomeCapturedValueAndProperty<T extends keyof VaultAutofillViewInterfaces> =
  VaultPropertyAndFormat<T> & {
    value: string;
  };
export type CapturedValuesAndProperties<
  T extends keyof VaultAutofillViewInterfaces
> = SomeCapturedValueAndProperty<T>[];
export type CapturedPersonalData = Partial<
  Record<
    keyof VaultAutofillViewInterfaces,
    CapturedValuesAndProperties<keyof VaultAutofillViewInterfaces>
  >
>;
export const findCapturedPersonalData = (
  elementValues: AutofillableElementValues
): CapturedPersonalData => {
  const allEltValues = Object.values(elementValues);
  const capturedAddresses = findCapturableValuesAndPropertiesForVaultType(
    allEltValues,
    VaultSourceType.Address
  );
  const capturedEmails = findCapturableValuesAndPropertiesForVaultType(
    allEltValues,
    VaultSourceType.Email
  );
  const capturedIdentities = findCapturableValuesAndPropertiesForVaultType(
    allEltValues,
    VaultSourceType.Identity
  );
  const capturedPhones = findCapturableValuesAndPropertiesForVaultType(
    allEltValues,
    VaultSourceType.Phone
  );
  const capturedWebsites = findCapturableValuesAndPropertiesForVaultType(
    allEltValues,
    VaultSourceType.PersonalWebsite
  );
  const capturedCreditCard = findCapturableValuesAndPropertiesForVaultType(
    allEltValues,
    VaultSourceType.PaymentCard
  );
  return {
    [VaultSourceType.Address]: capturedAddresses,
    [VaultSourceType.Email]: capturedEmails,
    [VaultSourceType.Identity]: capturedIdentities,
    [VaultSourceType.PaymentCard]: capturedCreditCard,
    [VaultSourceType.PersonalWebsite]: capturedWebsites,
    [VaultSourceType.Phone]: capturedPhones,
  };
};
