import React from "react";
import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { Country } from "@dashlane/vault-contracts";
import { DisplayField } from "@dashlane/design-system";
import { carbonConnector } from "../../../../carbonConnector";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  bankCode: string;
  country: Country;
}
const useBankDetails = ({ bankCode, country }: Props) => {
  const banksResult = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getBanks,
        queryParam: { country },
      },
    },
    []
  );
  if (banksResult.status !== "success") {
    return undefined;
  }
  return banksResult.data.banks?.find(
    (bankDetail) => bankDetail.code === bankCode.split("-").pop()
  );
};
export const IssuingBankInput = (props: Props) => {
  const { translate } = useTranslate();
  const bankDetails = useBankDetails(props);
  if (!bankDetails) {
    return null;
  }
  return (
    <DisplayField
      id="issuingBank"
      label={translate("tab/all_items/paymentCard/view/label/issuing_bank")}
      value={bankDetails.localizedString}
    />
  );
};
