import React from "react";
import { IdCard, VaultItemType } from "@dashlane/vault-contracts";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useHasFeatureEnabled } from "../../../../libs/carbon/hooks/useHasFeature";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { getDescriptions } from "./common";
import { IdItemArticle } from "./id-item-article";
interface Props {
  item: IdCard;
  route: string;
}
const I18N_KEYS = {
  EXPIRES: "webapp_ids_id_cards_id_card_expires",
  EXPIRED: "webapp_ids_id_cards_id_card_expired",
  EXPIRES_DAYS: "webapp_ids_id_cards_id_card_expires_days",
  EXPIRES_MONTHS: "webapp_ids_id_cards_id_card_expires_months",
};
export const IdCardArticle = ({ item, route }: Props) => {
  const { translate } = useTranslate();
  const isExpiredLabelforIDEnabled = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.TechweekWebExpiredLabelforIDDev
  );
  const [additionalDescription, criticalityStatus] = getDescriptions(
    item.expirationDate,
    I18N_KEYS,
    isExpiredLabelforIDEnabled,
    translate
  );
  return (
    <IdItemArticle
      itemId={item.id}
      title={item.idName}
      description={item.idNumber}
      additionalDescription={additionalDescription}
      criticalityStatus={criticalityStatus}
      country={item.country}
      type={VaultItemType.IdCard}
      editRoute={route}
      copiableValue={item.idNumber}
    />
  );
};
