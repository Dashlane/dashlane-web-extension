import { Credential } from "@dashlane/communication";
export const getKeeperImportHeaders = (totalColumns: number): string[] => {
  const keeperHeaders = [
    "Folder",
    "Title",
    "Login",
    "Password",
    "Website Address",
    "Notes",
    "Shared Folder",
  ];
  const customColumnCount = Math.max(0, totalColumns - keeperHeaders.length);
  if (customColumnCount) {
    keeperHeaders.push(
      ...[...Array(customColumnCount).keys()].map((_, i) => `Custom ${i + 1}`)
    );
  }
  return keeperHeaders;
};
export const parseCustomKeeperCredentialData = (
  rawRowObj: Record<string, unknown>,
  credential: Credential
) => {
  Object.keys(rawRowObj).forEach((key) => {
    const otpUrlValue = rawRowObj[key];
    if (otpUrlValue === "TFC:Keeper") {
      delete rawRowObj[key];
    } else if (
      typeof otpUrlValue === "string" &&
      otpUrlValue.startsWith("otpauth://")
    ) {
      credential.OtpUrl = otpUrlValue;
      delete rawRowObj[key];
    }
  });
};
