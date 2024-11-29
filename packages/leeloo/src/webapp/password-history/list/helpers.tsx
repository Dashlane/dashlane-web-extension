import { fromUnixTime } from "date-fns";
import {
  CredentialPasswordHistoryItemView,
  PasswordHistoryFilterCriterium,
  PasswordHistoryFilterField,
  PasswordHistoryItemType,
  PasswordHistoryItemView,
  PasswordHistorySortField,
  SortDirection,
} from "@dashlane/communication";
import {
  CarbonEndpointResult,
  DataStatus,
} from "@dashlane/carbon-api-consumers";
import { Permission } from "@dashlane/sharing-contracts";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import LocalizedTimeAgo from "../../../libs/i18n/localizedTimeAgo";
import { TranslatorInterface } from "../../../libs/i18n/types";
import { SortingOptions } from "../../list-view/types";
import { RowDataProps } from "../../list-view/row";
import { PasswordHistoryItemTitle } from "./list-item/password-history-item-title";
import { PasswordHistoryItemPassword } from "./list-item/password-history-item-password";
import { PasswordHistoryRowActions } from "./row-actions";
import { PasswordCopyHandlerParams } from "../types";
import styles from "../styles.css";
const I18N_KEYS = {
  ROW_DATE: "webapp_password_history_column_label_date",
  ROW_NAME: "webapp_password_history_column_label_name",
  ROW_PASSWORD: "webapp_password_history_column_label_password",
};
export enum PasswordHistoryFilter {
  All = "all",
  Saved = "saved",
  Unsaved = "unsaved",
}
export const formatPasswordHistoryItem = (
  item: PasswordHistoryItemView,
  onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void,
  isProtected: boolean,
  onCreateNewCredential: (generatedPassword: string, website?: string) => void,
  onOpenRestorePasswordDialog: (
    newSelectedItem: CredentialPasswordHistoryItemView
  ) => void,
  sharingStatus: {
    isShared: boolean;
    permission?: Permission;
  }
): RowDataProps => {
  return {
    renderers: {
      primaryInfo: () => (
        <PasswordHistoryItemTitle
          item={item}
          onCreateNewCredential={onCreateNewCredential}
          isShared={sharingStatus.isShared}
        />
      ),
      password: () => (
        <PasswordHistoryItemPassword item={item} isProtected={isProtected} />
      ),
      timestamp: () => (
        <IntelligentTooltipOnOverflow>
          <LocalizedTimeAgo date={fromUnixTime(item.timestamp)} />
        </IntelligentTooltipOnOverflow>
      ),
    },
    data: [
      { key: "primaryInfo", className: styles.itemNameColumn },
      { key: "password", className: styles.passwordColumn },
      { key: "timestamp", className: styles.dateColumn },
    ],
    actions: (
      <PasswordHistoryRowActions
        item={item}
        onPasswordCopied={onPasswordCopied}
        onOpenRestorePasswordDialog={onOpenRestorePasswordDialog}
        isProtected={isProtected}
        sharingStatus={sharingStatus}
      />
    ),
  };
};
export const getHeader = (translate: TranslatorInterface) => {
  return [
    {
      key: "primaryInfo",
      sortable: true,
      content: translate(I18N_KEYS.ROW_NAME),
      className: styles.itemNameColumn,
    },
    {
      key: "password",
      sortable: false,
      content: translate(I18N_KEYS.ROW_PASSWORD),
      className: styles.passwordColumn,
    },
    {
      key: "timestamp",
      sortable: true,
      content: translate(I18N_KEYS.ROW_DATE),
      className: styles.dateColumn,
    },
  ];
};
export const getFilterCriteria = (
  filter: PasswordHistoryFilter,
  searchValue: string,
  deepLinkCredentialId?: string
): PasswordHistoryFilterCriterium[] | undefined => {
  const filterCriterium: PasswordHistoryFilterCriterium[] = [];
  if (filter !== PasswordHistoryFilter.All) {
    filterCriterium.push({
      field: "type" as PasswordHistoryFilterField,
      value:
        filter === PasswordHistoryFilter.Saved
          ? PasswordHistoryItemType.Credential
          : PasswordHistoryItemType.Generated,
      type: "equals",
    });
  }
  if (deepLinkCredentialId) {
    filterCriterium.push({
      field: "credentialId",
      type: "equals",
      value: `{${deepLinkCredentialId}}`,
    });
  }
  if (searchValue) {
    filterCriterium.push({
      value: searchValue,
      type: "matches",
    });
  }
  return filterCriterium;
};
export const getSortCriteriaFromSortingOptions = (
  sortingOptions: SortingOptions
): {
  field: PasswordHistorySortField;
  direction: SortDirection;
}[] => {
  return [
    {
      field: sortingOptions.field as PasswordHistorySortField,
      direction:
        sortingOptions.direction === "ascending" ? "ascend" : "descend",
    },
  ];
};
export const isItemPasswordProtected = (
  item: PasswordHistoryItemView,
  mpSettingsResponse: CarbonEndpointResult<boolean>
) => {
  if (mpSettingsResponse.status !== DataStatus.Success) {
    if (item.type === PasswordHistoryItemType.Credential) {
      return item.isProtected;
    }
    return true;
  }
  const globallyRequireMP = mpSettingsResponse.data;
  if (item.type === PasswordHistoryItemType.Credential) {
    return item.isProtected || globallyRequireMP;
  }
  return globallyRequireMP;
};
