import { useEffect, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { DataStatus } from "@dashlane/framework-react";
import { Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { Redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { useHasDismissedGetStarted } from "./hooks/use-get-started-dismissed";
import { useGetStartedTaskCompletion } from "./hooks/use-get-started-task-completion";
import { DismissGuideButton, DismissGuideModal } from "./dismiss-guide";
import { InstallExtensionTask } from "./tasks/install-extension/install-extension-task";
import { Assistance } from "./assistance/assistance";
import { TaskStatus } from "./types/item.types";
import { GetStartedSections } from "./sections/get-started-sections";
import { GuideUserType } from "./types/user.types";
import { ProfileNewAdminTask } from "./tasks/profile-new-admin/profile-new-admin-task";
const I18N_KEYS = {
  TITLE_WELCOME_TO_DASHLANE_VAULT: "onb_vault_get_started_title_welcome",
  SUBTITLE_HELPFUL_TIPS_TEXT_ADMIN: "onb_vault_get_started_title_tips",
  SUBTITLE_HELPFUL_TIPS_TEXT_B2C: "onb_vault_get_started_title_tips_b2c",
  SUBTITLE_DISMISS_SUGGESTION: "onb_vault_get_started_dissmiss_suggestion",
};
const RIGHT_SECTION_WIDTH = "246px";
interface GetStartedProps {
  userType: GuideUserType;
}
export const GetStarted = ({ userType }: GetStartedProps) => {
  const { translate } = useTranslate();
  const {
    routes: { clientRoutesBasePath },
  } = useRouterGlobalSettingsContext();
  const { isGetStartedDismissed } = useHasDismissedGetStarted();
  const [showDismissGuideModal, setShowDismissGuideModal] = useState(false);
  const tasksCompletion = useGetStartedTaskCompletion();
  const isInExtensionOrDesktop =
    tasksCompletion.status === DataStatus.Success &&
    tasksCompletion.isInExtensionOrDesktop;
  const hasCompletedAllTasks =
    tasksCompletion.status === DataStatus.Success &&
    Object.values(tasksCompletion.tasks).every(
      (task) => task === TaskStatus.COMPLETED
    );
  useEffect(() => {
    void logPageView(PageView.HomeAdminOnboardingChecklist);
  }, []);
  if (isGetStartedDismissed) {
    return <Redirect to={clientRoutesBasePath} />;
  }
  return (
    <div
      sx={{
        padding: "0 8px 48px",
      }}
    >
      <Heading
        textStyle="ds.title.section.large"
        color="ds.text.neutral.catchy"
        as="h1"
      >
        {translate(I18N_KEYS.TITLE_WELCOME_TO_DASHLANE_VAULT)}
      </Heading>
      <div
        sx={{
          display: "flex",
          gap: "32px",
          alignItems: "center",
          marginBottom: "42px",
          marginTop: "8px",
        }}
      >
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {translate(
            hasCompletedAllTasks
              ? translate(I18N_KEYS.SUBTITLE_DISMISS_SUGGESTION)
              : userType === GuideUserType.TEAM_CREATOR
              ? I18N_KEYS.SUBTITLE_HELPFUL_TIPS_TEXT_ADMIN
              : I18N_KEYS.SUBTITLE_HELPFUL_TIPS_TEXT_B2C
          )}
        </Paragraph>
        {hasCompletedAllTasks ? (
          <DismissGuideButton
            setShowModal={setShowDismissGuideModal}
            intensity="quiet"
          />
        ) : null}
      </div>
      <div
        sx={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: `1fr ${RIGHT_SECTION_WIDTH}`,
          "@media screen and (max-width: 1380px)": {
            gridTemplateColumns: "unset",
          },
        }}
      >
        <div
          sx={{
            display: "flex",
            gap: "32px",
            flexDirection: "column",
          }}
        >
          <InstallExtensionTask
            isInExtensionOrDesktop={isInExtensionOrDesktop}
          />

          {isInExtensionOrDesktop ? <ProfileNewAdminTask /> : null}

          <GetStartedSections userType={userType} />

          {!hasCompletedAllTasks ? (
            <div
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <DismissGuideButton
                setShowModal={setShowDismissGuideModal}
                intensity="supershy"
              />
            </div>
          ) : null}

          <DismissGuideModal
            isOpen={showDismissGuideModal}
            setShowDismissGuideModal={setShowDismissGuideModal}
          />
        </div>
        <div>
          <Assistance userType={userType} />
        </div>
      </div>
    </div>
  );
};
