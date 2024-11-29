import React from "react";
import { Button } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
export const DeleteAction = ({ onClick }: { onClick: () => void }) => {
  const { translate } = useTranslate();
  return (
    <Button
      size="small"
      layout="iconLeading"
      mood="neutral"
      onClick={onClick}
      icon="ActionDeleteOutlined"
    >
      {translate("webapp_panel_edition_generic_delete")}
    </Button>
  );
};
