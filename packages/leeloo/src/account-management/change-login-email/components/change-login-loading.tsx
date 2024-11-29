import { IndeterminateLoader, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  LOADING_TITLE: "webapp_account_management_change_login_email_loading_title",
};
export const ChangeLoginLoading = () => {
  const { translate } = useTranslate();
  return (
    <>
      <IndeterminateLoader mood="brand" size={160} />
      <Paragraph textStyle="ds.title.section.large" sx={{ marginTop: "32px" }}>
        {translate(I18N_KEYS.LOADING_TITLE)}
      </Paragraph>
    </>
  );
};
