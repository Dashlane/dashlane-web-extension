import {
  Country,
  Credential,
  DataToImport,
  ImportSource,
  Note,
  ParsedCSVData,
  SupportedVaultTypes,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { getKeeperImportHeaders } from "./custom-rules/custom-keeper-logic";
import { processAndPushLastPassNote } from "./custom-rules/custom-last-pass-logic";
import {
  areHeadersValid,
  buildBankAccountObj,
  buildCredentialObj,
  buildNoteObj,
  buildPaymentCardObj,
  determineBestItemType,
  getHeadersAndIndexMap,
} from "./utils";
import { ImportDataStructure } from "./types";
import { getNewCollection } from "DataManagement/Collections";
function linkItemtoCollections(
  item: Note | Credential,
  importSource: ImportSource,
  parsedCSVRows: DataToImport
) {
  if (importSource === ImportSource["1Password"]) {
    item.Category = item.Category.replaceAll(";", ",");
  }
  item.Category.split(",").forEach((category) => {
    let matchedCollection = parsedCSVRows.collections.find(
      (collection) => collection.baseDataModel.Name === category
    );
    if (!matchedCollection) {
      matchedCollection = {
        baseDataModel: getNewCollection({
          name: category,
          vaultItems: [],
          spaceId: "",
        }),
        rawData: {},
      };
      parsedCSVRows.collections.push(matchedCollection);
    }
    matchedCollection.baseDataModel.VaultItems.push({
      Id: item.Id,
      Type: item.kwType,
    });
  });
}
function parseAndPushSecureNote(
  rowObject: Record<string, never>,
  importSource: ImportSource,
  parsedHeaders: Map<
    string,
    {
      original: string;
      matched: string;
    }
  >,
  parsedCSVRows: DataToImport
) {
  const noteObj = {
    baseDataModel: buildNoteObj(rowObject, importSource, parsedHeaders),
    rawData: rowObject,
  };
  if (noteObj.baseDataModel.Category) {
    linkItemtoCollections(noteObj.baseDataModel, importSource, parsedCSVRows);
  }
  parsedCSVRows.notes.push(noteObj);
}
function parseAndPushBankAccount(
  importSource: ImportSource,
  rowObject: Record<string, never>,
  parsedCSVRows: DataToImport,
  parsedHeaders: Map<
    string,
    {
      original: string;
      matched: string;
    }
  >
) {
  const bankObj = {
    baseDataModel: buildBankAccountObj(rowObject, importSource, parsedHeaders),
    rawData: rowObject,
  };
  parsedCSVRows.bankAccounts.push(bankObj);
}
function parseAndPushPaymentCard(
  importSource: ImportSource,
  rowObject: Record<string, never>,
  country: Country,
  parsedCSVRows: DataToImport,
  parsedHeaders: Map<
    string,
    {
      original: string;
      matched: string;
    }
  >
) {
  const paymentObj = {
    baseDataModel: buildPaymentCardObj(
      rowObject,
      importSource,
      parsedHeaders,
      country
    ),
    rawData: rowObject,
  };
  parsedCSVRows.paymentCards.push(paymentObj);
}
const defaultOtpAuthUrlPrefix = "otpauth://totp/?secret=";
const otpAuthUrlRegex = /^otpauth:\/\/.*/;
function parseAndPushCredential(
  rowObject: Record<string, never>,
  importSource: ImportSource,
  parsedHeaders: Map<
    string,
    {
      original: string;
      matched: string;
    }
  >,
  country: Country,
  parsedCSVRows: DataToImport
) {
  const credentialObj = {
    baseDataModel: buildCredentialObj(
      rowObject,
      importSource,
      parsedHeaders,
      country
    ),
    rawData: rowObject,
  };
  if (credentialObj.baseDataModel.Category) {
    linkItemtoCollections(
      credentialObj.baseDataModel,
      importSource,
      parsedCSVRows
    );
  }
  if (
    credentialObj.baseDataModel.OtpUrl &&
    !otpAuthUrlRegex.test(credentialObj.baseDataModel.OtpUrl)
  ) {
    credentialObj.baseDataModel.OtpUrl =
      defaultOtpAuthUrlPrefix + credentialObj.baseDataModel.OtpUrl;
  }
  const parsedBaseDataModelUrl = new ParsedURL(credentialObj.baseDataModel.Url);
  if (credentialObj.baseDataModel.Url && parsedBaseDataModelUrl.isUrlValid()) {
    credentialObj.baseDataModel.Url =
      parsedBaseDataModelUrl.getPIIStrippedURL();
  }
  parsedCSVRows.credentials.push(credentialObj);
}
const buildVaultObjectsFromCSV = (
  csvRows: string[][],
  headers: string[],
  importSource: ImportSource,
  country: Country
): ReturnType<typeof parseCSV> => {
  const parsedCSVRows: DataToImport = {
    credentials: [],
    notes: [],
    bankAccounts: [],
    paymentCards: [],
    collections: [],
  };
  const parsedHeaders: Map<string, ParsedCSVData["headers"][number]> =
    new Map();
  for (let i = 0; i < csvRows.length; i++) {
    const rowObject = csvRows[i].reduce((rowObj, field, index) => {
      rowObj[headers[index]] = field;
      return rowObj;
    }, {});
    const itemType = determineBestItemType(rowObject, importSource);
    const matchedHeaders = getHeadersAndIndexMap(headers, itemType);
    const itemParsedHeaders: Map<string, ParsedCSVData["headers"][number]> =
      new Map();
    matchedHeaders.forEach((matchedHeader) => {
      if (
        !parsedHeaders.has(matchedHeader.original) ||
        (!parsedHeaders.get(matchedHeader.original)?.matched &&
          matchedHeader.matched)
      ) {
        parsedHeaders.set(matchedHeader.original, matchedHeader);
      }
      if (matchedHeader.matched) {
        itemParsedHeaders.set(matchedHeader.original, matchedHeader);
      }
    });
    if (
      [
        SupportedVaultTypes.BANK_ACCOUNT,
        SupportedVaultTypes.NOTE,
        SupportedVaultTypes.PAYMENT_CARD,
      ].includes(itemType) &&
      importSource === ImportSource.Lastpass
    ) {
      processAndPushLastPassNote(
        rowObject,
        importSource,
        country,
        parsedCSVRows,
        itemParsedHeaders
      );
      continue;
    }
    switch (itemType) {
      case SupportedVaultTypes.CREDENTIAL: {
        parseAndPushCredential(
          rowObject,
          importSource,
          itemParsedHeaders,
          country,
          parsedCSVRows
        );
        break;
      }
      case SupportedVaultTypes.PAYMENT_CARD: {
        parseAndPushPaymentCard(
          importSource,
          rowObject,
          country,
          parsedCSVRows,
          itemParsedHeaders
        );
        break;
      }
      case SupportedVaultTypes.BANK_ACCOUNT: {
        parseAndPushBankAccount(
          importSource,
          rowObject,
          parsedCSVRows,
          itemParsedHeaders
        );
        break;
      }
      case SupportedVaultTypes.NOTE:
      default: {
        parseAndPushSecureNote(
          rowObject,
          importSource,
          itemParsedHeaders,
          parsedCSVRows
        );
      }
    }
  }
  return { ...parsedCSVRows, headers: [...parsedHeaders.values()] };
};
const parseQuotedCSV = (content: string, csvData: [string[]]) => {
  const re =
    /(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')|,,|,\n/gi;
  let matches;
  while ((matches = re.exec(content.trim()))) {
    const nextCharIndex =
      matches[0] === ",," ? matches.index : matches.index - 1;
    if (matches.input[nextCharIndex] && matches.input[nextCharIndex] !== ",") {
      csvData.push([]);
    }
    if (matches[0] === ",\n") {
      continue;
    }
    csvData[csvData.length - 1].push(
      matches[0]
        .replace(new RegExp(/","/gi), ",")
        .replace(new RegExp(/^"|"$/gi), "")
        .replace(new RegExp(/^,,$/gi), "")
    );
  }
};
const parseNonQuotedCSV = (content: string, csvData: [string[]]) => {
  const re = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi;
  let matches;
  while ((matches = re.exec(content.trim()))) {
    if (matches[1].length && matches[1] !== ",") {
      csvData.push([]);
    }
    csvData[csvData.length - 1].push(
      matches[2] !== undefined
        ? matches[2].replace(new RegExp(`^"|"$|"(?=,")|(?<=",)"|""`, "gi"), '"')
        : matches[3]
    );
  }
};
function parseHeaderAndRows(content: string, importSource: ImportSource) {
  const csvData: [string[]] = [[]];
  if (content.startsWith('"')) {
    parseQuotedCSV(content, csvData);
  } else {
    parseNonQuotedCSV(content, csvData);
  }
  if (importSource === ImportSource.Keeper) {
    const totalColumns = csvData.reduce((max, row) => {
      return Math.max(max, row.length);
    }, 0);
    csvData.unshift(getKeeperImportHeaders(totalColumns));
  }
  const [csvHead, ...csvRows] = csvData;
  return { csvHead: csvHead, csvRows: csvRows };
}
export function parseCSV(
  content: string,
  importSource: ImportSource,
  country: Country
): DataToImport & Pick<ParsedCSVData, "headers"> {
  const emptyData: ReturnType<typeof parseCSV> = {
    credentials: [],
    notes: [],
    paymentCards: [],
    bankAccounts: [],
    headers: [],
    collections: [],
  };
  if (!content) {
    return emptyData;
  }
  const { csvHead, csvRows } = parseHeaderAndRows(content, importSource);
  const lowerCaseHeaders = csvHead.map((header) => header.toLowerCase());
  if (!csvRows.length || !areHeadersValid(lowerCaseHeaders)) {
    return emptyData;
  }
  return buildVaultObjectsFromCSV(
    csvRows,
    lowerCaseHeaders,
    importSource,
    country
  );
}
export const getImportablePersonalData = (
  content: ImportDataStructure,
  country: Country
): ParsedCSVData => {
  const parsedCSVData = parseCSV(content.data, content.importSource, country);
  const { headers, ...items } = parsedCSVData;
  return {
    headers: headers,
    items: Object.values(items).flat(),
  };
};
