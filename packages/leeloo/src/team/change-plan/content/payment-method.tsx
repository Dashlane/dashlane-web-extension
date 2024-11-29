import useTranslate from "../../../libs/i18n/useTranslate";
import * as React from "react";
import { ChangePlanCard } from "../layout/change-plan-card";
const I18N_KEYS = {
  HEADER: "team_account_teamplan_changeplan_payment_method_header",
};
export const PaymentMethod = () => {
  const { translate } = useTranslate();
  return (
    <ChangePlanCard title={translate(I18N_KEYS.HEADER)}>Test</ChangePlanCard>
  );
};
