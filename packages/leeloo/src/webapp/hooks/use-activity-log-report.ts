import { Country } from "@dashlane/communication";
import { useFeatureFlip, useModuleCommands } from "@dashlane/framework-react";
import { Field } from "@dashlane/hermes";
import {
  ActivityLogFeatureFlips,
  activityLogsApi,
  CreditCardField,
} from "@dashlane/risk-monitoring-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { useCallback } from "react";
import { getBankFieldByCountry } from "../payments/bank-accounts/bank-field/get-bank-field-by-country";
import {
  createCopiedBankAccountFieldLog,
  createCopiedCredentialFieldLog,
  createCopiedCreditCardFieldLog,
  createCopiedSecretContentLog,
  createCopiedSecureNoteContentLog,
  createRevealedBankAccountFieldLog,
  createRevealedCredentialFieldLog,
  createRevealedCreditCardFieldLog,
  createRevealedSecretContentLog,
  createRevealedSecureNoteContentLog,
} from "./activity-log-creators";
export function useActivityLogReport() {
  const { storeActivityLogs } = useModuleCommands(activityLogsApi);
  const hasProtectedItemRevealedEnabled = useFeatureFlip(
    ActivityLogFeatureFlips.SharingVaultTacAuditLogsProtectedItemRevealed
  );
  const logRevealCredentialField = useCallback(
    async ({
      credentialURL,
      credentialLogin,
    }: {
      credentialURL: string;
      credentialLogin: string;
    }) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const credentialDomain = new ParsedURL(credentialURL).getRootDomain();
      const log = createRevealedCredentialFieldLog({
        field: "password",
        credential_domain: credentialDomain,
        credential_login: credentialLogin,
      });
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logRevealCreditCardField = useCallback(
    async ({ name, field }: { name: string; field: CreditCardField }) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const log = createRevealedCreditCardFieldLog({
        field,
        name,
      });
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logRevealBankAccountField = useCallback(
    async ({
      name,
      field,
      country,
    }: {
      name: string;
      field: Field;
      country: Country;
    }) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const bankField = getBankFieldByCountry(field, country);
      if (bankField) {
        const log = createRevealedBankAccountFieldLog({
          field: bankField,
          name,
        });
        await storeActivityLogs({
          activityLogs: [log],
        });
      }
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logRevealSecretContent = useCallback(
    async (name: string) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const log = createRevealedSecretContentLog(name);
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logRevealSecureNoteContent = useCallback(
    async (name: string) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const log = createRevealedSecureNoteContentLog(name);
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logCopiedCredentialField = useCallback(
    async ({
      credentialLogin,
      credentialURL,
    }: {
      credentialLogin: string;
      credentialURL: string;
    }) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const credentialDomain = new ParsedURL(credentialURL).getRootDomain();
      const log = createCopiedCredentialFieldLog({
        field: "password",
        credential_domain: credentialDomain,
        credential_login: credentialLogin,
      });
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logCopiedCreditCardField = useCallback(
    async ({ name, field }: { name: string; field: CreditCardField }) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const log = createCopiedCreditCardFieldLog({
        field,
        name,
      });
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logCopiedBankAccountField = useCallback(
    async ({
      name,
      field,
      country,
    }: {
      name: string;
      field: Field;
      country: Country;
    }) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const bankField = getBankFieldByCountry(field, country);
      if (bankField) {
        const log = createCopiedBankAccountFieldLog({
          field: bankField,
          name,
        });
        await storeActivityLogs({
          activityLogs: [log],
        });
      }
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logCopiedSecretContent = useCallback(
    async (name: string) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const log = createCopiedSecretContentLog(name);
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  const logCopiedSecureNoteContent = useCallback(
    async (name: string) => {
      if (!hasProtectedItemRevealedEnabled) {
        return;
      }
      const log = createCopiedSecureNoteContentLog(name);
      await storeActivityLogs({
        activityLogs: [log],
      });
    },
    [hasProtectedItemRevealedEnabled, storeActivityLogs]
  );
  return {
    logRevealCredentialField,
    logRevealCreditCardField,
    logRevealBankAccountField,
    logRevealSecretContent,
    logRevealSecureNoteContent,
    logCopiedCredentialField,
    logCopiedCreditCardField,
    logCopiedBankAccountField,
    logCopiedSecretContent,
    logCopiedSecureNoteContent,
  };
}
