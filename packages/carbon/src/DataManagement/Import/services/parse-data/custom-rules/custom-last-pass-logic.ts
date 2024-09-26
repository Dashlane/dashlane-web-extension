import { getMonth } from "date-fns";
import {
  BankAccount,
  Country,
  DataModelType,
  DataToImport,
  ImportSource,
  ParsedCSVData,
  PaymentCard,
  SupportedVaultItems,
  SupportedVaultTypes,
} from "@dashlane/communication";
import {
  BANK_ACCOUNT_HEADERS,
  PAYMENT_CARD_HEADERS,
  SECURE_NOTES_HEADERS,
} from "../types";
import {
  buildBankAccountObj,
  buildNoteObj,
  buildPaymentCardObj,
} from "../utils";
export const LAST_PASS_SECURE_NOTE_URL = "*****";
export const enum LastPassNoteType {
  BankAccountType = "Bank Account",
  PaymentCardType = "Credit Card",
}
export const LPNoteTypeField = { NoteType: "NoteType" };
const enum LPBankAccountFields {
  BankName = "Bank Name",
  AccountType = "Account Type",
  RoutingNumber = "Routing Number",
  AccountNumber = "Account Number",
  SWIFTCode = "SWIFT Code",
  IBANNumber = "IBAN Number",
  Pin = "Pin",
  BranchAddress = "Branch Address",
  BranchPhone = "BranchPhone",
  Notes = "Notes",
}
const enum LPPaymentCardFields {
  NameOnCard = "Name on Card",
  Type = "Type",
  Number = "Number",
  SecurityCode = "Security Code",
  StartDate = "Start Date",
  ExpirationDate = "Expiration Date",
  Notes = "Notes",
  Language = "Language",
}
type ParsedLastPassNote = {
  type: LastPassNoteType;
  data: Partial<SupportedVaultItems[keyof SupportedVaultItems]>;
} | null;
export const parseLastPassSecureNote = (
  noteContent: string
): ParsedLastPassNote => {
  const constructedNoteContent = {};
  try {
    const splitNoteContent = noteContent.split("\n");
    splitNoteContent.forEach((noteField) => {
      const [key, value] = noteField.split(":");
      constructedNoteContent[key] = value;
    });
    switch (constructedNoteContent["NoteType"]) {
      case LastPassNoteType.BankAccountType: {
        const partialBankAccount: Partial<BankAccount> = {
          BankAccountName: constructedNoteContent[LPBankAccountFields.BankName],
          BankAccountOwner: "",
          BankAccountIBAN: !constructedNoteContent[
            LPBankAccountFields.IBANNumber
          ]
            ? constructedNoteContent[LPBankAccountFields.AccountNumber]
            : constructedNoteContent[LPBankAccountFields.IBANNumber],
          BankAccountBIC: !constructedNoteContent[LPBankAccountFields.SWIFTCode]
            ? constructedNoteContent[LPBankAccountFields.RoutingNumber]
            : constructedNoteContent[LPBankAccountFields.SWIFTCode],
          BankAccountBank: "",
          kwType: DataModelType.KWBankStatement,
        };
        return {
          type: LastPassNoteType.BankAccountType,
          data: partialBankAccount,
        };
      }
      case LastPassNoteType.PaymentCardType: {
        const lpExpirationDate =
          constructedNoteContent[LPPaymentCardFields.ExpirationDate];
        let expiryMonth;
        let expiryYear;
        if (lpExpirationDate) {
          const [rawExpireMonth, rawExpireYear] = lpExpirationDate.split(",");
          expiryMonth = `${getMonth(new Date(`${rawExpireMonth} 1`)) + 1}`;
          expiryMonth = expiryMonth.length <= 2 ? expiryMonth : "";
          expiryYear =
            rawExpireYear.length === 4 && !isNaN(rawExpireYear)
              ? rawExpireYear
              : "";
        }
        const partialPaymentCard: Partial<PaymentCard> = {
          CardNumber: constructedNoteContent[LPPaymentCardFields.Number],
          OwnerName: constructedNoteContent[LPPaymentCardFields.NameOnCard],
          SecurityCode:
            constructedNoteContent[LPPaymentCardFields.SecurityCode],
          ExpireMonth: expiryMonth,
          ExpireYear: expiryYear,
          CCNote: constructedNoteContent[LPPaymentCardFields.Notes],
          kwType: DataModelType.KWPaymentMean_creditCard,
        };
        delete constructedNoteContent[LPNoteTypeField.NoteType];
        delete constructedNoteContent[LPPaymentCardFields.ExpirationDate];
        delete constructedNoteContent[LPPaymentCardFields.Language];
        constructedNoteContent["Payment Type"] =
          constructedNoteContent[LPPaymentCardFields.Type];
        delete constructedNoteContent[LPNoteTypeField.NoteType];
        const paymentCardKeys = Object.keys(partialPaymentCard);
        const paymentCardValues = Object.values(partialPaymentCard);
        Object.keys(constructedNoteContent).forEach((key) => {
          if (
            paymentCardKeys.includes(key) ||
            paymentCardValues.includes(constructedNoteContent[key])
          ) {
            delete constructedNoteContent[key];
          }
        });
        return {
          type: LastPassNoteType.PaymentCardType,
          data: { ...constructedNoteContent, ...partialPaymentCard },
        };
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
};
export const processAndPushLastPassNote = (
  csvRowObj: Record<string, string>,
  importSource: ImportSource,
  country: Country,
  parsedCSVRows: DataToImport,
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>
) => {
  if (csvRowObj["url"]?.includes(LAST_PASS_SECURE_NOTE_URL)) {
    delete csvRowObj["url"];
    const parsedNoteContent = parseLastPassSecureNote(csvRowObj["extra"]);
    const mappingHeaders =
      parsedNoteContent?.type === LastPassNoteType.BankAccountType
        ? BANK_ACCOUNT_HEADERS
        : parsedNoteContent?.type === LastPassNoteType.PaymentCardType
        ? PAYMENT_CARD_HEADERS
        : SECURE_NOTES_HEADERS;
    Object.keys(parsedNoteContent?.data ?? {}).forEach((parsedNoteKey) => {
      const matchedSupportedHeader = Object.keys(mappingHeaders).find(
        (supportedHeader) =>
          mappingHeaders[supportedHeader].has(parsedNoteKey.toLocaleLowerCase())
      );
      if (!parsedHeaders.has(parsedNoteKey) && parsedNoteKey) {
        parsedHeaders.set(parsedNoteKey, {
          original: parsedNoteKey,
          matched: matchedSupportedHeader ?? "",
        });
      }
    });
    switch (parsedNoteContent?.type) {
      case LastPassNoteType.BankAccountType: {
        const bankObj = {
          baseDataModel: buildBankAccountObj(
            parsedNoteContent.data,
            importSource,
            parsedHeaders
          ),
          rawData: csvRowObj,
        };
        parsedCSVRows.bankAccounts.push(bankObj);
        return;
      }
      case LastPassNoteType.PaymentCardType: {
        const paymentObj = {
          baseDataModel: buildPaymentCardObj(
            parsedNoteContent.data,
            importSource,
            parsedHeaders,
            country
          ),
          rawData: csvRowObj,
        };
        parsedCSVRows.paymentCards.push(paymentObj);
        return;
      }
      default: {
        const noteObj = {
          baseDataModel: buildNoteObj(csvRowObj, importSource, parsedHeaders),
          rawData: csvRowObj,
        };
        parsedCSVRows.notes.push(noteObj);
        return;
      }
    }
  }
};
export const itemTypeProcessorForLastPass = (
  csvRowObject: Partial<SupportedVaultItems[keyof SupportedVaultItems]>
) => {
  if (csvRowObject["url"]?.includes(LAST_PASS_SECURE_NOTE_URL)) {
    const splitNoteContent = csvRowObject["extra"].split("\n");
    let noteType = "";
    for (let i = 0; i < splitNoteContent.length; i++) {
      const [key, value] = splitNoteContent[i]
        ? splitNoteContent[i].split(":")
        : [];
      if (key === LPNoteTypeField.NoteType) {
        noteType = value;
      }
    }
    switch (noteType) {
      case LastPassNoteType.BankAccountType:
        return SupportedVaultTypes.BANK_ACCOUNT;
      case LastPassNoteType.PaymentCardType:
        return SupportedVaultTypes.PAYMENT_CARD;
      default:
        return SupportedVaultTypes.NOTE;
    }
  }
  return null;
};
export const fieldProcessorForLastPass = (
  fieldKey: string,
  fieldValue: string
): string => {
  switch (fieldKey) {
    case "fav": {
      if (!fieldValue || fieldValue.includes("0")) {
        return null;
      }
      break;
    }
    case "grouping": {
      if (!fieldValue || fieldValue.includes("(none)")) {
        return null;
      }
      break;
    }
    default:
      break;
  }
  return fieldValue;
};
