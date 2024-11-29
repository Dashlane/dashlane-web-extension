import { Field } from "@dashlane/hermes";
import { Country } from "@dashlane/communication";
import { RevealedBankAccountField } from "@dashlane/risk-monitoring-contracts";
export const getBankFieldByCountry = (
  field: Field,
  country: Country
): RevealedBankAccountField | undefined => {
  switch (field) {
    case Field.Iban:
      switch (country) {
        case Country.GB:
        case Country.US:
        case Country.MX:
          return "account_number";
        default:
          return "iban";
      }
    case Field.Bic:
      switch (country) {
        case Country.GB:
          return "sort_code";
        case Country.US:
          return "routing_number";
        case Country.MX:
        default:
          return "swift";
      }
  }
  return;
};
