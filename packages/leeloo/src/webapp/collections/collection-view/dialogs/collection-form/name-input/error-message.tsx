import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
export const ErrorMessage = () => {
  const { translate } = useTranslate();
  return (
    <Paragraph
      sx={{
        color: "ds.text.danger.quiet",
        maxWidth: "480px",
      }}
    >
      {translate("collections_dialog_create_already_exist_error")}
    </Paragraph>
  );
};
