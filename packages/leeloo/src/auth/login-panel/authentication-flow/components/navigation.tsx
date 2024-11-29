import { redirect } from "../../../../libs/router";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ACCOUNT_CREATION_URL_SEGMENT } from "../../../../app/routes/constants";
import { Button, Flex, Paragraph } from "@dashlane/design-system";
const I18N_KEYS = {
  GET_STARTED: "webapp_auth_panel_create_sign_up",
  CREATE_AN_ACCOUNT: "webapp_auth_panel_create_an_account",
};
export const Navigation = () => {
  const { translate } = useTranslate();
  const redirectToAccountCreation = () => {
    redirect(ACCOUNT_CREATION_URL_SEGMENT);
  };
  return (
    <Flex
      justifyContent="flex-end"
      alignItems="center"
      sx={{ alignSelf: "end", marginRight: "80px", marginTop: "40px" }}
      role="navigation"
    >
      <Paragraph color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.CREATE_AN_ACCOUNT)}
      </Paragraph>
      <Button
        sx={{ marginLeft: "15px" }}
        type="button"
        intensity="quiet"
        onClick={redirectToAccountCreation}
      >
        {translate(I18N_KEYS.GET_STARTED)}
      </Button>
    </Flex>
  );
};
