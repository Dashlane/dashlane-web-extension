import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useHasFeatureEnabled } from "../../../../libs/carbon/hooks/useHasFeature";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { IdGroupTab } from "./id-card";
export const getEditPanelId = (itemId: string) => `id-edit-panel-${itemId}`;
const getActiveTabFromSessionStorage = (itemId: string) => {
  const value = window.sessionStorage.getItem(getEditPanelId(itemId));
  if (value) {
    return parseInt(value, 10) as IdGroupTab;
  }
  return null;
};
export function useTabs(itemId: string) {
  const isAttachmentAllowed = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.TechweekWebAttachmentsForIdsV1
  );
  const editPanelRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<IdGroupTab>(
    getActiveTabFromSessionStorage(itemId) ?? IdGroupTab.DETAILS
  );
  const updateActiveTab = useCallback(
    (tab: IdGroupTab) => {
      window.sessionStorage.setItem(getEditPanelId(itemId), tab.toString());
      setActiveTab(tab);
    },
    [itemId]
  );
  const cleanActiveTab = useCallback(() => {
    window.sessionStorage.removeItem(getEditPanelId(itemId));
  }, [itemId]);
  const focusAttachment = useCallback(
    () => updateActiveTab(IdGroupTab.ATTACHMENTS),
    [updateActiveTab]
  );
  const { translate } = useTranslate();
  const tabs = useMemo(
    () => [
      {
        id: "tab-ids-detail",
        contentId: "content-ids-detail",
        title: translate("webapp_secure_notes_addition_tab_title_details"),
        onSelect: () => updateActiveTab(IdGroupTab.DETAILS),
      },
      {
        id: "tab-ids-attachments",
        contentId: "content-ids-attachments",
        title: translate(
          "webapp_secure_notes_edition_field_tab_title_attachments"
        ),
        onSelect: focusAttachment,
      },
    ],
    [focusAttachment, translate, updateActiveTab]
  );
  useEffect(() => {
    const resetTabWhenUserClosesPane = (event: MouseEvent) => {
      if (
        editPanelRef.current &&
        !editPanelRef.current.contains(event.target as Node)
      ) {
        cleanActiveTab();
      }
    };
    document.addEventListener("mousedown", resetTabWhenUserClosesPane);
    return () => {
      document.removeEventListener("mousedown", resetTabWhenUserClosesPane);
    };
  }, [cleanActiveTab, editPanelRef]);
  return {
    editPanelRef,
    hasTabs: isAttachmentAllowed,
    activeTab,
    tabs,
    focusAttachment,
    cleanActiveTab,
  };
}
