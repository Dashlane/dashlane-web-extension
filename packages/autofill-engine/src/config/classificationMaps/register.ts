import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const REGISTER_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
  {
    password: [
      {
        extraValues: [],
        source: {
          [OtherSourceType.NewPassword]: OtherSourceType.NewPassword,
        },
      },
      {
        extraValues: ["new"],
        source: {
          [OtherSourceType.NewPassword]: OtherSourceType.NewPassword,
        },
      },
    ],
    date: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["day"],
        source: {},
      },
      {
        extraValues: ["month"],
        source: {},
      },
      {
        extraValues: ["year"],
        source: {},
      },
      {
        extraValues: ["birth"],
        source: {
          [VaultSourceType.Identity]: "birthDate",
        },
      },
      {
        extraValues: ["birth", "day"],
        source: {
          [VaultSourceType.Identity]: "birthDay",
        },
      },
      {
        extraValues: ["birth", "month"],
        source: {
          [VaultSourceType.Identity]: "birthMonth",
        },
      },
      {
        extraValues: ["birth", "year"],
        source: {
          [VaultSourceType.Identity]: "birthYear",
        },
      },
      {
        extraValues: ["birth", "month", "day"],
        source: {
          [VaultSourceType.Identity]: "birthMonth",
        },
      },
      {
        extraValues: ["birth", "year", "day"],
        source: {
          [VaultSourceType.Identity]: "birthYear",
        },
      },
      {
        extraValues: ["credit_card", "expiration"],
        source: {
          [VaultSourceType.PaymentCard]: "expireDate",
        },
      },
      {
        extraValues: ["credit_card", "expiration", "month"],
        source: {
          [VaultSourceType.PaymentCard]: "expireMonth",
        },
      },
      {
        extraValues: ["credit_card", "expiration", "year"],
        source: {
          [VaultSourceType.PaymentCard]: "expireYear",
        },
      },
    ],
    otp: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "otpSecret",
        },
      },
    ],
    payment: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["bank_account"],
        source: {
          [VaultSourceType.BankAccount]: "name",
        },
      },
      {
        extraValues: ["bank_account", "bank_name"],
        source: {
          [VaultSourceType.BankAccount]: "bankCode",
        },
      },
      {
        extraValues: ["bank_account", "bic"],
        source: {
          [VaultSourceType.BankAccount]: "BIC",
        },
      },
      {
        extraValues: ["bank_account", "iban"],
        source: {
          [VaultSourceType.BankAccount]: "IBAN",
        },
      },
      {
        extraValues: ["bank_account", "bank_code"],
        source: {
          [VaultSourceType.BankAccount]: "BIC",
        },
      },
      {
        extraValues: ["bank_account", "number"],
        source: {
          [VaultSourceType.BankAccount]: "IBAN",
        },
      },
      {
        extraValues: ["credit_card"],
        source: {},
      },
      {
        extraValues: ["credit_card", "expiration"],
        source: {
          [VaultSourceType.PaymentCard]: "expireDate",
        },
      },
      {
        extraValues: ["credit_card", "number"],
        source: {
          [VaultSourceType.PaymentCard]: "cardNumber",
        },
      },
      {
        extraValues: ["credit_card", "cvv"],
        source: {
          [VaultSourceType.PaymentCard]: "securityCode",
        },
      },
      {
        extraValues: ["credit_card", "type"],
        source: {
          [VaultSourceType.PaymentCard]: "type",
        },
      },
    ],
  };
