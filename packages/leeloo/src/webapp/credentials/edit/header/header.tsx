import { DataStatus } from "@dashlane/framework-react";
import { ParsedURL } from "@dashlane/url-parser";
import { Credential } from "@dashlane/vault-contracts";
import { CredentialInfoSize } from "../../../../libs/dashlane-style/credential-info/credential-info";
import { CredentialThumbnail } from "../../../../libs/dashlane-style/credential-info/credential-thumbnail";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { CredentialTabs } from "../types";
import { PanelHeader } from "../../../panel";
import { useSharedAccessData } from "../../../shared-access/hooks/use-shared-access-data";
const { SHARED_ACCESS, ACCOUNT_DETAILS } = CredentialTabs;
export interface Props {
  credential: Credential;
  displayTabs: boolean;
  changeTab: (newActiveTab: CredentialTabs) => void;
  currentTab?: CredentialTabs;
}
export const EditHeader = ({
  credential,
  displayTabs,
  changeTab,
  currentTab,
}: Props) => {
  const { translate } = useTranslate();
  const { data, status } = useSharedAccessData(credential.id);
  const sharedCount = status === DataStatus.Success ? data?.count : 0;
  const tabIndexes: Record<number, number> = {
    [ACCOUNT_DETAILS]: 0,
    [SHARED_ACCESS]: 1,
  };
  const tabs = [
    {
      id: "tab-credential-detail",
      contentId: "content-credential-detail",
      title: translate("webapp_credential_edition_account_details"),
      onSelect: () => changeTab(ACCOUNT_DETAILS),
    },
    {
      id: "tab-credential-shared-access",
      contentId: "content-credential-shared-access",
      title: `${translate(
        "webapp_credential_edition_shared_access"
      )} (${sharedCount})`,
      onSelect: () => changeTab(SHARED_ACCESS),
    },
  ];
  return (
    <PanelHeader
      icon={
        <CredentialThumbnail
          title={credential.itemName}
          size={CredentialInfoSize.LARGE}
          domain={new ParsedURL(credential.URL).getRootDomain()}
        />
      }
      title={credential.itemName}
      tabIndex={currentTab !== undefined ? tabIndexes[currentTab] : undefined}
      tabs={displayTabs ? Object.values(tabs) : undefined}
    />
  );
};
