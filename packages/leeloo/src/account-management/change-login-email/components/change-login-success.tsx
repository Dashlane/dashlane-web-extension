import React from "react";
import { Button, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
const I18N_KEYS = {
  SUCCESS_TITLE: "webapp_account_management_change_login_email_success_title",
  SUCCESS_DESCRIPTION:
    "webapp_account_management_change_login_email_success_description",
  SUCCESS_BUTTON: "webapp_account_management_change_login_email_success_button",
};
export const ChangeLoginSuccess = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  return (
    <>
      <ExpressiveIcon
        name="FeedbackSuccessOutlined"
        size="xlarge"
        mood="positive"
        sx={{ marginBottom: "32px" }}
      />
      <Paragraph
        textStyle="ds.title.section.large"
        sx={{ marginBottom: "16px" }}
      >
        {translate(I18N_KEYS.SUCCESS_TITLE)}
      </Paragraph>
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.SUCCESS_DESCRIPTION)}
      </Paragraph>
      <Button
        sx={{ marginTop: "48px" }}
        onClick={() => history.replace(routes.userCredentials)}
      >
        {translate(I18N_KEYS.SUCCESS_BUTTON)}
      </Button>
    </>
  );
};
