import { LoadingIcon } from "@dashlane/ui-components";
import { colors, Flex, Heading } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  TITLE: "login_account_recovery_key_processing_request",
};
export const FinalisingStep = () => {
  const { translate } = useTranslate();
  return (
    <Flex
      sx={{
        flexDirection: "column",
        margin: "0 auto",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <LoadingIcon
        size={78}
        color={colors.lightTheme.ds.text.brand.quiet}
        strokeWidth={1}
      />
      <Heading
        as="h1"
        textStyle="ds.title.section.large"
        sx={{ margin: "61px 0 24px" }}
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>
    </Flex>
  );
};
