import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useSpaces } from "../../libs/carbon/hooks/useSpaces";
import useTranslate from "../../libs/i18n/useTranslate";
export const useSpaceName = (spaceId: string) => {
  const spaces = useSpaces();
  const { translate } = useTranslate();
  if (spaces.status !== DataStatus.Success || spaces.data.length === 0) {
    return "";
  }
  return (
    spaces.data.find((space) => space.teamId === spaceId)?.teamName ||
    translate("webapp_form_field_personal_space")
  );
};
