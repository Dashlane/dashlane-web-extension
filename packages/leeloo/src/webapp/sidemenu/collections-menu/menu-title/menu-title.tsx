import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { CreateAction } from "./create-action";
export const MenuTitle = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginRight: "8px",
      }}
    >
      <Paragraph
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.standard"
      >
        {translate("webapp_credentials_header_row_category")}
      </Paragraph>
      <CreateAction />
    </div>
  );
};
