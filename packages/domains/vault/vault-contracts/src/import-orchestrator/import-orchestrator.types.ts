export enum ImportSteps {
  NOT_STARTED = "not_started",
  ITEM_RETRIEVAL = "item_retrieval",
  PROCESSING = "processing",
  PREVIEW = "preview",
  IMPORTING = "importing",
  COMPLETED = "completed",
}
export enum ImportSources {
  BITWARDEN_CSV = "bitwarden_csv",
  DASHLANE_DASH = "dashlane_dash",
  LASTPASS_DIRECT = "lastpass_direct",
  CHROME_CSV = "chrome_csv",
  EDGE_CSV = "edge_csv",
  FIREFOX_CSV = "firefox_csv",
  KEEPASS_CSV = "keepass_csv",
  KEEPER_CSV = "keeper_csv",
  LASTPASS_CSV = "lastpass_csv",
  OTHER_CSV = "other_csv",
  SAFARI_CSV = "safari_csv",
}
export type ImportSummary = {
  duplicatedCredentials: number;
  importedCredentials: number;
  totalCredentials: number;
};
export type DecryptionSettings = {
  password?: string;
  userName?: string;
};
export type PreviewHeader = {
  original: string;
  matched: string;
};
export type PreviewItem = {
  id: string;
  rawItem: Record<string, string>;
  shouldBeImported: boolean;
  type: string;
  item: string;
};
export type ImportState =
  | {
      step: ImportSteps.NOT_STARTED;
    }
  | {
      step: ImportSteps.ITEM_RETRIEVAL;
      importSource?: ImportSources;
      rawData?: string;
    }
  | {
      step: ImportSteps.PROCESSING;
      importSource: ImportSources;
      rawData: string;
      decryptionSettings?: DecryptionSettings;
    }
  | {
      step: ImportSteps.PREVIEW | ImportSteps.IMPORTING;
      importSource: ImportSources;
      previewItems: Record<string, PreviewItem>;
      previewHeaders: PreviewHeader[];
      defaultSpace?: string;
    }
  | {
      step: ImportSteps.COMPLETED;
      importSource: ImportSources;
      importSummary: ImportSummary;
    };
