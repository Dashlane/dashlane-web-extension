import {
  AddSecureNoteRequest,
  BankAccount,
  Country,
  Credential,
  ImportSource,
  isCredential,
  isNote,
  isPaymentCard,
  LinkedWebsiteSource,
  NoteTypes,
  ParsedCSVData,
  PaymentCard,
  Note as SecureNote,
  SupportedVaultItems,
  SupportedVaultTypes,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { createBaseCredentialModel } from "DataManagement/Credentials/services/createCredential";
import { getUrlFields } from "DataManagement/Credentials/services/helpers";
import { getNewPaymentCard } from "DataManagement/PaymentCards";
import { getNewBankAccount } from "DataManagement/BankAccounts/handlers";
import {
  FieldToIndexMap,
  HEADER_MAPPINGS,
  TYPE_HEADERS,
  TYPE_MAPPINGS,
} from "./types";
import { getItemTypeProcessor } from "./custom-rules/custom-item-type-processors";
import {
  FieldLevelProcessorFunction,
  getFieldLevelProcessor,
} from "./custom-rules/custom-field-processors";
import { parseCustomKeeperCredentialData } from "./custom-rules/custom-keeper-logic";
import { generateItemUuid } from "Utils/generateItemUuid";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
const noteFormatter = (newSecureNoteData: AddSecureNoteRequest): SecureNote => {
  const newSecureNoteSanitized = sanitizeInputPersonalData(newSecureNoteData);
  const secureNoteCreationDate = getUnixTimestamp();
  const secureNote: SecureNote = {
    kwType: "KWSecureNote",
    CreationDatetime: secureNoteCreationDate,
    Id: generateItemUuid(),
    LocaleFormat: Country.US,
    SpaceId: newSecureNoteSanitized.spaceId || "",
    UserModificationDatetime: secureNoteCreationDate,
    LastBackupTime: 0,
    Title: newSecureNoteSanitized.title || "Untitled note",
    Content: newSecureNoteSanitized.content || "",
    Secured: newSecureNoteSanitized.secured || false,
    Type: newSecureNoteSanitized.type || "GRAY",
    Attachments: newSecureNoteSanitized.attachments || [],
  };
  return secureNote;
};
const cleanVaultItemData = (
  vaultObject: SupportedVaultItems[keyof SupportedVaultItems],
  supportedKeys: string[]
) => {
  for (const key in vaultObject) {
    if (!supportedKeys.includes(key)) {
      delete vaultObject[key];
    }
  }
};
export const buildNoteContent = (
  vaultItem: SupportedVaultItems[keyof SupportedVaultItems],
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>,
  rawRowObj: Record<string, unknown>,
  supportedKeys: string[],
  fieldProcessor: ReturnType<typeof getFieldLevelProcessor>
) => {
  let noteContent = "";
  if (isCredential(vaultItem)) {
    noteContent = vaultItem.Note ?? "";
  } else if (isNote(vaultItem)) {
    if (vaultItem["Note"]) {
      vaultItem.Content = vaultItem["Note"];
      delete vaultItem["Note"];
    }
    noteContent = vaultItem.Content;
  } else if (isPaymentCard(vaultItem)) {
    noteContent = vaultItem.CCNote;
  } else {
    return;
  }
  const hasInitialNoteContent = !!noteContent;
  let hasAppendedContent = false;
  const combinedItem = { ...vaultItem, ...rawRowObj };
  for (const key in combinedItem) {
    if (
      !supportedKeys.includes(key) &&
      !parsedHeaders.get(key)?.matched &&
      combinedItem[key]
    ) {
      const processedValue = fieldProcessor
        ? fieldProcessor(key.toLocaleLowerCase(), combinedItem[key])
        : combinedItem[key];
      if (processedValue) {
        const newLineSeparator =
          hasInitialNoteContent && !hasAppendedContent ? `\n\n\n` : `\n`;
        noteContent += `${newLineSeparator}${key}: ${combinedItem[key]}`;
        hasAppendedContent = true;
      }
    }
  }
  noteContent = noteContent.trim();
  if (isCredential(vaultItem)) {
    vaultItem.Note = noteContent;
  } else if (isNote(vaultItem)) {
    vaultItem.Content = noteContent;
  } else if (isPaymentCard(vaultItem)) {
    vaultItem.CCNote = noteContent;
  }
};
export const formatCredentialData = (credential: Partial<Credential>) => {
  let defaultUrl = credential.Url?.trim() ?? "";
  const splitUrl = credential.Url?.split(",") ?? [""];
  if (
    splitUrl.length > 1 &&
    new ParsedURL(splitUrl[0]).isUrlValid() &&
    splitUrl
      .slice(1)
      .some((splitString) => new ParsedURL(splitString).isUrlValid())
  ) {
    const [primaryUrl, ...additionalUrls] = credential.Url?.split(",") ?? [];
    defaultUrl = primaryUrl.trim();
    credential.LinkedServices = {
      associated_domains: [],
    };
    additionalUrls.forEach((url) => {
      const parsedUrl = new ParsedURL(url.trim());
      if (parsedUrl.isUrlValid()) {
        credential.LinkedServices?.associated_domains.push({
          domain: parsedUrl.getPIIStrippedURL(),
          source: LinkedWebsiteSource.Manual,
        });
      }
    });
  }
  const parsedDefaultUrl = new ParsedURL(defaultUrl);
  credential.Url = !parsedDefaultUrl.isUrlValid() ? "" : defaultUrl;
  const parsedCredentialTitle = new ParsedURL(credential.Title?.trim());
  if (
    !credential.Title ||
    (parsedCredentialTitle.isUrlValid({ requireEtld: true }) &&
      parsedCredentialTitle.getRootDomain() ===
        parsedDefaultUrl.getRootDomain())
  ) {
    credential.Title = parsedDefaultUrl.getRootDomain() ?? "";
  }
};
export const constructCredentialContent = (
  credential: Partial<Credential>,
  country?: Country,
  spaceId?: string
): Credential => {
  return {
    Title: "",
    Email: "",
    Login: "",
    Password: "",
    Note: "",
    ...credential,
    ...createBaseCredentialModel(country),
    ...getUrlFields(credential.Url ?? "", true),
    SpaceId: spaceId ?? "",
    SubdomainOnly: false,
    SecondaryLogin: "",
    Category: "",
    AutoLogin: true,
    AutoProtected: false,
    Strength: 0,
  };
};
export const constructSecureNote = (
  note: Partial<SecureNote>,
  spaceId?: string
): SecureNote => {
  return noteFormatter({
    content: note.Content || "",
    title: note.Title || "",
    secured: false,
    type: NoteTypes[0],
    spaceId: spaceId || "",
  });
};
export const constructPaymentCard = (
  paymentCard: Partial<PaymentCard>,
  spaceId?: string
): PaymentCard => {
  return getNewPaymentCard({
    ownerName: paymentCard.OwnerName ?? "",
    cardName: paymentCard.Name ?? "",
    cardNumber: paymentCard.CardNumber ?? "",
    securityCode: paymentCard.SecurityCode ?? "",
    expireMonth: paymentCard.ExpireMonth ?? "",
    expireYear: paymentCard.ExpireYear ?? "",
    ...paymentCard,
    spaceId: spaceId,
  });
};
export const constructBankAccount = (
  bankAccount: Partial<BankAccount>,
  country: Country,
  spaceId?: string
): BankAccount => {
  return getNewBankAccount({
    name: bankAccount.BankAccountName ?? "",
    owner: bankAccount.BankAccountOwner ?? "",
    IBAN: bankAccount.BankAccountIBAN ?? "",
    BIC: bankAccount.BankAccountBIC ?? "",
    bank: bankAccount.BankAccountBank ?? "",
    country: country,
    ...bankAccount,
    spaceId: spaceId ?? "",
  });
};
const buildFieldIndexMap = (
  fieldHeaders: string[],
  headers: Record<string, Set<string>>
): FieldToIndexMap => {
  const supportedFields = Object.keys(headers);
  const fieldToIndexMap: FieldToIndexMap = {};
  fieldHeaders.forEach((fieldHeader, index) => {
    const supportedField = supportedFields.find((field) =>
      headers[field].has(fieldHeader)
    );
    fieldToIndexMap[supportedField ?? fieldHeader] = {
      supported: !!supportedField,
      index: index,
    };
  });
  return fieldToIndexMap;
};
export const reduceVaultObj = (
  rawRowObj: Record<string, unknown>,
  constructionMethod: (
    obj: Partial<SupportedVaultItems[keyof SupportedVaultItems]>,
    country?: Country
  ) => SupportedVaultItems[keyof SupportedVaultItems],
  fieldProcessor: FieldLevelProcessorFunction,
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>,
  country?: Country
) => {
  const vaultObject = Object.entries(rawRowObj).reduce(
    (objectData, [fieldKey, fieldValue]) => {
      const matchedFieldKey = parsedHeaders.get(fieldKey)?.matched;
      if (parsedHeaders.has(fieldKey) && matchedFieldKey) {
        objectData[matchedFieldKey] = fieldProcessor
          ? fieldProcessor(
              fieldKey,
              typeof fieldValue === "string" ? fieldValue : ""
            )
          : fieldValue;
      }
      return objectData;
    },
    constructionMethod({}, country)
  );
  return vaultObject;
};
export const buildNoteObj = (
  rawRowObj: Record<string, unknown>,
  importSource: ImportSource,
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>
) => {
  const emptyNoteObject: Record<keyof SecureNote, unknown> = {
    Title: "",
    Content: "",
    Category: "",
    Secured: "",
    Type: "",
    LocaleFormat: "",
    SpaceId: "",
    kwType: "",
    Id: "",
    LastBackupTime: "",
    CreationDate: "",
    UpdateDate: "",
    limitedPermissions: "",
    CreationDatetime: "",
    UserModificationDatetime: "",
    LastUse: "",
    Attachments: "",
  };
  const noteKeys = Object.keys(emptyNoteObject);
  const fieldProcessor = getFieldLevelProcessor(importSource);
  const noteObj: SecureNote = reduceVaultObj(
    rawRowObj,
    constructSecureNote,
    fieldProcessor,
    parsedHeaders
  ) as SecureNote;
  buildNoteContent(noteObj, parsedHeaders, rawRowObj, noteKeys, fieldProcessor);
  cleanVaultItemData(noteObj, noteKeys);
  return noteObj;
};
export const buildPaymentCardObj = (
  rawRowObj: Record<string, unknown>,
  importSource: ImportSource,
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>,
  country: Country
) => {
  const emptyPaymentCard: Record<keyof PaymentCard, unknown> = {
    Name: "",
    CardNumber: "",
    CardNumberLastDigits: "",
    OwnerName: "",
    SecurityCode: "",
    ExpireMonth: "",
    ExpireYear: "",
    StartMonth: "",
    StartYear: "",
    IssueNumber: "",
    Color: "",
    Bank: "",
    CCNote: "",
    Type: "",
    LocaleFormat: "",
    SpaceId: "",
    kwType: "",
    Id: "",
    LastBackupTime: "",
    CreationDatetime: "",
    UserModificationDatetime: "",
    LastUse: "",
    Attachments: "",
  };
  const paymentCardKeys = Object.keys(emptyPaymentCard);
  const fieldProcessor = getFieldLevelProcessor(importSource);
  const paymentCardObj: PaymentCard = reduceVaultObj(
    rawRowObj,
    constructPaymentCard,
    fieldProcessor,
    parsedHeaders,
    country
  ) as PaymentCard;
  buildNoteContent(
    paymentCardObj,
    parsedHeaders,
    rawRowObj,
    paymentCardKeys,
    fieldProcessor
  );
  cleanVaultItemData(paymentCardObj, paymentCardKeys);
  return paymentCardObj;
};
export const buildBankAccountObj = (
  rawRowObj: Record<string, unknown>,
  importSource: ImportSource,
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>
) => {
  const emptyBankAccount: Record<keyof BankAccount, unknown> = {
    BankAccountName: "",
    BankAccountOwner: "",
    BankAccountIBAN: "",
    BankAccountBIC: "",
    BankAccountBank: "",
    LocaleFormat: "",
    SpaceId: "",
    kwType: "",
    Id: "",
    LastBackupTime: "",
    CreationDatetime: "",
    UserModificationDatetime: "",
    LastUse: "",
    Attachments: "",
  };
  const bankAccountKeys = Object.keys(emptyBankAccount);
  const fieldProcessor = getFieldLevelProcessor(importSource);
  const bankAccountObj: BankAccount = reduceVaultObj(
    rawRowObj,
    constructBankAccount,
    fieldProcessor,
    parsedHeaders
  ) as BankAccount;
  cleanVaultItemData(bankAccountObj, bankAccountKeys);
  return bankAccountObj;
};
export const buildCredentialObj = (
  rawRowObj: Record<string, unknown>,
  importSource: ImportSource,
  parsedHeaders: Map<string, ParsedCSVData["headers"][number]>,
  country: Country
) => {
  const emptyCredential: Record<keyof Credential, unknown> = {
    Title: "",
    Email: "",
    Login: "",
    SecondaryLogin: "",
    Password: "",
    Strength: "",
    Category: "",
    Url: "",
    UseFixedUrl: "",
    TrustedUrlGroup: "",
    LocaleFormat: "",
    SpaceId: "",
    kwType: "",
    Id: "",
    LastBackupTime: "",
    CreationDatetime: "",
    LastUse: "",
    Note: "",
    SubdomainOnly: "",
    AutoLogin: "",
    AutoProtected: "",
    OtpSecret: "",
    UserSelectedUrl: "",
    Checked: "",
    Status: "",
    SharedObject: "",
    ModificationDatetime: "",
    NumberUse: "",
    Type: "",
    Server: "",
    Port: "",
    Alias: "",
    SID: "",
    ConnectionOptions: "",
    domainIcon: "",
    limitedPermissions: "",
    LinkedServices: "",
    UserModificationDatetime: "",
    Attachments: "",
    OtpUrl: "",
  };
  const credentialKeys = Object.keys(emptyCredential);
  const fieldProcessor = getFieldLevelProcessor(importSource);
  const credentialObj: Credential = reduceVaultObj(
    rawRowObj,
    constructCredentialContent,
    fieldProcessor,
    parsedHeaders,
    country
  ) as Credential;
  switch (importSource) {
    case ImportSource.Keeper: {
      parseCustomKeeperCredentialData(rawRowObj, credentialObj);
      break;
    }
    default:
      break;
  }
  buildNoteContent(
    credentialObj,
    parsedHeaders,
    rawRowObj,
    credentialKeys,
    fieldProcessor
  );
  cleanVaultItemData(credentialObj, credentialKeys);
  formatCredentialData(credentialObj);
  return credentialObj;
};
export const getHeadersAndIndexMap = (
  headers: string[],
  itemType: SupportedVaultTypes
) => {
  const fieldToIndexMap = buildFieldIndexMap(
    headers,
    HEADER_MAPPINGS[itemType]
  );
  const indexAndValueMap = Object.entries(fieldToIndexMap).reduce(
    (map, [key, value]) => ({
      ...map,
      [value.index]: value.supported ? key : "",
    }),
    {}
  );
  const matchedHeaders = headers.map((header, index) => ({
    original: header,
    matched: indexAndValueMap[index] ?? "",
  }));
  return matchedHeaders;
};
export const determineBestItemType = (
  csvRowObj: Partial<SupportedVaultItems[keyof SupportedVaultItems]>,
  importSource: ImportSource
): SupportedVaultTypes => {
  let itemType = null;
  const itemTypeProcessor = getItemTypeProcessor(importSource);
  if (itemTypeProcessor) {
    const processedType = itemTypeProcessor(csvRowObj);
    itemType = processedType;
  }
  if (!itemType) {
    for (const objKey in csvRowObj) {
      if (TYPE_HEADERS.has(objKey)) {
        itemType = Object.keys(TYPE_MAPPINGS).find((typeKey) =>
          TYPE_MAPPINGS[typeKey]?.includes(
            csvRowObj[objKey].toLocaleLowerCase()
          )
        ) as SupportedVaultTypes;
        if (itemType) {
          break;
        }
      }
    }
    if (!itemType) {
      const csvObjKeys = Object.keys(csvRowObj).map((k) =>
        k.toLocaleLowerCase()
      );
      const keyFoundCounts = {};
      Object.entries(HEADER_MAPPINGS).forEach(([vaultItemType, headerMap]) => {
        Object.values(headerMap).forEach((keySet) => {
          keyFoundCounts[vaultItemType] =
            (keyFoundCounts[vaultItemType] || 0) +
            [...keySet].filter((k) => csvObjKeys.includes(k) && csvRowObj[k])
              .length;
        });
      });
      const highestCountVaultItemType = Object.keys(keyFoundCounts).reduce(
        (a, b) => (keyFoundCounts[a] > keyFoundCounts[b] ? a : b)
      );
      itemType = highestCountVaultItemType as SupportedVaultTypes;
    }
  }
  return !itemType ? SupportedVaultTypes.NOTE : itemType;
};
export const areHeadersValid = (headers: string[]) => {
  if (!headers.length) {
    return false;
  }
  const headerSets = Object.values(HEADER_MAPPINGS);
  const knownHeaders = Object.values(headerSets).reduce(
    (headersArray, headerSet) => {
      return [
        ...headersArray,
        ...Object.values(headerSet).map((set) => Array.from(set)),
      ];
    },
    []
  );
  return knownHeaders.flat().some((header) => headers.includes(header));
};
