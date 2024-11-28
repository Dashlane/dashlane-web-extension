import { forwardRef } from "react";
import { jsx, TabConfiguration, Tabs } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import {
  TabName,
  useActiveVaultTypeTabContext,
} from "./active-vault-type-tab-context";
const I18N_KEYS = {
  PREVIOUS: "tab/all_items/tab_bar/previous",
  NEXT: "tab/all_items/tab_bar/next",
  CREDENTIALS: "tab/all_items/tab_bar/credentials",
  IDS: "tab/all_items/tab_bar/ids",
  PAYMENTS: "tab/all_items/tab_bar/payments",
  PERSONAL_INFO: "tab/all_items/tab_bar/personal_info",
  SECURE_NOTES: "tab/all_items/tab_bar/secure_notes",
};
type Props = {};
export interface TabsBarHandle {
  focus: () => void;
}
const TabsBarComponent = () => {
  const { setActiveTabName } = useActiveVaultTypeTabContext();
  const { translate } = useTranslate();
  const tabs: TabConfiguration[] = [
    {
      id: "tab-credentials",
      contentId: "content-credentials",
      title: translate(I18N_KEYS.CREDENTIALS),
      onSelect: () => {
        logPageView(PageView.ItemCredentialList);
        setActiveTabName(TabName.Passwords);
      },
    },
    {
      id: "tab-payments",
      contentId: "content-payments",
      title: translate(I18N_KEYS.PAYMENTS),
      onSelect: () => {
        logPageView(PageView.ItemPaymentList);
        setActiveTabName(TabName.Payments);
      },
    },
    {
      id: "tab-secure-notes",
      contentId: "content-secure-notes",
      title: translate(I18N_KEYS.SECURE_NOTES),
      onSelect: () => {
        logPageView(PageView.ItemSecureNoteList);
        setActiveTabName(TabName.Notes);
      },
    },
    {
      id: "tab-personal-info",
      contentId: "content-personal-info",
      title: translate(I18N_KEYS.PERSONAL_INFO),
      onSelect: () => {
        logPageView(PageView.ItemPersonalInfoList);
        setActiveTabName(TabName.PersonalInfo);
      },
    },
    {
      id: "tab-ids",
      contentId: "content-ids",
      title: translate(I18N_KEYS.IDS),
      onSelect: () => {
        logPageView(PageView.ItemIdList);
        setActiveTabName(TabName.Ids);
      },
    },
  ];
  return (
    <div
      sx={{
        display: "flex",
        padding: "0 4px",
        margin: "0 4px",
        "* > button": {
          minWidth: "fit-content",
        },
      }}
      data-testid="popup_tabs_bar"
      data-tabs
    >
      <Tabs tabs={tabs} />
    </div>
  );
};
export const TabsBar = forwardRef<TabsBarHandle, Props>(TabsBarComponent);
