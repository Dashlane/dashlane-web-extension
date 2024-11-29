import { ShareItemFailureReason } from "@dashlane/sharing-contracts";
import { TranslateFunction } from "../../../libs/i18n/types";
export function getSharingFailureMessage(
  translate: TranslateFunction,
  reason?: ShareItemFailureReason
): string {
  const { ITEM_DOESNT_EXIST, LIMIT_EXCEEDED } = ShareItemFailureReason;
  switch (reason) {
    case ITEM_DOESNT_EXIST:
      return translate("webapp_sharing_invite_item_not_found");
    case LIMIT_EXCEEDED:
      return translate("webapp_sharing_invite_limit_exceeded");
    default:
      return translate("webapp_sharing_invite_server_error");
  }
}
