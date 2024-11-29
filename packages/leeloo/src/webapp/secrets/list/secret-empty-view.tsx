import { Button, Flex, Icon } from "@dashlane/design-system";
import { AddIcon } from "@dashlane/ui-components";
import { EmptyView } from "../../empty-view/empty-view";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
const I18N_KEYS = {
  TITLE: "webapp_secrets_empty_view_title",
  DESCRIPTION: "webapp_secrets_empty_view_description",
  ADD_NOTE_BUTTON: "webapp_secure_notes_header_add",
};
export const SecretEmptyView = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const history = useHistory();
  const onClickAddNew = () => {
    history.push(routes.userAddBlankSecret);
  };
  return (
    <EmptyView
      icon={
        <Icon
          name="ItemSecretOutlined"
          size={"xlarge"}
          color="ds.text.neutral.quiet"
        />
      }
      title={translate(I18N_KEYS.TITLE)}
    >
      <p>{translate(I18N_KEYS.DESCRIPTION)}</p>
      <br />
      <Flex gap={4} justifyContent="center">
        <Button
          layout="iconLeading"
          icon={<AddIcon color="ds.text.inverse.catchy" />}
          onClick={onClickAddNew}
        >
          {translate(I18N_KEYS.ADD_NOTE_BUTTON)}
        </Button>
      </Flex>
    </EmptyView>
  );
};
