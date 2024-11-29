import { useState } from "react";
import { Button, Heading, Paragraph } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { CreateDialog } from "../collection-view/dialogs";
const I18N_KEYS = {
  TITLE: "collections_overview_create_title",
  DESCRIPTION: "collections_overview_create_description",
  CREATE_COLLECTION_CTA: "collections_dialog_create_header_title",
};
export const CollectionsOverviewCreate = () => {
  const { translate } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOnCreate = () => {
    setIsOpen(true);
    logPageView(PageView.CollectionCreate);
  };
  return (
    <div
      sx={{
        margin: "auto",
        textAlign: "center",
        width: "700px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Heading
        as="h1"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <Button
        layout="iconLeading"
        icon="ActionAddOutlined"
        onClick={handleClickOnCreate}
        sx={{ margin: "auto" }}
      >
        {translate(I18N_KEYS.CREATE_COLLECTION_CTA)}
      </Button>
      {isOpen && <CreateDialog onClose={() => setIsOpen(false)} />}
    </div>
  );
};
