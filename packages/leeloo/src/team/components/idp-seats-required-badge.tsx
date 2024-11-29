import { Badge, Tooltip } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
interface Props {
  requiredSeatsForIdP: number;
}
const I18N_KEYS = {
  SEATS_REQUIRED_FOR_PROVISIONING: "team_idp_errors_badge_seats_required",
  TOOLTIP_CONTENT: "team_idp_errors_badge_seats_required_tooltip",
};
export const IdPSeatsRequiredBadge = ({ requiredSeatsForIdP }: Props) => {
  const { translate } = useTranslate();
  return (
    <Tooltip
      content={translate(I18N_KEYS.TOOLTIP_CONTENT, {
        count: requiredSeatsForIdP,
      })}
    >
      <Badge
        label={translate(I18N_KEYS.SEATS_REQUIRED_FOR_PROVISIONING, {
          count: requiredSeatsForIdP,
          nbOfRequiredSeats: requiredSeatsForIdP,
        })}
        mood="danger"
        intensity="quiet"
      />
    </Tooltip>
  );
};
