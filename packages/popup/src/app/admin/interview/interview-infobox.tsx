import { useEffect, useState } from "react";
import { Button, Infobox, jsx } from "@dashlane/design-system";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openExternalUrl } from "../../../libs/externalUrls";
const ADMIN_INTERVIEW_FF = "ace_admin_tab_interview";
const ADMIN_INTERVIEW_FF_DEV = "ace_admin_tab_interview_dev";
const INTERVIEW_INFOBOX_DISMISSED = "dashlane-interview-infobox-dismissed";
const INTERVIEW_URL = "__REDACTED__";
export const I18N_KEYS = {
  TITLE: "tab/admin/title",
  OPEN_CONSOLE_TITLE: "tab/admin/modules/open_console/title",
  OPEN_CONSOLE_CTA: "tab/admin/modules/open_console/cta_title",
  CANCEL: "tab/admin/interview/dismiss",
  INTERVIEW_TITLE: "tab/admin/interview/title",
  INTERVIEW_DESC: "tab/admin/interview/description",
  BOOK_TIME: "tab/admin/interview/book_time",
};
export const InterviewInfobox = () => {
  const { translate } = useTranslate();
  const { status: ffQueryStatus, data: featureFlips } = useFeatureFlips();
  const [isInterviewInfoVisible, setIsInterviewInfoVisible] = useState(false);
  const hasAdminInterviewFF =
    ffQueryStatus === DataStatus.Success
      ? featureFlips[ADMIN_INTERVIEW_FF] || featureFlips[ADMIN_INTERVIEW_FF_DEV]
      : false;
  useEffect(() => {
    const hasInfoboxBeenDismissed = window.localStorage.getItem(
      INTERVIEW_INFOBOX_DISMISSED
    );
    if (hasAdminInterviewFF && !hasInfoboxBeenDismissed) {
      setIsInterviewInfoVisible(true);
    }
  }, [hasAdminInterviewFF]);
  const openInterview = () => {
    void openExternalUrl(INTERVIEW_URL);
  };
  const closeInterviewInfobox = () => {
    window.localStorage.setItem(
      INTERVIEW_INFOBOX_DISMISSED,
      JSON.stringify(true)
    );
    setIsInterviewInfoVisible(false);
  };
  return isInterviewInfoVisible ? (
    <Infobox
      title={translate(I18N_KEYS.INTERVIEW_TITLE)}
      description={translate(I18N_KEYS.INTERVIEW_DESC)}
      icon="FeedbackHelpOutlined"
      mood="brand"
      size="large"
      actions={[
        <Button
          key="dismiss-interview"
          onClick={closeInterviewInfobox}
          size="small"
          mood="brand"
          intensity="quiet"
        >
          {translate(I18N_KEYS.CANCEL)}
        </Button>,
        <Button
          key="book-interview"
          onClick={openInterview}
          size="small"
          mood="brand"
          intensity="catchy"
        >
          {translate(I18N_KEYS.BOOK_TIME)}
        </Button>,
      ]}
    />
  ) : null;
};
