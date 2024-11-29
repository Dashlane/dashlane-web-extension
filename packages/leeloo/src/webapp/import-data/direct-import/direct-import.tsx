import { Button, Flex } from "@dashlane/design-system";
import { Heading } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  useHistory,
  useParams,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { DirectImportLastPass } from "./lastpass/direct-import-lastpass";
import { DirectImportSlug } from "./types";
const I18N_KEYS = {
  GENERIC_ERROR: "_common_generic_error",
  BACK: "_common_action_back",
};
export const DirectImport = () => {
  const { translate } = useTranslate();
  const { source } = useParams<{
    source: DirectImportSlug;
  }>();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const handleBackClick = () => {
    history.push(routes.importData);
  };
  switch (source) {
    case DirectImportSlug.LastPass: {
      return <DirectImportLastPass />;
    }
    default: {
      return (
        <Flex gap={6}>
          <Heading>{translate(I18N_KEYS.GENERIC_ERROR)}</Heading>
          <Button mood="brand" intensity="catchy" onClick={handleBackClick}>
            {translate(I18N_KEYS.BACK)}
          </Button>
        </Flex>
      );
    }
  }
};
