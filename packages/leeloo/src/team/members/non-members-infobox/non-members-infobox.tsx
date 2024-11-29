import { useEffect, useState } from "react";
import { Button, Infobox } from "@dashlane/design-system";
import { downloadNonMembersCSVFile } from "./download-non-members-list-csv-file";
import { useNonMembersList } from "./use-non-members-list";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useDismissNonMembersInfobox } from "./use-dimiss-non-members-infobox";
const I18N_KEYS = {
  TITLE: "non_members_infobox_title",
  DESCRIPTION: "non_members_infobox_description",
  DISMISS: "non_members_infobox_dismiss_cta",
  DOWNLOAD: "non_members_infobox_download_cta",
};
export const NonMembersInfobox = () => {
  const { translate } = useTranslate();
  const { shouldShowNonMembersInfobox, nonMembersCount, nonMembersList } =
    useNonMembersList();
  const [isDownloading, setIsDownloading] = useState(false);
  const dismissNonMembersInfobox = useDismissNonMembersInfobox();
  useEffect(() => {
    if (isDownloading && nonMembersList.length) {
      downloadNonMembersCSVFile(nonMembersList);
      setIsDownloading(false);
    }
  }, [isDownloading, nonMembersList]);
  if (!shouldShowNonMembersInfobox) {
    return null;
  }
  return (
    <Infobox
      title={translate(I18N_KEYS.TITLE, {
        count: nonMembersCount,
      })}
      description={translate(I18N_KEYS.DESCRIPTION)}
      mood="warning"
      size="large"
      actions={[
        <Button
          key="dismiss-non-members-infobox"
          intensity="quiet"
          size="small"
          onClick={() => dismissNonMembersInfobox()}
        >
          {translate(I18N_KEYS.DISMISS)}
        </Button>,
        <Button
          key="download-non-members-list"
          size="small"
          isLoading={isDownloading}
          onClick={() => setIsDownloading(true)}
        >
          {translate(I18N_KEYS.DOWNLOAD)}
        </Button>,
      ]}
    />
  );
};
