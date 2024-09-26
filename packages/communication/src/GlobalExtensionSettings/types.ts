export type ExtensionSettings = {
  interactionDataConsent: boolean | null;
  personalDataConsent: boolean | null;
};
export type RequiredExtensionSettings = {
  [k in keyof ExtensionSettings]: NonNullable<ExtensionSettings[k]>;
};
