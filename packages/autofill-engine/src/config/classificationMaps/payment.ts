import { VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const PAYMENT_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
  {
    date: [
      {
        extraValues: [],
        source: {},
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
    name: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["first"],
        source: {
          [VaultSourceType.Identity]: "firstName",
        },
      },
      {
        extraValues: ["last"],
        source: {
          [VaultSourceType.Identity]: "lastName",
        },
      },
      {
        extraValues: ["bank_account"],
        source: {
          [VaultSourceType.BankAccount]: "owner",
        },
      },
      {
        extraValues: ["credit_card"],
        source: {
          [VaultSourceType.PaymentCard]: "ownerName",
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
    otp: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "otpSecret",
        },
      },
    ],
  };
