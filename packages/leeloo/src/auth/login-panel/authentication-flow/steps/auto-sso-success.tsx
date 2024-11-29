import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Paragraph,
} from "@dashlane/design-system";
import { CLIENT_URL_SEGMENT } from "../../../../app/routes/constants";
import { BasePanelContainer } from "../../../../left-panels/base-panel-container";
import { useHistory } from "../../../../libs/router";
import useTranslate from "../../../../libs/i18n/useTranslate";
const AUTO_CLOSE_TAB_TIMEOUT = 5;
const I18N_KEYS = {
  TITLE: "login_auto_sso_success_title",
  DESCRIPTION: "login_auto_sso_success_description",
  OPEN_VAULT_BUTTON: "login_auto_sso_success_cta",
};
export const AutoSsoSuccess = () => {
  const history = useHistory();
  const { translate } = useTranslate();
  const [count, setCount] = useState(AUTO_CLOSE_TAB_TIMEOUT);
  const handleRedirectToVault = () => {
    history.push(CLIENT_URL_SEGMENT);
  };
  useEffect(() => {
    let counterInterval: NodeJS.Timeout | undefined;
    if (count > 0) {
      counterInterval = setInterval(() => setCount(count - 1), 1000);
    } else {
      window.close();
    }
    return () => {
      clearInterval(counterInterval);
    };
  }, [count]);
  return (
    <BasePanelContainer backgroundColor="ds.background.default">
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          margin: "0 auto",
          height: "calc(100vh - 50px)",
          width: "550px",
        }}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          sx={{
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Icon
            name="FeedbackSuccessOutlined"
            color="ds.text.brand.quiet"
            sx={{ marginBottom: "48px", width: "62px", height: "62px" }}
          />

          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            sx={{ marginBottom: "16px" }}
          >
            {translate(I18N_KEYS.TITLE)}
          </Heading>
          <Paragraph
            as="label"
            textStyle="ds.body.standard.regular"
            sx={{ marginBottom: "48px" }}
          >
            {translate(I18N_KEYS.DESCRIPTION, { count })}
          </Paragraph>
          <Button onClick={handleRedirectToVault}>
            {translate(I18N_KEYS.OPEN_VAULT_BUTTON)}
          </Button>
        </Flex>
      </Flex>
    </BasePanelContainer>
  );
};
