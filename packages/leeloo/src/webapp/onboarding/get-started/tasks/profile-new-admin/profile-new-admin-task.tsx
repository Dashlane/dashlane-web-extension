import { Button, Heading, Paragraph } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import illustration from "@dashlane/design-system/assets/illustrations/streamlined-secure-collaboration-maximize-protection@2x-light.webp";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useHistory } from "../../../../../libs/router/dom";
import {
  TOTAL_NUM_OF_PROFILING_QUESTIONS,
  useProfileAdminTask,
} from "../../../../profile-admin/hooks/use-profile-admin-task";
import { logAdminProfilingResume, logAdminProfilingStart } from "../../logs";
import { ProfileNewAdminDuration } from "./profile-new-admin-task-duration";
import { ProfileNewAdminRemainingQuestions } from "./profile-new-admin-task-remaining-question";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router";
import { ONBOARDING_TASKS_STYLE } from "../style";
export const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_profile_new_admin_title",
  DESCRIPTION: "onb_vault_get_started_task_profile_new_admin_description",
  BUTTON_START: "onb_vault_get_started_task_profile_new_admin_button_start",
  TITLE_RESUME: "onb_vault_get_started_task_profile_new_admin_title_resume",
  DESCRIPTION_RESUME:
    "onb_vault_get_started_task_profile_new_admin_description_resume",
  BUTTON_RESUME: "onb_vault_get_started_task_profile_new_admin_button_resume",
};
export const ProfileNewAdminTask = () => {
  const profileAdminTask = useProfileAdminTask();
  const { translate } = useTranslate();
  const history = useHistory();
  const {
    routes: { userProfileAdmin },
  } = useRouterGlobalSettingsContext();
  if (
    profileAdminTask.status !== DataStatus.Success ||
    !profileAdminTask.isProfilingAdminTodo
  ) {
    return null;
  }
  const isStartTask =
    profileAdminTask.profilingRemainingQuestions ===
    TOTAL_NUM_OF_PROFILING_QUESTIONS;
  const handleButtonClick = () => {
    if (isStartTask) {
      logAdminProfilingStart();
    } else {
      logAdminProfilingResume();
    }
    history.push(userProfileAdmin);
  };
  return (
    <div
      sx={{
        ...ONBOARDING_TASKS_STYLE.JUMBOTRON_CONTAINER,
        alignItems: "center",
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {isStartTask ? (
          <ProfileNewAdminDuration />
        ) : (
          <ProfileNewAdminRemainingQuestions
            remainingQuestion={profileAdminTask.profilingRemainingQuestions}
          />
        )}
        <Heading
          as="h2"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
          sx={{
            fontSize: "22px",
          }}
        >
          {translate(isStartTask ? I18N_KEYS.TITLE : I18N_KEYS.TITLE_RESUME)}
        </Heading>

        <Paragraph color="ds.text.neutral.standard">
          {translate(
            isStartTask ? I18N_KEYS.DESCRIPTION : I18N_KEYS.DESCRIPTION_RESUME
          )}
        </Paragraph>

        <Button
          mood="brand"
          icon="ArrowRightOutlined"
          layout="iconTrailing"
          onClick={handleButtonClick}
        >
          {translate(
            isStartTask ? I18N_KEYS.BUTTON_START : I18N_KEYS.BUTTON_RESUME
          )}
        </Button>
      </div>

      <div
        sx={{
          padding: "24px 40px",
          width: "320px",
          display: "flex",
          alignContent: "center",
          minWidth: "320px",
          borderRadius: "8px",
          backgroundColor: "ds.container.agnostic.neutral.quiet",
        }}
      >
        <img
          sx={{
            userSelect: "none",
            pointerEvents: "none",
            width: "240px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
          alt=""
          aria-hidden={true}
          src={illustration}
        />
      </div>
    </div>
  );
};
