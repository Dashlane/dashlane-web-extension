import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { BankAccount, Country } from "@dashlane/vault-contracts";
import {
  Field,
  ItemType,
  UserCopyVaultItemFieldEvent,
  UserRevealVaultItemFieldEvent,
} from "@dashlane/hermes";
import {
  ObfuscatedField,
  SelectField,
  SelectOption,
  TextField,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { TranslateFunction } from "../../../../libs/i18n/types";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import {
  LockedItemType,
  ProtectedItemsUnlockerProps,
  UnlockerAction,
} from "../../../unlock-items/types";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../../space-select/space-select";
import { getFieldLabels } from "./getFieldLabels";
import {
  areCountryBanksReady,
  useCountryBanks,
} from "../../hooks/useCountryBanks";
import { ContentCard } from "../../../panel/standard/content-card";
import { CountryField } from "../../../components/fields/country-field";
import { useActivityLogReport } from "../../../hooks/use-activity-log-report";
const I18N_KEYS = {
  FIELD_ACTION_HIDE: "webapp_payment_edition_field_bank_account_action_hide",
  FIELD_ACTION_SHOW: "webapp_payment_edition_field_bank_account_action_show",
  FIELD_ACCOUNT_NAME: "webapp_payment_edition_field_bank_account_name",
  FIELD_ACCOUNT_OWNER_NAME:
    "webapp_payment_edition_field_bank_account_owner_name",
  FIELD_COUNTRY: "webapp_payment_edition_field_bank_account_country",
  FIELD_BANK_NAME: "webapp_payment_edition_field_bank_account_bank_name",
  FIELD_PLACEHOLDER_NO_ACCOUNT_NAME:
    "webapp_payment_edition_field_bank_account_no_name_placeholder",
  FIELD_PLACEHOLDER_NO_OWNER_NAME:
    "webapp_payment_edition_field_bank_account_no_owner_name_placeholder",
  DETAILS_CONTENT_LABEL: "webapp_payment_edition_content_bank_details_label",
  ORGANIZATION_CONTENT_LABEL:
    "webapp_payment_edition_content_bank_organization_label",
};
type BankAccountField = Field.Bic | Field.Iban;
const getCountryOptions = (
  countryList: string[],
  translate: TranslateFunction
) =>
  countryList
    .filter(
      (countryKey) =>
        !(
          Country[countryKey] === Country.UNIVERSAL ||
          Country[countryKey] === Country.NO_TYPE
        )
    )
    .map((countryKey) => {
      return {
        label: translate(`country_name_${Country[countryKey]}`),
        value: Country[countryKey],
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
const getBankOptionFromCode = (
  options: {
    label: string;
    value: string;
  }[],
  code: string
) => options.find(({ value }) => value === code);
export type BankAccountFormFields = Pick<
  BankAccount,
  | "accountName"
  | "bankCode"
  | "BIC"
  | "country"
  | "IBAN"
  | "ownerName"
  | "spaceId"
>;
type BaseProps = {
  bankAccount: BankAccountFormFields;
  errors?: Set<keyof BankAccountFormFields>;
  onValueChanged: (
    newBankAccountContent: Partial<BankAccountFormFields>,
    silent?: boolean
  ) => void;
};
type AddProps = BaseProps & {
  variant: "add";
};
type EditProps = BaseProps & {
  variant: "edit";
  itemId: string;
  onCopy: (message: string) => void;
} & Partial<ProtectedItemsUnlockerProps>;
type Props = AddProps | EditProps;
const BankAccountFormComponent = (
  props: Props,
  ref: React.Ref<HTMLInputElement>
) => {
  const { bankAccount, errors = new Set(), onValueChanged } = props;
  const { bankCode, accountName, IBAN, BIC, ownerName, spaceId, country } =
    bankAccount;
  const hasIBAN = IBAN.length > 0;
  const hasBIC = BIC.length > 0;
  const hasTeamSpaceId = Boolean(spaceId);
  const [shouldShowBIC, setShouldShowBIC] = useState(!hasBIC);
  const [shouldShowIBAN, setShouldShowIBAN] = useState(!hasIBAN);
  const { translate } = useTranslate();
  const { shouldShowFrozenStateDialog: isDisabled } = useFrozenState();
  const {
    logRevealBankAccountField: logTeamAdminRevealBankAccountField,
    logCopiedBankAccountField,
  } = useActivityLogReport();
  const isItemLocked =
    props.variant === "edit" ? !props.areProtectedItemsUnlocked : undefined;
  const translationKeys = getFieldLabels(country);
  const handleContentChanged = useCallback(
    (field: keyof BankAccount) =>
      (
        eventOrValue:
          | React.ChangeEvent<
              HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >
          | string
      ) => {
        const updatedValue =
          typeof eventOrValue === "string"
            ? eventOrValue
            : eventOrValue.target.value;
        onValueChanged({
          [field]: updatedValue,
        });
      },
    [onValueChanged]
  );
  const logRevealBankAccountField =
    props.variant === "edit"
      ? (field: BankAccountField) => {
          logEvent(
            new UserRevealVaultItemFieldEvent({
              field,
              isProtected: true,
              itemId: props.itemId,
              itemType: ItemType.BankStatement,
            })
          );
        }
      : undefined;
  const handleProtectedItemUnlocking =
    props.variant === "edit"
      ? (override: boolean, onSuccess: () => void) =>
          new Promise<void>((resolve, reject) => {
            if (override || props.areProtectedItemsUnlocked) {
              onSuccess();
              return resolve();
            }
            if (
              isItemLocked &&
              typeof props.openProtectedItemsUnlocker === "function"
            ) {
              props.openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.CreditCard,
                successCallback: () => {
                  onSuccess();
                  return resolve();
                },
                cancelCallback: reject,
              });
            }
          })
      : undefined;
  const handleToggleShowBIC = () => {
    if (!shouldShowBIC && logRevealBankAccountField) {
      logRevealBankAccountField(Field.Bic);
      if (hasTeamSpaceId) {
        logTeamAdminRevealBankAccountField({
          name: accountName,
          field: Field.Bic,
          country,
        });
      }
    }
    setShouldShowBIC((oldValue) => !oldValue);
  };
  const handleToggleShowIBAN = () => {
    if (!shouldShowIBAN && logRevealBankAccountField) {
      logRevealBankAccountField(Field.Iban);
      if (hasTeamSpaceId) {
        logTeamAdminRevealBankAccountField({
          name: accountName,
          field: Field.Iban,
          country,
        });
      }
    }
    setShouldShowIBAN((oldValue) => !oldValue);
  };
  const handleCopyBIC =
    props.variant === "edit"
      ? (success: boolean) => {
          logEvent(
            new UserCopyVaultItemFieldEvent({
              itemType: ItemType.BankStatement,
              field: Field.Bic,
              itemId: props.itemId,
              isProtected: true,
            })
          );
          if (hasTeamSpaceId) {
            logCopiedBankAccountField({
              name: accountName,
              field: Field.Bic,
              country,
            });
          }
          if (success) {
            props.onCopy(translate(translationKeys.BIC_COPIED));
          }
        }
      : undefined;
  const handleCopyIBAN =
    props.variant === "edit"
      ? (success: boolean) => {
          logEvent(
            new UserCopyVaultItemFieldEvent({
              itemType: ItemType.BankStatement,
              field: Field.Iban,
              itemId: props.itemId,
              isProtected: true,
            })
          );
          if (hasTeamSpaceId) {
            logCopiedBankAccountField({
              name: accountName,
              field: Field.Iban,
              country,
            });
          }
          if (success) {
            props.onCopy(translate(translationKeys.IBAN_COPIED));
          }
        }
      : undefined;
  const countryBanks = useCountryBanks(country);
  const countryBanksReady = areCountryBanksReady(countryBanks);
  const bankOptions = useMemo(
    () =>
      countryBanks.map((bankItem) => ({
        label: bankItem.localizedString,
        value: `${bankItem.code}`,
      })),
    [countryBanks]
  );
  useEffect(() => {
    if (
      getBankOptionFromCode(bankOptions, bankCode) === undefined &&
      bankOptions.length > 0
    ) {
      onValueChanged(
        {
          bankCode: bankOptions[0].value,
        },
        true
      );
    }
    if (bankCode !== "" && !bankOptions.length && countryBanksReady) {
      onValueChanged({
        bankCode: "",
      });
    }
  }, [bankCode, bankAccount, bankOptions, countryBanksReady, onValueChanged]);
  const countryField = useMemo(() => {
    const countryList = Object.keys(Country);
    return (
      <CountryField
        label={translate(I18N_KEYS.FIELD_COUNTRY)}
        placeholder={translate(I18N_KEYS.FIELD_COUNTRY) + country}
        disabled={!!isDisabled}
        options={getCountryOptions(countryList, translate)}
        value={country}
        onChange={handleContentChanged("country")}
      />
    );
  }, [country, handleContentChanged, isDisabled, translate]);
  const bankSelect = useMemo(
    () =>
      bankOptions.length > 0 ? (
        <SelectField
          key={`${country}bank`}
          label={translate(I18N_KEYS.FIELD_BANK_NAME)}
          placeholder={translate(I18N_KEYS.FIELD_BANK_NAME) + bankCode}
          onChange={handleContentChanged("bankCode")}
          value={bankCode}
          readOnly={!!isDisabled}
        >
          {bankOptions.map((bankOption) => {
            return (
              <SelectOption key={bankOption.value} value={bankOption.value}>
                {bankOption.label}
              </SelectOption>
            );
          })}
        </SelectField>
      ) : null,
    [
      bankCode,
      bankOptions,
      country,
      handleContentChanged,
      isDisabled,
      translate,
    ]
  );
  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ContentCard
        title={translate(I18N_KEYS.DETAILS_CONTENT_LABEL)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextField
          key="owner"
          value={ownerName}
          label={translate(I18N_KEYS.FIELD_ACCOUNT_OWNER_NAME)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_OWNER_NAME)}
          onChange={handleContentChanged("ownerName")}
          disabled={!!isDisabled}
          ref={ref}
        />
        <ObfuscatedField
          key="IBAN"
          required
          label={translate(translationKeys.IBAN)}
          placeholder={translate(translationKeys.IBAN_PLACEHOLDER)}
          data-name="IBAN"
          readOnly={(!shouldShowIBAN && hasIBAN) || !!isDisabled}
          isValueInitiallyVisible={shouldShowIBAN}
          toggleVisibilityLabel={{
            hide: translate(I18N_KEYS.FIELD_ACTION_HIDE),
            show: translate(I18N_KEYS.FIELD_ACTION_SHOW),
          }}
          onValueVisibilityChangeRequest={
            handleProtectedItemUnlocking
              ? () =>
                  handleProtectedItemUnlocking?.(
                    shouldShowIBAN,
                    handleToggleShowIBAN
                  )
              : undefined
          }
          actions={
            handleCopyIBAN && isItemLocked !== undefined
              ? [
                  <CopyToClipboardButton
                    key="copy-iban"
                    data={IBAN}
                    checkProtected={() => isItemLocked}
                    onCopy={handleCopyIBAN}
                    itemType={LockedItemType.BankAccount}
                  />,
                ]
              : undefined
          }
          value={shouldShowIBAN ? IBAN : "●●●●●●●●●●●●●●●●"}
          onChange={handleContentChanged("IBAN")}
          error={errors.has("IBAN")}
        />
        <ObfuscatedField
          key="BIC"
          readOnly={(!shouldShowBIC && hasBIC) || !!isDisabled}
          value={shouldShowBIC ? BIC : "●●●●●●"}
          label={translate(translationKeys.BIC)}
          placeholder={translate(translationKeys.BIC_PLACEHOLDER)}
          isValueInitiallyVisible={shouldShowBIC}
          toggleVisibilityLabel={{
            hide: translate(I18N_KEYS.FIELD_ACTION_HIDE),
            show: translate(I18N_KEYS.FIELD_ACTION_SHOW),
          }}
          onValueVisibilityChangeRequest={
            handleProtectedItemUnlocking
              ? () =>
                  handleProtectedItemUnlocking?.(
                    shouldShowBIC,
                    handleToggleShowBIC
                  )
              : undefined
          }
          actions={
            handleCopyBIC && isItemLocked !== undefined
              ? [
                  <CopyToClipboardButton
                    key="copy-bic"
                    data={BIC}
                    checkProtected={() => isItemLocked}
                    onCopy={handleCopyBIC}
                    itemType={LockedItemType.BankAccount}
                  />,
                ]
              : undefined
          }
          onChange={handleContentChanged("BIC")}
          error={errors.has("BIC")}
        />
        {countryField}
        {bankSelect}
      </ContentCard>

      <ContentCard
        title={translate(I18N_KEYS.ORGANIZATION_CONTENT_LABEL)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextField
          key="name"
          value={accountName}
          label={translate(I18N_KEYS.FIELD_ACCOUNT_NAME)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_ACCOUNT_NAME)}
          onChange={handleContentChanged("accountName")}
          disabled={!!isDisabled}
        />
        <SpaceSelect
          isUsingNewDesign
          spaceId={spaceId ?? ""}
          labelSx={spaceSelectFormLabelSx}
          onChange={(newSpaceId) => handleContentChanged("spaceId")(newSpaceId)}
          disabled={!!isDisabled}
        />
      </ContentCard>
    </div>
  );
};
export const BankAccountForm = forwardRef<HTMLInputElement, Props>(
  BankAccountFormComponent
);
