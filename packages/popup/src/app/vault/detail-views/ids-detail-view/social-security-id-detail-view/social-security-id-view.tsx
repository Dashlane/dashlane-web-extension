import React, { memo, useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { SocialSecurityIdDetailHeader } from "./social-security-id-header";
import { SocialSecurityIdDetailForm } from "./social-security-id-form";
interface Props {
  onClose: () => void;
  itemId: string;
}
const SocialSecurityIdDetailViewComponent = ({ onClose, itemId }: Props) => {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.SocialSecurityId],
    ids: [itemId],
  });
  useEffect(() => {
    logPageView(PageView.ItemSocialSecurityStatementDetails);
  }, []);
  if (
    status !== DataStatus.Success ||
    !data.socialSecurityIdsResult.items.length
  ) {
    return null;
  }
  const socialSecurityId = data.socialSecurityIdsResult.items[0];
  return (
    <>
      <SocialSecurityIdDetailHeader
        name={socialSecurityId.idName}
        id={socialSecurityId.id}
        onClose={onClose}
      />
      <SocialSecurityIdDetailForm socialSecurityId={socialSecurityId} />
    </>
  );
};
export const SocialSecurityIdDetailView = memo(
  SocialSecurityIdDetailViewComponent
);
