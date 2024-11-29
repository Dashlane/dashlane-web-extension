import { Button, Flex, Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  redirect,
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
const I18N_KEYS = {
  BACK: "_common_action_back",
  ERROR_GENERIC: "team_account_teamplan_changeplan_error_generic",
};
export const BackButton = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const handleClickOnBackButton = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      redirect(routes.teamAccountRoutePath);
    }
  };
  return (
    <div>
      <Button
        mood="neutral"
        intensity="supershy"
        onClick={handleClickOnBackButton}
      >
        <Flex alignItems="center">
          <Icon size="medium" name="ArrowLeftOutlined" />
          <Paragraph
            color="ds.text.neutral.standard"
            textStyle="ds.title.block.medium"
            sx={{ marginLeft: "14px" }}
          >
            {translate(I18N_KEYS.BACK)}
          </Paragraph>
        </Flex>
      </Button>
    </div>
  );
};
