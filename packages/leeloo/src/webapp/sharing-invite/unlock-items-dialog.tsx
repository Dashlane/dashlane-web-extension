import { Heading } from "@dashlane/ui-components";
import { SharingInviteStep } from "./types";
import useTranslate from "../../libs/i18n/useTranslate";
import { ProtectedItemsForm } from "../unlock-items/components/protected-items-form";
import { LockedItemType } from "../unlock-items/types";
const I18N_KEYS = { LABEL: "webapp_lock_items_label" };
interface Props {
  goToStep: (step: SharingInviteStep) => void;
}
export const UnlockItemsDialog = ({ goToStep }: Props) => {
  const { translate } = useTranslate();
  return (
    <>
      <Heading as="h1" size="small" sx={{ mb: "16px" }}>
        {translate(I18N_KEYS.LABEL)}
      </Heading>
      <ProtectedItemsForm
        unlockRequest={{
          itemType: LockedItemType.SharedItems,
          successCallback: () => goToStep(SharingInviteStep.Permission),
          cancelCallback: () => goToStep(SharingInviteStep.Recipients),
        }}
      />
    </>
  );
};
