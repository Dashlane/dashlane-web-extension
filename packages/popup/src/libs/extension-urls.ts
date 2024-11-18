import { runtimeGetURL } from "@dashlane/webextensions-apis";
export const getLostbackupCodesUrl = (login?: string) =>
  runtimeGetURL(
    login
      ? `/index.html#/recover-2fa-codes?account=${login}`
      : "/index.html#/recover-2fa-codes"
  );
