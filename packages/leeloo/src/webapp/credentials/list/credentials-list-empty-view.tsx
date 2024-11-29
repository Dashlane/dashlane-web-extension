import { Button, Flex, Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import {
  usePasswordLimitPaywall,
  usePaywall,
} from "../../../libs/paywall/paywallContext";
import { EmptyView } from "../../empty-view/empty-view";
import { PaywallName } from "../../paywall";
const I18N_KEYS = {
  EMPTY_VIEW_TITLE: "webapp_credentials_empty_view_title",
  EMPTY_VIEW_DESCRIPTION: "webapp_credentials_empty_view_description",
  ADD_NEW_BUTTON: "credentials_header_add_password",
  IMPORT_DATA_BUTTON: "webapp_account_root_import_data",
};
export const CredentialsListEmptyView = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const usePasswordLimitResult = usePasswordLimitPaywall();
  const shouldShowAtOrOverLimitContent =
    !usePasswordLimitResult.isLoading &&
    usePasswordLimitResult.shouldShowAtOrOverLimitContent;
  const { openPaywall } = usePaywall();
  const passwordLimitDataLoading = shouldShowAtOrOverLimitContent === null;
  const onClickAddNew = () => {
    if (shouldShowAtOrOverLimitContent) {
      openPaywall(PaywallName.Credential);
    } else {
      history.push(routes.userAddWebsiteCredential);
    }
  };
  return (
    <EmptyView
      title={translate(I18N_KEYS.EMPTY_VIEW_TITLE)}
      icon={
        <Icon
          name="ItemLoginOutlined"
          color="ds.text.neutral.standard"
          sx={{ width: "64px", minWidth: "64px", height: "64px" }}
        />
      }
    >
      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.EMPTY_VIEW_DESCRIPTION)}
      </Paragraph>
      <Flex gap={4} justifyContent="center" sx={{ marginTop: "16px" }}>
        <Button
          layout="iconLeading"
          icon="ActionAddOutlined"
          onClick={onClickAddNew}
          disabled={passwordLimitDataLoading}
        >
          {translate(I18N_KEYS.ADD_NEW_BUTTON)}
        </Button>
        <Button
          layout="iconLeading"
          icon="DownloadOutlined"
          mood="neutral"
          intensity="quiet"
          onClick={() => history.push(routes.importData)}
        >
          {translate(I18N_KEYS.IMPORT_DATA_BUTTON)}
        </Button>
      </Flex>
    </EmptyView>
  );
};
