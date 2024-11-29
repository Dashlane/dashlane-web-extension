import { ImportSource as ImportSourceTypes } from "@dashlane/communication";
export const SupportedDirectImportSources = [ImportSourceTypes.Lastpass];
export enum DirectImportSlug {
  LastPass = "lastpass",
}
export const SourceToDirectImportRoute: Record<
  ImportSourceTypes,
  DirectImportSlug | string
> = {
  [ImportSourceTypes["1Password"]]: "",
  [ImportSourceTypes["Bitwarden"]]: "",
  [ImportSourceTypes["Chrome"]]: "",
  [ImportSourceTypes["Dash"]]: "",
  [ImportSourceTypes["Edge"]]: "",
  [ImportSourceTypes["Firefox"]]: "",
  [ImportSourceTypes["Keepass"]]: "",
  [ImportSourceTypes["Keeper"]]: "",
  [ImportSourceTypes["Lastpass"]]: DirectImportSlug.LastPass,
  [ImportSourceTypes["Other"]]: "",
  [ImportSourceTypes["Safari"]]: "",
};
