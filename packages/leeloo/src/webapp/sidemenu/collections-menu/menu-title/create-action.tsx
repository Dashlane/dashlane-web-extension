import { useRef, useState } from "react";
import { Button, Icon } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { CreateDialog } from "../../../collections/collection-view/dialogs";
export const CreateAction = () => {
  const { translate } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const handleClickOnCreate = () => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    } else {
      setIsOpen(true);
      logPageView(PageView.CollectionCreate);
    }
  };
  return (
    <div>
      <Button
        onClick={handleClickOnCreate}
        icon={
          <Icon
            name="ActionAddOutlined"
            title={translate("collections_sidemenu_create_icon_title")}
          />
        }
        layout={"iconOnly"}
        intensity="supershy"
        mood="neutral"
        size="medium"
        ref={ref}
      />
      {isOpen && <CreateDialog onClose={() => setIsOpen(false)} />}
    </div>
  );
};
