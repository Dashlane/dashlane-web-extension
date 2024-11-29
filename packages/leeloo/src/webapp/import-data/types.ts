import { ImportSource as LoggingImportSource } from "@dashlane/hermes";
import { ImportSource } from "@dashlane/communication";
export enum ImportFormat {
  DASH = "DASH",
  CSV = "CSV",
  DIRECT = "DIRECT",
}
export const ImportSourcesToLogSources: Record<
  ImportSource,
  LoggingImportSource
> = {
  "1password": LoggingImportSource.Source1password,
  bitwarden: LoggingImportSource.SourceBitwarden,
  chrome: LoggingImportSource.SourceChrome,
  dash: LoggingImportSource.SourceDash,
  edge: LoggingImportSource.SourceEdge,
  firefox: LoggingImportSource.SourceFirefox,
  keepass: LoggingImportSource.SourceKeepass,
  keeper: LoggingImportSource.SourceKeeper,
  lastpass: LoggingImportSource.SourceLastpass,
  other: LoggingImportSource.SourceOther,
  safari: LoggingImportSource.SourceSafari,
};
export enum ImportMethod {
  DIRECT = "direct",
  FILE = "file",
}
export interface ImportLocationState {
  userNavigatedAway?: boolean;
}
