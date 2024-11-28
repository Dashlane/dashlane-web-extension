import React, { memo, useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { CompanyDetailHeader } from "./company-header";
import { CompanyDetailForm } from "./company-form";
interface Props {
  onClose: () => void;
  itemId: string;
}
const CompanyDetailViewComponent = ({ onClose, itemId }: Props) => {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Company],
    ids: [itemId],
  });
  useEffect(() => {
    logPageView(PageView.ItemCompanyDetails);
  }, []);
  if (status !== DataStatus.Success || !data.companiesResult.items.length) {
    return null;
  }
  const company = data.companiesResult.items[0];
  return (
    <>
      <CompanyDetailHeader
        name={company.companyName}
        id={company.id}
        onClose={onClose}
      />
      <CompanyDetailForm company={company} />
    </>
  );
};
export const CompanyDetailView = memo(CompanyDetailViewComponent);
