import { CancellationStatus } from "@dashlane/team-admin-contracts";
import { TranslateFunction } from "../../../libs/i18n/types";
const I18N_KEYS = {
  NEED_A_CHANGE_HEADER: "account_summary_cancel_subscription_header",
  CANCEL_SUBSCRIPTION: "account_summary_cancel_subscription_description",
  REQUEST_CANCELATION_BUTTON: "account_summary_cancel_subscription_button",
  CANCELATION_PENDING_HEADING:
    "team_account_cancel_widget_requested_pending_heading",
  CANCELATION_PENDING_CONTENT:
    "team_account_cancel_widget_requested_pending_content_markup",
  REACTIVATE_SUBSCRIPTION_HEADING:
    "team_account_cancel_widget_requested_complete_heading",
  REACTIVATE_SUBSCRIPTION_CONTENT:
    "team_account_cancel_widget_requested_complete_content",
  REACTIVATE_SUBSCRIPTION_BUTTON:
    "team_account_cancel_widget_requested_complete_button",
};
type KeyType = "heading" | "paragraph" | "button";
type KeyMap = Record<CancellationStatus, Partial<Record<KeyType, string>>>;
const copy: KeyMap = {
  none: {
    heading: I18N_KEYS.NEED_A_CHANGE_HEADER,
    paragraph: I18N_KEYS.CANCEL_SUBSCRIPTION,
    button: I18N_KEYS.REQUEST_CANCELATION_BUTTON,
  },
  pending: {
    heading: I18N_KEYS.CANCELATION_PENDING_HEADING,
    paragraph: I18N_KEYS.CANCELATION_PENDING_CONTENT,
  },
  canceled: {
    heading: I18N_KEYS.REACTIVATE_SUBSCRIPTION_HEADING,
    paragraph: I18N_KEYS.REACTIVATE_SUBSCRIPTION_CONTENT,
    button: I18N_KEYS.REACTIVATE_SUBSCRIPTION_BUTTON,
  },
  unknown: {},
};
export const getKey = (
  status: CancellationStatus,
  keyType: KeyType,
  translate: TranslateFunction
) => {
  switch (status) {
    case CancellationStatus.None:
      return translate(copy.none[keyType] ?? "");
    case CancellationStatus.Pending:
      return keyType === "paragraph"
        ? translate.markup(
            copy.pending[keyType] ?? "",
            {},
            { linkTarget: "_blank" }
          )
        : translate(copy.pending[keyType] ?? "");
    case CancellationStatus.Canceled:
      return translate(copy.canceled[keyType] ?? "");
    case CancellationStatus.Unknown:
      return "";
  }
};
